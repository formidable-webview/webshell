import linkPressScript from './HandleHashChangeFeature.webjs';
import { FeatureBuilder } from '../FeatureBuilder';
import type { DOMRect, PropDefinition } from '../types';
import type { FeatureConstructor } from '../Feature';

/**
 * An object describing customization for the hash change feature.
 *
 * @public
 */
export interface HandleHashChangeOptions {
  /**
   * Reset the hash to the empty string after triggering the event.
   * This is recommended if you want to make sure any upcoming link press on
   * an anchor with a local hash `href` will trigger the `hashchange` event.
   *
   * @defaultValue false
   */
  shouldResetHashOnEvent?: boolean;
}

/**
 * A hash change event.
 *
 * @public
 */
export interface HashChangeEvent {
  /**
   * The hash (“#” included).
   */
  hash: string;
  /**
   * The bounding rectangle of the element targeted by hash.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | Element.getBoundingClientRect()}
   */
  targetElementBoundingRect: DOMRect;
}

const defaultOptions: Required<HandleHashChangeOptions> = {
  shouldResetHashOnEvent: false
};

/**
 * This feature allows to intercept hashchange events, when the hash fragment of the URL changes.
 * This could happen when the user clicks on anchors like this:
 *
 * ```html
 * <a href="#subresource">Let's Jump to Subresource</a>
 * ```
 *
 * Or when JavaScript code imperatively changes the hash fragment of current location.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event | MDN—hashchange event}.
 *
 * @public
 */
export const HandleHashChangeFeature: FeatureConstructor<
  HandleHashChangeOptions,
  {
    onDOMHashChange: PropDefinition<
      'onDOMHashChange',
      (e: HashChangeEvent) => void
    >;
  }
> = new FeatureBuilder({
  script: linkPressScript,
  defaultOptions,
  identifier: 'org.formidable-webview/webshell.handle-hash-change'
})
  .withandlerProp<HashChangeEvent, 'onDOMHashChange'>('onDOMHashChange')
  .build();
