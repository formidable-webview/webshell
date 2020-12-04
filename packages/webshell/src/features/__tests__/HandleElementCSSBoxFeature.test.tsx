import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import { waitForErsatz } from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import makeWebshell from '../../makeWebshell';
import {
  HandleElementCSSBoxFeature,
  ElementCSSBoxDimensions
} from '../HandleElementCSSBoxFeature';
import type { DOMRectSize } from '../../types';

const boxMatcher: Record<keyof DOMRectSize, any> = {
  width: expect.any(Number),
  height: expect.any(Number)
};
const dimensionsMatcher: Record<keyof ElementCSSBoxDimensions, any> = {
  borderBox: boxMatcher,
  scrollBox: boxMatcher,
  computedStyle: expect.any(Object),
  horizontalScrollbarWidth: expect.any(Number),
  verticalScrollbarWidth: expect.any(Number)
};

describe('Webshell with HandleElementCSSBoxFeature', () => {
  it('should invoke onDOMElementCSSBoxDimensions prop when the DOM is mounted', async () => {
    const onDOMElementDimensions = jest.fn();
    const html = `
    <table>
    <tr>
      <th>Entry Header 1</th>
      <th>Entry Header 2</th>
      <th>Entry Header 3</th>
    </tr>
    </table>
    `;
    const Webshell = makeWebshell(
      Ersatz,
      new HandleElementCSSBoxFeature({ target: { tagName: 'table' } })
    );
    await waitForErsatz(
      render(
        <Webshell
          onDOMElementCSSBoxDimensions={onDOMElementDimensions}
          source={{ html }}
        />
      )
    );
    expect(onDOMElementDimensions).toHaveBeenCalledWith(dimensionsMatcher);
  });
});
