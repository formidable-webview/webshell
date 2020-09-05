import linkPressScript from './handle-hash-change.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf, DOMRect } from '../types';

/**
 * An object describing customization for the hash change feature.
 *
 * @public
 */
export interface HandleHashChangeOptions {
  /**
   * Reset the hash to empty after triggering the event.
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

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const handleHashChangeFeature: EventFeatureOf<
  HandleHashChangeOptions,
  'onDOMHashChange',
  HashChangeEvent
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onDOMHashChange',
  featureIdentifier: 'org.formidable-webview/webshell.handle-hash-change'
});
