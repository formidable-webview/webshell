/// <reference lib="dom" />
import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import dummyHelloScript from './feat/DummyHello.webjs';
import { FeatureBuilder } from '../FeatureBuilder';
import { FeatureRegistry } from '../FeatureRegistry';

const { waitForErsatz } = makeErsatzTesting<typeof Ersatz, Document, Window>(
  Ersatz
);

const HelloFeature = new FeatureBuilder({
  script: dummyHelloScript,
  identifier: 'test.hello',
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
    const registry = new FeatureRegistry([new HelloFeature()]);
    await waitForErsatz(
      render(
        <Ersatz
          onMessage={onHello}
          injectedJavaScript={registry.assembledFeaturesScript}
        />
      )
    );
    expect(onHello).toHaveBeenCalledWith(eventShape);
  });
});
