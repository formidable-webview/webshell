import featuresLoaderScript from '../features-loader.webjs';
import dummyHelloScript from './feat/dummy-hello.webjs';
import { runScriptInDOM } from './core-utils';

describe('features loader', () => {
  test('load features', () => {
    const features = `[
      {
        options: {},
        source: ${dummyHelloScript},
        identifier: "com.test"
      }
    ]`;
    const onHello = jest.fn();
    expect(() => {
      runScriptInDOM(
        '',
        featuresLoaderScript.replace('$$___FEATURES___$$', features),
        onHello
      );
    }).not.toThrow();
    expect(onHello).toHaveBeenCalledTimes(1);
  });
});
