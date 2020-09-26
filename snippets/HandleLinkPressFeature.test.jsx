import * as React from 'react';
import makeWebshell from '@formidable-webview/webshell';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { HandleLinkPressFeature } from './HandleLinkPressFeature';
const { waitForDocument } = makeErsatzTesting(Ersatz);
describe('Webshell with HandleLinkPressFeature', () => {
  it('should invoke onDOMLinkPress prop when a link is pressed', async () => {
    const onDOMLinkPress = jest.fn();
    const Webshell = makeWebshell(
      Ersatz,
      new HandleLinkPressFeature()
    );
    const document = await waitForDocument(
      render(
        <Webshell
          onDOMLinkPress={onDOMLinkPress}
          source={{
            html:
              '<a id="anchor0" href="https://foo.org">bar</a>'
          }}
        />
      )
    );
    document.getElementById('anchor0').click();
    expect(onDOMLinkPress).toHaveBeenCalledWith({
      uri: 'https://foo.org/'
    });
  });
});
