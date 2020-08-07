/// <reference lib="dom" />
import { createWebjsContext } from './web-utils';
import dimensionsScript from '../features/dimensions.webjs';

declare function dimensionsFeature(context: object): void;

describe('dimensions feature in the DOM', () => {
  test('posts a message with table dimensions when mount', () => {
    // Set up our document body
    document.body.innerHTML = `
    <table>
    <tr>
      <th>Entry Header 1</th>
      <th>Entry Header 2</th>
      <th>Entry Header 3</th>
    </tr>
    </table>
    `;
    eval(dimensionsScript);
    const expectedPayload = { width: 0, height: 0 };
    const context = createWebjsContext({ tagName: 'table' }, expectedPayload);
    dimensionsFeature(context);
    expect(context.postMessage).toHaveBeenCalledWith(expectedPayload);
  });
});
