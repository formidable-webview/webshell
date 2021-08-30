import linkPressScript from './HandleLinkPressFeature.webjs';
import FeatureBuilder from '../FeatureBuilder';
import type { DOMRect, PropDefinition } from '../types';
import type { FeatureClass } from '../Feature';

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
   * `#top`. See also {@link HandleHashChangeFeature}.
   *
   * @defaultValue true
   */
  ignoreHashChange?: boolean;
}

/**
 * An object containing the custom data attributes of the anchor which has been clicked.
 *
 * @public
 */
export interface DataAttributes {
  [key: string]: string;
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
   * The `download` attribute, if present.
   */
  downloadAttribute: string | null;
  /**
   * The `target` attribute, if present.
   */
  targetAttribute: string | null;
  /**
   * The `hreflang` attribute, if present.
   */
  hreflangAttribute: string | null;
  /**
   * The `referrerpolicy` attribute, if present.
   */
  referrerpolicyAttribute: string | null;
  /**
   * The `rel` attribute, if present.
   */
  relAttribute: string | null;
  /**
   * The `type` attribute, if present.
   */
  typeAttribute: string | null;
  /**
   * The `id` attribute, if present.
   */
  idAttribute: string | null;
  /**
   * The `class` attribute, if present.
   */
  classAttribute: string | null;
  /**
   * The `name` attribute, if present.
   */
  nameAttribute: string | null;
  /**
   * The `data-` attributes, if present.
   *
   * @remarks
   * Dashes are converted to camelCase. See {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset  | HTMLElement.dataset}.
   */
  dataAttributes: DataAttributes;
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

const defaultOptions: Required<LinkPressOptions> = {
  preventDefault: true,
  ignoreHashChange: true
};

/**
 * This feature provides `onDOMLinkPress` prop with payloads of type {@link LinkPressTarget}.
 * It will intercept clicks on anchors such as:
 *
 * ```html
 * <a href="https://domain.com/">Let's Travel</a>
 * ```
 *
 * @remarks
 * By default, it will prevent the click from propagating. But you can disable
 * this option, see {@link LinkPressOptions}.
 *
 * If you need to intercept click on hash fragments, consider {@link HandleHashChangeFeature} instead.
 *
 * @public
 */
export const HandleLinkPressFeature: FeatureClass<
  LinkPressOptions,
  {
    onDOMLinkPress: PropDefinition<
      'onDOMLinkPress',
      (t: LinkPressTarget) => void
    >;
  }
> = new FeatureBuilder({
  script: linkPressScript,
  defaultOptions,
  identifier: 'org.formidable-webview/webshell.link-press'
})
  .withShellHandler<'onDOMLinkPress', LinkPressTarget>('onDOMLinkPress')
  .build();
