import script from './HandleHTMLDimensionsFeature.webjs';
import FeatureBuilder from '../FeatureBuilder';
import type { FeatureClass } from '../Feature';
import type { PropDefinition, DOMRectSize } from '../types';

/**
 * The script will check for different APIs in order to
 * implement the notification of HTML dimensions changes. By order of preference:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver} (resize),
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}
 * (mutation) and polling.
 *
 * @public
 */
export type HTMLDimensionsImplementation = 'resize' | 'mutation' | 'polling';

/**
 * Options for {@link HandleHTMLDimensionsFeature}.
 *
 * @public
 */
export interface HandleHTMLDimensionsOptions {
  /**
   * Force a specific implementation, if the underlying API is available.
   *
   * **warning**: forcing to `'polling'` might increase battery consumption.
   *
   * @remarks
   *
   * This option is useful in development to force one implementation to mock older browsers.
   *
   * @defaultValue false
   */
  forceImplementation?: HTMLDimensionsImplementation | false;

  /**
   * In polling mode, at which interval should the dimensions be retrieved?
   *
   * @remarks
   * A value of 0 will disable polling.
   *
   * @defaultValue 200
   */
  pollingInterval?: number;

  /**
   * The minimum difference between two updates' dimensions to trigger a change
   * event.
   *
   *
   * @defaultValue 0
   */
  deltaMin?: number;

  /**
   * Allow or disallow using `window.addEventListener('resize', handler)` to
   * complement dimensions extraction.
   *
   * @remarks
   * This option only affects 'polling' and 'resize' implementations.
   *
   *
   * @defaultValue `true`
   */
  listenToWindowResizeEvent?: boolean;
}

/**
 * An object describing various dimensions of the HTML layout.
 *
 * @remarks
 * This object units are in CSS pixels. CSS pixels match device pixels when the
 * Web page has a `<meta name="viewport" content="width=device-width" />` tag.
 *
 * @public
 */
export interface HTMLDimensions {
  /**
   * The layout viewport size, e.g. the size of the WebView in device pixels.
   */
  layoutViewport: DOMRectSize;

  /**
   * The content size, e.g. the size of the body element in CSS pixels.
   */
  content: DOMRectSize;

  /**
   * Which implementation has been used to generate this event?
   * See {@link HTMLDimensionsImplementation}.
   */
  implementation: HTMLDimensionsImplementation;
}

const defaultOptions: Required<HandleHTMLDimensionsOptions> = {
  deltaMin: 0,
  forceImplementation: false,
  pollingInterval: 200,
  listenToWindowResizeEvent: true
};

/**
 * This feature provides `onDOMHTMLDimensions` prop with {@link HTMLDimensions} payloads.
 * It enables receiving various dimensions relative to the layout when a change
 * is observed to either the layout or the content size. The feature can be customized with
 * {@link HandleHTMLDimensionsOptions}.
 * See {@link https://formidable-webview.github.io/webshell//docs/getting-started#minimal-example | this guide for an example}.
 *
 * @remarks
 * If you need to guarantee that 1 CSS pixel = 1 Device pixel, you should use this
 * feature with a meta tag viewport setting width to device width.
 * See {@link ForceResponsiveViewportFeature}
 *
 * @public
 */
export const HandleHTMLDimensionsFeature: FeatureClass<
  HandleHTMLDimensionsOptions,
  {
    onDOMHTMLDimensions: PropDefinition<
      'onDOMHTMLDimensions',
      (d: HTMLDimensions) => void
    >;
  }
> = new FeatureBuilder({
  script,
  defaultOptions,
  identifier: 'org.formidable-webview/webshell.handle-html-dimensions'
})
  .withShellHandler<'onDOMHTMLDimensions', HTMLDimensions>(
    'onDOMHTMLDimensions'
  )
  .build();
