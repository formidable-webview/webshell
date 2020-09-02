import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { makeWebshell } from '../../make-webshell';
import {
  handleElementCSSBoxFeature,
  ElementCSSBoxDimensions,
  CSSBox
} from '../handle-element-cssbox-dimensions';

const { waitForErsatz } = makeErsatzTesting(Ersatz);

const boxMatcher: Record<keyof CSSBox, any> = {
  width: expect.any(Number),
  height: expect.any(Number)
};
const dimensionsMatcher: Record<keyof ElementCSSBoxDimensions, any> = {
  borderBox: boxMatcher,
  scrollBox: boxMatcher,
  computedStyle: expect.any(Object),
  horizontalScrollbarWidth: expect.any(Number),
  verticalScrollbarWidth: expect.any(Number),
  scale: expect.any(Number)
};

describe('Webshell with elementCSSBoxFeature', () => {
  it('should invoke onDOMDimensions prop when the DOM is mounted', async () => {
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
      handleElementCSSBoxFeature.assemble({ tagName: 'table' })
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
