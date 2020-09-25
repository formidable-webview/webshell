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

const defaultOptions: HandleHashChangeOptions = {
  shouldResetHashOnEvent: false
};

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const HandleHashChangeFeature: FeatureConstructor<
  HandleHashChangeOptions,
  [PropDefinition<{ onDOMHashChange?: (e: HashChangeEvent) => void }>]
> = new FeatureBuilder({
  script: linkPressScript,
  defaultOptions,
  className: 'HandleHashChangeFeature',
  featureIdentifier: 'org.formidable-webview/webshell.handle-hash-change'
})
  .withEventHandlerProp<HashChangeEvent, 'onDOMHashChange'>('onDOMHashChange')
  .build();
