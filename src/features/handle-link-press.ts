import linkPressScript from './handle-link-press.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf } from '../types';

/**
 * An object describing customization for the linkPress feature.
 *
 * @public
 */
export interface LinkPressOptions {
  /**
   * Prevent click events on anchors to propagate.
   *
   * @defaultValue true
   */
  preventDefault?: boolean;
}

/**
 * The target of a link press event.
 *
 * @public
 */
export interface LinkPressTarget {
  /**
   * The full URI of the target.
   */
  uri: string;
  /**
   * The URI scheme
   */
  scheme: string;
  /**
   * The exact content of the `href` attribute.
   */
  hrefAttribute: string;
  /**
   * An object describing the page location from which the click originated.
   */
  page: {
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/origin}.
     */
    origin: string;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/href}.
     */
    href: string;
  };
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const handleLinkPressFeature: EventFeatureOf<
  LinkPressOptions,
  'onDOMLinkPress',
  LinkPressTarget
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onDOMLinkPress',
  featureIdentifier: 'org.formidable-webview/webshell.link-press'
});
