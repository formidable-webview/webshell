import script from './handle-html-dimensions.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf } from '../types';
import { Dimensions } from './types';

/**
 * An object describing various dimensions of the HTML layout.
 *
 * @remarks
 * This object units are in CSS pixels. CSS pixels match device pixels when the
 * web page has a `<meta name="viewport" content="width=device-width" />` tag.
 *
 * @public
 */
export interface HTMLDimensions {
  /**
   * document.documentElement.clientWidth and document.documentElement.clientHeight
   */
  layoutViewport: Dimensions;
  /**
   * document.documentElement.scrollWidth and document.documentElement.scrollHeight
   */
  scrollable: Dimensions;
  /**
   * document.documentElement.offsetWith and document.documentElement.offsetHeight
   */
  content: Dimensions;
}

const eventHandlerName = 'onDOMHTMLDimensions';

/**
 * This feature enables receiving various dimensions relative to the layout.
 *
 * @remarks
 * You should use this feature with a meta tag viewport setting width to device
 * width. See {@link fixViewportFeature}.
 *
 * @public
 */
export const handleHTMLDimensionsFeature: EventFeatureOf<
  {},
  typeof eventHandlerName,
  HTMLDimensions
> = makeFeature({
  script,
  eventHandlerName,
  featureIdentifier: 'org.formidable-webview/webshell.handle-html-dimensions'
});
