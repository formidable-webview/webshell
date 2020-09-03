import script from './force-body-size.webjs';
import { makeFeature } from '../make-feature';
import { Feature } from 'src/types';

/**
 * An object describing customization for the force body feature.
 *
 * @public
 */
export interface ForceBodySizeOptions {
  /**
   * The width to override.
   *
   * @defaultvalue 'auto'
   */
  widthValue?: number | string;
  /**
   * The height to override.
   *
   * @defaultvalue 'auto'
   */
  heightValue?: number | string;
  /**
   * Force body width to `widthValue`.
   *
   * @defaultvalue true
   */
  forceWidth?: boolean;
  /**
   * Force body width to `heightValue`.
   *
   * @defaultvalue true
   */
  forceHeight?: boolean;
}

/**
 * This feature inserts or replace a `<meta name="viewport" />` tag in the head
 * to guarantee that the viewport will not exceed device-width.
 * See {@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag | MDN—Using the viewport meta tag ...}
 *
 * @public
 */
export const forceBodySizeFeature: Feature<ForceBodySizeOptions> = makeFeature({
  script,
  featureIdentifier: 'org.formidable-webview/webshell.force-body-size'
});
