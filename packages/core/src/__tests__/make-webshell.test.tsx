import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import dummyHelloScript from './feat/dummy-hello.webjs';
import dummyFailingScript from './feat/dummy-failing.webjs';
import dummyOptionScript from './feat/dummy-option.webjs';
import dummyHandleridScript from './feat/dummy-handlerid.webjs';
import { makeWebshell } from '../make-webshell';
import { FeatureBuilder } from '../FeatureBuilder';
import { MinimalWebViewProps } from '../types';

const { waitForErsatz } = makeErsatzTesting(Ersatz);

const DummyWebView = ({}: MinimalWebViewProps) => <View />;

const HelloFeature = new FeatureBuilder({
  script: dummyHelloScript,
  featureIdentifier: 'test.hello',
  defaultOptions: {}
})
  .withandlerProp('onDOMDummyHello')
  .build();

const FailingFeature = new FeatureBuilder({
  script: dummyFailingScript,
  featureIdentifier: 'test.fail',
  defaultOptions: {}
})
  .withandlerProp('onDOMDummyFailure')
  .build();

const OptionFeature = new FeatureBuilder({
  script: dummyOptionScript,
  featureIdentifier: 'test.option',
  defaultOptions: {}
})
  .withandlerProp<{ foo: string }, 'onDOMDummyOption'>('onDOMDummyOption')
  .build();

const HandlerIdFeature = new FeatureBuilder({
  script: dummyHandleridScript,
  featureIdentifier: 'test.handlerid',
  defaultOptions: {}
})
  .withandlerProp('onDOMDummyOption', 'hi')
  .build();

describe('Webshell component', () => {
  it('sould mount without error', () => {
    const Webshell = makeWebshell(DummyWebView, new HelloFeature());
    const { UNSAFE_getByType } = render(<Webshell />);
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
  it('should handle feature failures', async () => {
    const onDOMDummyFailure = jest.fn();
    const onFailure = jest.fn();
    const Webshell = makeWebshell(Ersatz, new FailingFeature());
    await waitForErsatz(
      render(
        <Webshell
          webshellDebug={false}
          onDOMDummyFailure={onDOMDummyFailure}
          onDOMError={onFailure}
        />
      )
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
        <Webshell webshellDebug={false} onDOMDummyOption={onDOMDummyOption} />
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
          webshellDebug={false}
          onDOMDummyOption={onHandlerIdDummyOption}
        />
      )
    );
    expect(onHandlerIdDummyOption).toHaveBeenCalledWith('Hello world!');
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
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
  it('it should provide a reference to the inner WebView', async () => {
    const Webshell = makeWebshell(Ersatz);
    const ersatzRef = React.createRef<Ersatz>();
    await waitForErsatz(
      render(<Webshell webshellDebug={false} ref={ersatzRef} />)
    );
    expect(ersatzRef.current).toBeInstanceOf(Ersatz);
  });
});
