import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import { waitForErsatz } from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import makeWebshell from '../../makeWebshell';
import {
  HandleHTMLDimensionsFeature,
  HTMLDimensions
} from '../HandleHTMLDimensionsFeature';
import type { DOMRectSize } from '../../types';

const boxMatcher: Record<keyof DOMRectSize, any> = {
  width: expect.any(Number),
  height: expect.any(Number)
};

const dimensionsMatcher: Record<keyof HTMLDimensions, any> = {
  content: boxMatcher,
  implementation: expect.any(String),
  layoutViewport: boxMatcher
};

describe('Webshell with HandleHTMLDimensionsFeature', () => {
  it('should invoke onDOMHTMLDimensions prop when the DOM is mounted', async () => {
    const onDOMHTMLDimensions = jest.fn();
    const html = `
    <table>
    <tr>
      <th>Entry Header 1</th>
      <th>Entry Header 2</th>
      <th>Entry Header 3</th>
    </tr>
    </table>
    `;
    const Webshell = makeWebshell(Ersatz, new HandleHTMLDimensionsFeature());
    await waitForErsatz(
      render(
        <Webshell onDOMHTMLDimensions={onDOMHTMLDimensions} source={{ html }} />
      )
    );
    expect(onDOMHTMLDimensions).toHaveBeenCalledWith(dimensionsMatcher);
  });
});
