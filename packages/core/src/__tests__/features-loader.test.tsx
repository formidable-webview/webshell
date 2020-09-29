/// <reference lib="dom" />
import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import dummyHelloScript from './feat/dummy-hello.webjs';
import { assembleScript } from '../make-webshell';
import { FeatureBuilder } from '../FeatureBuilder';

const { waitForErsatz } = makeErsatzTesting<typeof Ersatz, Document, Window>(
  Ersatz
);

const HelloFeature = new FeatureBuilder({
  script: dummyHelloScript,
  featureIdentifier: 'test.hello',
  defaultOptions: {}
})
  .withandlerProp('onDOMDummyHello')
  .build();

const eventShape = expect.objectContaining({
  nativeEvent: expect.objectContaining({
    data: JSON.stringify({
      type: 'feature',
      identifier: HelloFeature.identifier,
      body: 'Hello world!',
      handlerId: 'default',
      __isWebshellPostMessage: true
    })
  })
});

describe('Feature loader script', () => {
  it('should post messages sent from features', async () => {
    const onHello = jest.fn();
    const script = assembleScript([new HelloFeature()], true);
    await waitForErsatz(
      render(<Ersatz onMessage={onHello} injectedJavaScript={script} />)
    );
    expect(onHello).toHaveBeenCalledWith(eventShape);
  });
});
