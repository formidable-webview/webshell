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

  /**
   * Don't trigger an event when the target `href` is inside the page, e.g.
   * `#top`. See also {@link hashChangeFeature}.
   *
   * @defaultValue true
   */
  ignoreHashChange?: boolean;
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
   * The URI scheme.
   */
  scheme: string;
  /**
   * The exact content of the `href` attribute.
   */
  hrefAttribute: string;
  /**
   * The bounding rectangle of the anchor which has been clicked.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | Element.getBoundingClientRect()}
   */
  clickedAnchorBoundingRect: {
    x: number;
    y: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
  };
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
