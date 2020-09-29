import script from './ForceResponsiveViewportFeature.webjs';
import { FeatureBuilder } from '../FeatureBuilder';
import type { FeatureConstructor } from '../Feature';

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
}

const defaultOptions: ForceResponsiveViewportOptions = {
  maxScale: 1
};

/**
 * This feature inserts or replace a meta element looking like:
 *
 * ```html
 * <meta name="viewport" content="width=device-width" />
 * ```
 *
 * This will guarantee that the layout viewport will match
 * device-width (hence, “responsive”). Minimum scale is locked to 1, but you
 * can customize maximum scale to allow pinch-zoom gestures.
 * See {@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag | MDN—Using the viewport meta tag ...}
 *
 * @public
 */
export const ForceResponsiveViewportFeature: FeatureConstructor<ForceResponsiveViewportOptions> = new FeatureBuilder(
  {
    script,
    defaultOptions,
    featureIdentifier:
      'org.formidable-webview/webshell.force-responsive-viewport'
  }
).build();
