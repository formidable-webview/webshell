import dimensionsScript from './dimensions.webjs';
import { makeFeature } from '../make-feature';
import type { Feature } from '../types';

/**
 * An object describing customization for the dimensions feature.
 *
 * @public
 */
export interface DimensionsOptions {
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
 * @public
 */
export interface DimensionsObject {
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
export const dimensionsFeature: Feature<
  DimensionsOptions,
  'onDimensions',
  DimensionsObject
> = makeFeature({
  script: dimensionsScript,
  eventHandlerName: 'onDimensions',
  identifier: 'org.webshell.dimensions'
});
