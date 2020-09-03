import script from './handle-visual-viewport.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf } from '../types';
import { Dimensions } from './types';

/**
 * An object describing the visual viewport of the `WebView`.
 *
 * @public
 */
export interface VisualViewportDimensions {
  /**
   * The visual viewport scale. Because this API is quite recent, we have a
   * fallback strategy to compute scale.
   *
   * @remarks
   * The other values in this object are already in React Native dpi units.
   */
  scale: number;
  /**
   * window.visualViewport.width and window.visualViewport.height
   */
  visualViewport: Dimensions;
  /**
   * `false` when these values are comming from the VisualViewport API and
   * `true` when they are "best guess".
   */
  isLegacy: boolean;
}

const eventHandlerName = 'onDOMVisualViewportDimensions';

/**
 * This feature adds a handler triggered when the visual viewport changes. It
 * requires VisualViewport API support on browsers (iOS Safari 13 and Android
 * WebView 62).
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport | MDN—VisualViewport API}.
 *
 * @beta
 */
export const handleVisualViewportFeature: EventFeatureOf<
  {},
  typeof eventHandlerName,
  VisualViewportDimensions
> = makeFeature({
  script,
  eventHandlerName,
  featureIdentifier: 'org.formidable-webview/webshell.handle-visual-viewport'
});
