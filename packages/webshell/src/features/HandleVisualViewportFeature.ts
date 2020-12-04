import script from './HandleVisualViewportFeature.webjs';
import FeatureBuilder from '../FeatureBuilder';
import { FeatureClass } from '../Feature';
import type { PropDefinition, DOMRectSize } from '../types';

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
  visualViewport: DOMRectSize;
  /**
   * `false` when these values are coming from the VisualViewport API and
   * `true` when they are "best guess". In legacy mode, be warned that you will
   * not receive frequent updates when the user pinch-zoom.
   */
  isLegacy: boolean;
}

/**
 * This feature provides `onDOMVisualViewport` prop with payloads of type {@link VisualViewportDimensions}.
 * It will trigger events when the visual viewport changes.
 * Requires `VisualViewport` API support on browsers (iOS Safari 13 and Android WebView 62).
 * When the API is not available, payload object will have `isLegacy` field set to true.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport | VisualViewport API}.
 *
 * @example
 * ```ts
 * const Webshell = makeWebshell(WebView, new HandleVisualViewportFeature());
 * ```
 * @public
 *
 */
export const HandleVisualViewportFeature: FeatureClass<
  {},
  {
    onDOMVisualViewport: PropDefinition<
      'onDOMVisualViewport',
      (d: VisualViewportDimensions) => void
    >;
  }
> = new FeatureBuilder({
  script,
  defaultOptions: {},
  identifier: 'org.formidable-webview/webshell.handle-visual-viewport'
})
  .withShellHandler<'onDOMVisualViewport', VisualViewportDimensions>(
    'onDOMVisualViewport'
  )
  .build();
