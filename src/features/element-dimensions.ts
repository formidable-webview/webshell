import dimensionsScript from './element-dimensions.webjs';
import { makeFeature } from '../make-feature';
import type { Feature } from '../types';

/**
 * An object describing customization for the dimensions feature.
 *
 * @public
 */
export interface ElementDimensionsOptions {
  /**
   * The element to target when the DOM is loaded.
   */
  tagName: string;
  /**
   * When no elements are found matching the providing tag, should the script
   * raise an error?
   *
   * @defaultValue false
   */
  errorWhenNotFound?: boolean;
}

/**
 * An object describing a rectangle layout.
 *
 * @public
 */
export interface ElementDimensionsObject {
  width: number;
  height: number;
}

/**
 * This feature enables receiving the full width and height of an element
 * identified by `tagName` in the WebView pixels unit, including border widths,
 * but excluding margins. The first element matching the provided tagName is
 * retained. A new event will be triggered on every resize.
 *
 * @public
 */
export const elementDimensionsFeature: Feature<
  ElementDimensionsOptions,
  'onDOMElementDimensions',
  ElementDimensionsObject
> = makeFeature({
  script: dimensionsScript,
  eventHandlerName: 'onDOMElementDimensions',
  identifier: 'org.webshell.elementDimensions'
});
