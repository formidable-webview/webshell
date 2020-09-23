/// <reference lib="dom" />
import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import dummyHelloScript from './feat/dummy-hello.webjs';
import { assembleScript } from '../make-webshell';

const { waitForErsatz } = makeErsatzTesting<typeof Ersatz, Document, Window>(
  Ersatz
);

describe('Feature loader script', () => {
  it('should post messages sent from features', async () => {
    const onHello = jest.fn();
    const features = `[
      {
        options: {},
        source: ${dummyHelloScript},
        identifier: "com.test"
      }
    ]`;
    const script = assembleScript(features);
    await waitForErsatz(
      render(<Ersatz onMessage={onHello} injectedJavaScript={script} />)
    );
    expect(onHello).toHaveBeenCalledTimes(1);
  });
});
