import * as React from 'react';
import TestRenderer from 'react-test-renderer';
import dummyHelloScript from './feat/dummy-hello.webjs';
import dummyFailingScript from './feat/dummy-failing.webjs';
import dummyOptionScript from './feat/dummy-option.webjs';
import { makeWebshell } from '../make-webshell';
import { makeFeature } from '../make-feature';
import { validateJavascript } from './core-utils';
import WebView from './WebView';

const helloFeature = makeFeature({
  script: dummyHelloScript,
  eventHandlerName: 'onDummyHello',
  identifier: 'test.hello',
  payloadType: ''
});
const failingFeature = makeFeature({
  script: dummyFailingScript,
  eventHandlerName: 'onDummyFailure',
  identifier: 'test.fail',
  payloadType: undefined
});
const optionFeature = makeFeature<
  { foo: string },
  'onDummyOption',
  { foo: string }
>({
  script: dummyOptionScript,
  eventHandlerName: 'onDummyOption',
  identifier: 'test.fail',
  payloadType: { foo: '' }
});

describe('Webshell component', () => {
  it('sould mount without error', () => {
    const Webshell = makeWebshell(WebView, helloFeature.assemble());
    const renderer = TestRenderer.create(<Webshell />);
    expect(renderer.root).toBeTruthy();
  });
  it('should produce parsable es5 injectedJavaScript', () => {
    const Webshell = makeWebshell(WebView, helloFeature.assemble());
    const renderer = TestRenderer.create(<Webshell />);
    const webView = renderer.root.findByType(WebView);
    expect(() =>
      validateJavascript(webView.props.injectedJavaScript)
    ).not.toThrow();
  });
  it('should handle feature messages', async () => {
    const onDummyHello = jest.fn();
    const Webshell = makeWebshell(WebView, helloFeature.assemble());
    TestRenderer.act(() => {
      TestRenderer.create(<Webshell onDummyHello={onDummyHello} />);
    });
    expect(onDummyHello).toHaveBeenCalledWith('Hello world!');
  });
  it('should handle feature failures', () => {
    const onDummyMessage = jest.fn();
    const onFailure = jest.fn();
    const Webshell = makeWebshell(WebView, failingFeature.assemble());
    TestRenderer.act(() => {
      TestRenderer.create(
        <Webshell onDummyFailure={onDummyMessage} onShellError={onFailure} />
      );
    });
    expect(onFailure).toHaveBeenCalledWith(failingFeature.identifier, '');
  });
  it('should pass options to feature scripts', () => {
    const onDummyMessage = jest.fn();
    const Webshell = makeWebshell(
      WebView,
      optionFeature.assemble({ foo: 'bar' })
    );
    TestRenderer.act(() => {
      TestRenderer.create(<Webshell onDummyOption={onDummyMessage} />);
    });
    expect(onDummyMessage).toHaveBeenCalledWith({ foo: 'bar' });
  });
});
