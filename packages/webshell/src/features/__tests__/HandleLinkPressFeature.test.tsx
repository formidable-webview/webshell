import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import { waitForDocument } from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import makeWebshell from '../../makeWebshell';
import {
  HandleLinkPressFeature,
  LinkPressTarget
} from '../HandleLinkPressFeature';

describe('Webshell with HandleLinkPressFeature', () => {
  it('should invoke onDOMLinkPress prop when a link is pressed', async () => {
    const onDOMLinkPress = jest.fn();
    const Webshell = makeWebshell(Ersatz, new HandleLinkPressFeature());
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
      uri: 'https://foo.org/',
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
    } as Record<keyof LinkPressTarget, any>);
  });
});
