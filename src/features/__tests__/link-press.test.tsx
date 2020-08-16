import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { makeWebshell } from '../../make-webshell';
import { linkPressFeature } from '../link-press';

const { waitForDocument } = makeErsatzTesting(Ersatz);

describe('Webshell with linkPressFeature', () => {
  it('should invoke onLinkPress prop when a link is pressed', async () => {
    const onDOMLinkPress = jest.fn();
    const Webshell = makeWebshell(Ersatz, linkPressFeature.assemble());
    const document = await waitForDocument(
      render(
        <Webshell
          onDOMLinkPress={onDOMLinkPress}
          webViewProps={{
            source: { html: '<a id="anchor0" href="https://foo.org">bar</a>' }
          }}
        />
      )
    );
    document.getElementById('anchor0').click();
    expect(onDOMLinkPress).toHaveBeenCalledWith('https://foo.org');
  });
});
