import script from './ForceElementSizeFeature.webjs';
import FeatureBuilder from '../FeatureBuilder';
import type { DOMElementRequest } from '../types';
import type { FeatureClass } from '../Feature';

/**
 * An object describing customization for the force body feature.
 *
 * @public
 */
export interface ForceElementSizeOptions {
  /**
   * The element to target.
   *
   * @defaultValue 'body'
   */
  target?: DOMElementRequest;
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
   * Force body height to `heightValue`.
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

const defaultOptions: Required<ForceElementSizeOptions> = {
  target: 'body',
  forceHeight: true,
  forceWidth: true,
  widthValue: 'auto',
  heightValue: 'auto',
  shouldThrowWhenNotFound: false
};

/**
 * This feature sets element size programmatically and only once, when
 * {@link https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded | DOMContentLoaded}
 * has been fired. See {@link ForceElementSizeOptions} for customization.
 *
 * @example
 * ```ts
 * const Webshell = makeWebshell(
 *   WebView,
 *   new ForceElementSizeFeature({
 *     target: { id: "blog-content" },
 *     heightValue: 500,
 *     forceWidth: false,
 *   })
 * );
 * ```
 *
 * @public
 */
export const ForceElementSizeFeature: FeatureClass<ForceElementSizeOptions> = new FeatureBuilder<ForceElementSizeOptions>(
  {
    script,
    defaultOptions,
    identifier: 'org.formidable-webview/webshell.force-element-size'
  }
).build();
