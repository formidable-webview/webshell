import script from './handle-html-dimensions.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf } from '../types';

/**
 * @public
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * An object describing various dimensions of the HTML layout.
 *
 * @remarks
 *
 * You must use this feature with a meta tag viewport setting width to device
 * width. See {@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag | MDN—Using the viewport meta tag ...}.
 *
 * This object units are in React Native dpi, independently of the scale factor
 * between DPI and CSS pixels.
 *
 * @public
 */
export interface HTMLDimensions {
  /**
   * The visual viewport scale such as defined in the
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport | MDN—VisualViewport API}.
   * Because this API is quite recent, we have a fallback strategy to compute scale.
   *
   * @remarks
   * The other values in this object are already in React Native dpi units.
   */
  scale: number;
  /**
   * document.documentElement.clientWidth and document.documentElement.clientHeight
   */
  layoutViewport: Dimensions;
  /**
   * window.visualViewport.width and window.visualViewport.height
   */
  visualViewport: Dimensions;
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
