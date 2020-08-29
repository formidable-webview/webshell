import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import dummyHelloScript from './feat/dummy-hello.webjs';
import dummyFailingScript from './feat/dummy-failing.webjs';
import dummyOptionScript from './feat/dummy-option.webjs';
import { makeWebshell } from '../make-webshell';
import { makeFeature } from '../make-feature';
import { MinimalWebViewProps, EventFeatureOf } from '../types';

const { waitForErsatz } = makeErsatzTesting(Ersatz);

const DummyWebView = ({}: MinimalWebViewProps) => <View />;

const helloFeature: EventFeatureOf<{}, 'onDummyHello', {}> = makeFeature({
  script: dummyHelloScript,
  eventHandlerName: 'onDummyHello',
  featureIdentifier: 'test.hello',
  payloadType: ''
});

const failingFeature: EventFeatureOf<{}, 'onDummyFailure', {}> = makeFeature({
  script: dummyFailingScript,
  eventHandlerName: 'onDummyFailure',
  featureIdentifier: 'test.fail',
  payloadType: undefined
});

const optionFeature: EventFeatureOf<
  { foo: string },
  'onDummyOption',
  { foo: string }
> = makeFeature({
  script: dummyOptionScript,
  eventHandlerName: 'onDummyOption',
  featureIdentifier: 'test.fail',
  payloadType: { foo: '' }
});

describe('Webshell component', () => {
  it('sould mount without error', () => {
    const Webshell = makeWebshell(DummyWebView, helloFeature.assemble({}));
    const { UNSAFE_getByType } = render(<Webshell />);
    const webshell = UNSAFE_getByType(Webshell);
    expect(webshell).toBeTruthy();
  });
  it('should handle feature messages', async () => {
    const onDummyHello = jest.fn();
    const Webshell = makeWebshell(Ersatz, helloFeature.assemble({}));
    await waitForErsatz(render(<Webshell onDummyHello={onDummyHello} />));
    expect(onDummyHello).toHaveBeenCalledWith('Hello world!');
  });
  it('should handle feature failures', async () => {
    const onDummyMessage = jest.fn();
    const onFailure = jest.fn();
    const Webshell = makeWebshell(Ersatz, failingFeature.assemble({}));
    await waitForErsatz(
      render(
        <Webshell onDummyFailure={onDummyMessage} onDOMError={onFailure} />
      )
    );
    expect(onFailure).toHaveBeenCalledWith(
      failingFeature.featureIdentifier,
      'I am a dummy feature failing consistently!'
    );
  });
  it('should pass options to feature scripts', async () => {
    const onDummyOption = jest.fn();
    const Webshell = makeWebshell(
      Ersatz,
      optionFeature.assemble({ foo: 'bar' })
    );
    await waitForErsatz(render(<Webshell onDummyOption={onDummyOption} />));
    expect(onDummyOption).toHaveBeenCalledWith({ foo: 'bar' });
  });
  it('should keep support for onMessage and injectedJavascript', async () => {
    const onDummyOption = jest.fn();
    const onMessage = jest.fn();
    const injectedJavaScript = "window.ReactNativeWebView.postMessage('test');";
    const Webshell = makeWebshell(
      Ersatz,
      optionFeature.assemble({ foo: 'bar' })
    );
    await waitForErsatz(
      render(
        <Webshell
          onDummyOption={onDummyOption}
          injectedJavaScript={injectedJavaScript}
          onMessage={onMessage}
        />
      )
    );
    expect(onDummyOption).toHaveBeenCalledWith({ foo: 'bar' });
    expect(onMessage).toHaveBeenCalledTimes(1);
  });
  it('it should provide a reference to the inner WebView', async () => {
    const Webshell = makeWebshell(Ersatz);
    const ersatzRef = React.createRef<Ersatz>();
    await waitForErsatz(render(<Webshell ref={ersatzRef} />));
    expect(ersatzRef.current).toBeInstanceOf(Ersatz);
  });
});
