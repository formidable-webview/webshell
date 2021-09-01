import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import {
  waitForErsatz,
  waitForWindow
} from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import dummyHelloScript from './feat/DummyHello.webjs';
import dummyFailingScript from './feat/DummyFailing.webjs';
import dummyOptionScript from './feat/DummyOption.webjs';
import dummyHandleridScript from './feat/DummyHandlerid.webjs';
import dummyReceiverScript from './feat/DummyReceiver.webjs';
import makeWebshell from '../makeWebshell';
import FeatureBuilder from '../FeatureBuilder';
import {
  MinimalWebViewProps,
  WebHandle,
  WebshellInvariantProps
} from '../types';
import { act } from 'react-test-renderer';

const defaultWebshellProps: WebshellInvariantProps = {
  webshellDebug: true,
  webshellStrictMode: true
};

const DummyWebView = React.forwardRef(({}: MinimalWebViewProps, ref) => {
  React.useImperativeHandle(ref, () => ({
    injectJavaScript() {}
  }));
  return <View ref={ref as any} />;
});

const HelloFeature = new FeatureBuilder({
  script: dummyHelloScript,
  identifier: 'test.hello',
  defaultOptions: {}
})
  .withShellHandler('onDOMDummyHello')
  .build();

const FailingFeature = new FeatureBuilder({
  script: dummyFailingScript,
  identifier: 'test.fail',
  defaultOptions: {}
})
  .withShellHandler('onDOMDummyFailure')
  .build();

const OptionFeature = new FeatureBuilder({
  script: dummyOptionScript,
  identifier: 'test.option',
  defaultOptions: {}
})
  .withShellHandler<'onDOMDummyOption', { foo: string }>('onDOMDummyOption')
  .build();

const HandlerIdFeature = new FeatureBuilder({
  script: dummyHandleridScript,
  identifier: 'test.handlerid',
  defaultOptions: {}
})
  .withShellHandler('onDOMDummyOption', 'hi')
  .build();

const ReceiverFeature = new FeatureBuilder({
  script: dummyReceiverScript,
  identifier: 'test.receiver',
  defaultOptions: {}
})
  .withShellHandler<'onWebFeedback', string>('onWebFeedback')
  .withWebHandler<'hello', string>('hello')
  .build();

describe('Webshell component', () => {
  it('sould mount without error', () => {
    const Webshell = makeWebshell(DummyWebView, new HelloFeature());
    const { UNSAFE_getByType } = render(<Webshell {...defaultWebshellProps} />);
    const webshell = UNSAFE_getByType(Webshell);
    expect(webshell).toBeTruthy();
  });
  it('should handle feature messages', async () => {
    const onDOMDummyHello = jest.fn();
    const Webshell = makeWebshell(Ersatz, new HelloFeature());
    await waitForErsatz(
      render(
        <Webshell webshellDebug={false} onDOMDummyHello={onDOMDummyHello} />
      )
    );
    expect(onDOMDummyHello).toHaveBeenCalledWith('Hello world!');
  });
  it('should set debug variable in the Web environment after loading', async () => {
    const Webshell = makeWebshell(Ersatz);
    const window = await waitForWindow(
      render(<Webshell webshellDebug={true} />)
    );
    expect(window.ReactNativeWebshell.debug).toBe(true);
  });
  it('should handle feature failures with onWebFeatureError', async () => {
    const onFailure = jest.fn();
    const Webshell = makeWebshell(Ersatz, new FailingFeature());
    await waitForErsatz(
      render(<Webshell webshellDebug={false} onWebFeatureError={onFailure} />)
    );
    expect(onFailure).toHaveBeenCalledWith(
      FailingFeature.identifier,
      'I am a dummy feature failing consistently!'
    );
  });
  it('should pass options to feature scripts', async () => {
    const onDOMDummyOption = jest.fn();
    const Webshell = makeWebshell(Ersatz, new OptionFeature({ foo: 'bar' }));
    await waitForErsatz(
      render(
        <Webshell
          {...defaultWebshellProps}
          onDOMDummyOption={onDOMDummyOption}
        />
      )
    );
    expect(onDOMDummyOption).toHaveBeenCalledWith({ foo: 'bar' });
  });
  it('should disambiguate between handlerIds', async () => {
    const onHandlerIdDummyOption = jest.fn();
    const Webshell = makeWebshell(Ersatz, new HandlerIdFeature());
    await waitForErsatz(
      render(
        <Webshell
          {...defaultWebshellProps}
          onDOMDummyOption={onHandlerIdDummyOption}
        />
      )
    );
    expect(onHandlerIdDummyOption).toHaveBeenCalledWith('Hello world!');
  });
  it('should support receiving messages', async () => {
    const onWebFeedback = jest.fn();
    const feature = new ReceiverFeature();
    const Webshell = makeWebshell(Ersatz, feature);
    const webHandleRef = React.createRef<WebHandle>();
    await waitForErsatz(
      render(
        <Webshell
          webHandleRef={webHandleRef}
          onWebFeedback={onWebFeedback}
          {...defaultWebshellProps}
        />
      )
    );
    act(() => {
      webHandleRef.current?.postMessageToWeb(feature, 'hello', 'Hello world!');
    });
    expect(onWebFeedback).toHaveBeenCalledWith('Hello world!');
  });
  it('should buffer messages to Web environment during loading', async () => {
    const receiverFeature = new ReceiverFeature();
    const Webshell = makeWebshell(Ersatz, receiverFeature);

    const ReceiverController = function () {
      const [hasReceivedResponse, setHasReceivedResponse] = React.useState(
        false
      );
      const webHandle = React.createRef<WebHandle>();
      const onWebFeedback = React.useCallback(() => {
        setHasReceivedResponse(true);
      }, []);
      React.useEffect(() => {
        webHandle.current?.postMessageToWeb(
          receiverFeature,
          'hello',
          'Hello world!'
        );
      }, [webHandle]);
      const testID = `receiver-${hasReceivedResponse ? 'loaded' : 'loading'}`;
      return (
        <View testID={testID}>
          <Webshell
            onWebFeedback={onWebFeedback}
            webHandleRef={webHandle}
            {...defaultWebshellProps}
          />
        </View>
      );
    };
    const { findByTestId } = render(<ReceiverController />);
    await findByTestId('receiver-loaded', {
      timeout: 500
    });
  });
  it('should keep support for onMessage and injectedJavaScript', async () => {
    const onDOMDummyOption = jest.fn();
    const onMessage = jest.fn();
    const injectedJavaScript = "window.ReactNativeWebView.postMessage('test');";
    const Webshell = makeWebshell(Ersatz, new OptionFeature({ foo: 'bar' }));
    await waitForErsatz(
      render(
        <Webshell
          onDOMDummyOption={onDOMDummyOption}
          injectedJavaScript={injectedJavaScript}
          onMessage={onMessage}
        />
      )
    );
    expect(onDOMDummyOption).toHaveBeenCalledWith({ foo: 'bar' });
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        nativeEvent: expect.objectContaining({
          data: 'test'
        })
      })
    );
  });
  it('it should provide a reference to the inner WebView', async () => {
    const Webshell = makeWebshell(Ersatz);
    const ersatzRef = React.createRef<any>();
    await waitForErsatz(
      render(<Webshell webshellDebug={false} ref={ersatzRef} />)
    );
    expect(ersatzRef.current).toBeTruthy();
  });
});
