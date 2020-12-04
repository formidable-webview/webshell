import script from './ForceResponsiveViewportFeature.webjs';
import FeatureBuilder from '../FeatureBuilder';
import type { FeatureClass } from '../Feature';

/**
 * An object describing customization for the fix viewport feature.
 *
 * @public
 */
export interface ForceResponsiveViewportOptions {
  /**
   * Maximum pinch-zoom scale.
   *
   * @defaultvalue 1
   */
  maxScale?: number;
  /**
   * Minimum pinch-zoom scale.
   *
   * @defaultvalue 1
   */
  minScale?: number;
  /**
   * Initial zoom scale.
   *
   * @defaultvalue 1
   */
  initScale?: number;
}

const defaultOptions: Required<ForceResponsiveViewportOptions> = {
  maxScale: 1,
  initScale: 1,
  minScale: 1
};

/**
 * This feature inserts or, when present, replace a meta element looking like:
 *
 * ```html
 * <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1" />
 * ```
 *
 * This will guarantee that the layout viewport will match
 * device-width (hence, “responsive”). Minimum scale is locked to 1, but you
 * can customize maximum scale to allow pinch-zoom gestures (see {@link ForceResponsiveViewportOptions}).
 * See also {@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag | MDN—Using the viewport meta tag ...}
 *
 * @example
 *
 * ```ts
 * const Webshell = makeWebshell(
 *   WebView,
 *   new ForceResponsiveViewportFeature({
 *     maxScale: 3,
 *   })
 * );
 * ```
 *
 * @public
 */
export const ForceResponsiveViewportFeature: FeatureClass<ForceResponsiveViewportOptions> = new FeatureBuilder(
  {
    script,
    defaultOptions,
    identifier: 'org.formidable-webview/webshell.force-responsive-viewport'
  }
).build();
