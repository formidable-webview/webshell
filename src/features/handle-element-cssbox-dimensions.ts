import script from './handle-element-cssbox-dimensions.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf } from '../types';

/**
 * An object describing customization for the dimensions feature.
 *
 * @public
 */
export interface HandleElementCSSBoxDimensionsOptions {
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
export interface CSSBox {
  width: number;
  height: number;
}

/**
 * Computed styles which affect the CSS Box dimensions.
 * See {@link https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle | MDN—window.getComputedStyle}.
 *
 * @public
 */
export interface CSSBoxDimensionsComputedStyle {
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  borderTopWidth: number;
  borderBottomWidth: number;
  borderLeftWidth: number;
  borderRightWidth: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

/**
 * An object describing an element CSS Box dimensions, see
 * {@link https://drafts.csswg.org/css2/#box-model | CSSWG—CSS 2 (Box model)}.
 *
 * @remarks
 *
 * This object units are in React Native dpi, independently of the scale factor
 * between the browser width in dpi and the browser viewport in CSS pixels.
 *
 * @public
 */
export interface ElementCSSBoxDimensions {
  /**
   * The ratio between the `WebView` width in dpi and the `window.innerWidth`
   * in CSS pixels.
   *
   * @remarks
   * The other values in this object are already in React Native dpi units.
   */
  scale: number;
  /**
   * A box formed by `scrollWidth` and `scrollHeight` element properties.
   *
   * @remarks
   * The box is formed with all the space occupied by element's children, even
   * when overflowing. The element padding, border and scrollbar are not
   * counted. See
   * {@link https://drafts.csswg.org/cssom-view/#dom-element-scrollwidth},
   * `scrollWidth` and `scrollHeight` for a reference.
   */
  scrollBox: CSSBox;
  /**
   * The border box as specified in the
   * {@link https://drafts.csswg.org/css-box-3/#valdef-box-border-box | CSS Box Model}.
   *
   * @remarks
   * Margin, padding and content boxes can be derived from
   * {@link ElementCSSBoxDimensions.computedStyle}.
   */
  borderBox: CSSBox;
  /**
   * The computed box style. See
   * {@link https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle | MDN—window.getComputedStyle}.
   *
   * @remarks
   * Be aware that the computed vertical margins might collapse in the
   * viewport. See
   * {@link https://drafts.csswg.org/css2/#collapsing-margins | CSSWG—CSS 2 (collapsing margins)}
   */
  computedStyle: CSSBoxDimensionsComputedStyle;
  /**
   * The width of the horizontal scrollbar.
   *
   * @remarks
   * In the CSS Box model, scrollbars are part of the content box.
   */
  horizontalScrollbarWidth: number;
  /**
   * The width of the vertical scrollbar.
   *
   * @remarks
   * In the CSS Box model, scrollbars are part of the content box.
   */
  verticalScrollbarWidth: number;
}

const eventHandlerName = 'onDOMElementCSSBoxDimensions';

/**
 * This feature enables receiving the CSS Box dimensions of an element
 * identified by `tagName` in the `WebView` pixels unit. The first element
 * matching the provided tagName is retained. A new event will be triggered on
 * every resize.
 *
 * @public
 */
export const handleElementCSSBoxFeature: EventFeatureOf<
  HandleElementCSSBoxDimensionsOptions,
  typeof eventHandlerName,
  ElementCSSBoxDimensions
> = makeFeature({
  script,
  eventHandlerName,
  featureIdentifier:
    'org.formidable-webview/webshell.handle-element-cssbox-dimensions'
});
