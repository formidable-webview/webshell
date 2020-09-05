import script from './force-element-size.webjs';
import { makeFeature } from '../make-feature';
import { DOMElementRequest } from 'src/types';

/**
 * An object describing customization for the force body feature.
 *
 * @public
 */
export interface ForceElementSizeOptions {
  /**
   * The element to target.
   */
  target: DOMElementRequest;
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
  /**
   * When no element is found matching the target, should the script raise an
   * error?
   *
   * @defaultValue false
   */
  shouldThrowWhenNotFound?: boolean;
}

/**
 * This feature sets element size programmatically and only once, when
 * {@link https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded | DOMContentLoaded}
 * has been fired.
 *
 * @public
 */
export const forceElementSizeFeature = makeFeature<ForceElementSizeOptions>({
  script,
  featureIdentifier: 'org.formidable-webview/webshell.force-element-size'
});
