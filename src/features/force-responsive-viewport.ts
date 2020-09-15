import script from './force-responsive-viewport.webjs';
import { makeFeature } from '../make-feature';
import { Feature } from '../types';

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

/**
 * This feature inserts or replace a `<meta name="viewport" content="width=device-width" />`
 * tag in the head to guarantee that the layout viewport will match
 * device-width (hence, “responsive”). Minimum scale is locked to 1, but you
 * can customize maximum scale to allow pinch-zoom gestures.
 * See {@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag | MDN—Using the viewport meta tag ...}
 *
 * @public
 */
export const forceResponsiveViewportFeature: Feature<ForceResponsiveViewportOptions> = makeFeature(
  {
    script,
    featureIdentifier:
      'org.formidable-webview/webshell.force-responsive-viewport'
  }
);
