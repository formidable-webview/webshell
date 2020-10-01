import script from './HandleElementCSSBoxFeature.webjs';
import { FeatureBuilder } from '../FeatureBuilder';
import type { DOMElementRequest, PropDefinition } from '../types';
import type { FeatureClass } from '../Feature';

/**
 * An object describing customization for the dimensions feature.
 *
 * @public
 */
export interface HandleElementCSSBoxDimensionsOptions {
  /**
   * The element to target. This argument is required.
   */
  target: DOMElementRequest;
  /**
   * When no elements are found matching the target, should the script
   * raise an error?
   *
   * @defaultValue false
   */
  shouldThrowWhenNotFound?: boolean;
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
 * See {@link https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle | window.getComputedStyle()}.
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
 * {@link https://drafts.csswg.org/css2/#box-model | CSS 2 (Box model)}.
 *
 * @remarks
 *
 * This object scalar units are CSS pixels.
 *
 * @public
 */
export interface ElementCSSBoxDimensions {
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
   * {@link https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle | window.getComputedStyle()}.
   *
   * @remarks
   * Be aware that the computed vertical margins might collapse in the
   * viewport. See
   * {@link https://drafts.csswg.org/css2/#collapsing-margins | CSS 2 (collapsing margins)}
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

const defaultOptions: Required<HandleElementCSSBoxDimensionsOptions> = {
  shouldThrowWhenNotFound: false
} as Required<HandleElementCSSBoxDimensionsOptions>;

/**
 * This feature enables receiving the {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model | CSS Box dimensions} of an element in the
 * `WebView` pixels unit. The first element matching the provided tagName is
 * retained. A new event will be triggered on every resize.
 *
 * @remarks
 * If you are looking for the document content size, use {@link HandleHTMLDimensionsFeature} instead.
 *
 * @public
 */
export const HandleElementCSSBoxFeature: FeatureClass<
  HandleElementCSSBoxDimensionsOptions,
  {
    onDOMElementCSSBoxDimensions: PropDefinition<
      'onDOMElementCSSBoxDimensions',
      (e: ElementCSSBoxDimensions) => void
    >;
  }
> = new FeatureBuilder({
  script,
  defaultOptions,
  identifier: 'org.formidable-webview/webshell.handle-element-cssbox-dimensions'
})
  .withShellHandler<ElementCSSBoxDimensions, 'onDOMElementCSSBoxDimensions'>(
    'onDOMElementCSSBoxDimensions'
  )
  .build();
