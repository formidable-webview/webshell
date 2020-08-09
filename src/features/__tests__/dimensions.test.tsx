import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { makeWebshell } from '../../make-webshell';
import { dimensionsFeature } from '../dimensions';

const { waitForErsatz } = makeErsatzTesting(Ersatz);

describe('Webshell with linkPressFeature', () => {
  it('should invoke onDimensions prop when the DOM is mounted', async () => {
    const onDimensions = jest.fn();
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
      dimensionsFeature.assemble({ tagName: 'table' })
    );
    await waitForErsatz(
      render(
        <Webshell
          onDimensions={onDimensions}
          webViewProps={{
            source: { html }
          }}
        />
      )
    );
    expect(onDimensions).toHaveBeenCalledWith({ width: 0, height: 0 });
  });
});
