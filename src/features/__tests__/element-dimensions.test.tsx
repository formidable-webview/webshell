import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { makeWebshell } from '../../make-webshell';
import { elementDimensionsFeature } from '../element-dimensions';

const { waitForErsatz } = makeErsatzTesting(Ersatz);

describe('Webshell with linkPressFeature', () => {
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
      elementDimensionsFeature.assemble({ tagName: 'table' })
    );
    await waitForErsatz(
      render(
        <Webshell
          onDOMElementDimensions={onDOMElementDimensions}
          source={{ html }}
        />
      )
    );
    expect(onDOMElementDimensions).toHaveBeenCalledWith({
      width: 0,
      height: 0
    });
  });
});
