import linkPressScript from './handle-link-press.webjs';
import { FeatureBuilder } from '../FeatureBuilder';
import type { DOMRect, PropDefinition } from '../types';
import type { FeatureConstructor } from '../Feature';

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
   * `#top`. See also {@link handleHashChangeFeature}.
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
  clickedAnchorBoundingRect: DOMRect;
  /**
   * An object describing the page location from which the click originated.
   */
  page: {
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/origin}.
     *
     * @remarks
     * Has the special value `null` when not bound to a URL (`{ html }` source).
     */
    origin: string | null;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/href}.
     *
     * @remarks
     * Has the special value `about:blank` when not bound to a URL (`{ html }` source).
     */
    href: string;
  };
}

const defaultOptions: LinkPressOptions = {
  preventDefault: true,
  ignoreHashChange: true
};

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const HandleLinkPressFeature: FeatureConstructor<
  LinkPressOptions,
  [
    PropDefinition<{
      onDOMLinkPress?: (t: LinkPressTarget) => void;
    }>
  ]
> = new FeatureBuilder({
  script: linkPressScript,
  defaultOptions,
  className: 'HandleLinkPressFeature',
  featureIdentifier: 'org.formidable-webview/webshell.link-press'
})
  .withEventHandlerProp<LinkPressTarget, 'onDOMLinkPress'>('onDOMLinkPress')
  .build();
