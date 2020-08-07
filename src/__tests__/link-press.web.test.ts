/// <reference lib="dom" />
import { createWebjsContext } from './web-utils';
import linkPressScript from '../features/link-press.webjs';

declare function linkPressFeature(context: object): void;

describe('link press feature in the DOM', () => {
  test('posts a message with target when a link is pressed', () => {
    // Set up our document body
    document.body.innerHTML = `
    <a id="anchor0" href="https://foo.org">bar</a>
    `;
    eval(linkPressScript);
    const expectedPayload = 'https://foo.org';
    const context = createWebjsContext({}, expectedPayload);
    linkPressFeature(context);
    const anchor = document.getElementById('anchor0');
    expect(anchor).toBeTruthy();
    if (anchor) {
      anchor.click();
    }
    expect(context.postMessage).toHaveBeenCalledWith(expectedPayload);
  });
});
