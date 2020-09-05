import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { makeWebshell } from '../../make-webshell';
import { handleLinkPressFeature, LinkPressTarget } from '../handle-link-press';

const { waitForDocument } = makeErsatzTesting(Ersatz);

const linkPressTargetMatcher: Record<keyof LinkPressTarget, any> = {
  uri: expect.any(String),
  scheme: expect.any(String),
  hrefAttribute: expect.any(String),
  clickedAnchorBoundingRect: {
    top: expect.any(Number),
    left: expect.any(Number),
    right: expect.any(Number),
    bottom: expect.any(Number),
    width: expect.any(Number),
    height: expect.any(Number)
  },
  page: expect.any(Object)
};

describe('Webshell with handleLinkPressFeature', () => {
  it('should invoke onDOMLinkPress prop when a link is pressed', async () => {
    const onDOMLinkPress = jest.fn();
    const Webshell = makeWebshell(Ersatz, handleLinkPressFeature.assemble());
    const document = await waitForDocument(
      render(
        <Webshell
          onDOMLinkPress={onDOMLinkPress}
          source={{ html: '<a id="anchor0" href="https://foo.org">bar</a>' }}
        />
      )
    );
    document.getElementById('anchor0').click();
    expect(onDOMLinkPress).toHaveBeenCalledWith({
      ...linkPressTargetMatcher,
      uri: 'https://foo.org/'
    });
  });
});
