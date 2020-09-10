import script from './handle-html-dimensions.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf } from '../types';
import { RectSize } from './types';

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
 * @public
 */
export interface HandleHTMLDimensionsOptions {
  /**
   * Force a specific implementation, if the underlying API is available.
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
}

/**
 * An object describing various dimensions of the HTML layout.
 *
 * @remarks
 * This object units are in CSS pixels. CSS pixels match device pixels when the
 * web page has a `<meta name="viewport" content="width=device-width" />` tag.
 *
 * @public
 */
export interface HTMLDimensions {
  /**
   * The layout viewport dimensions, e.g. the size of the WebView in device pixels.
   */
  layoutViewport: RectSize;

  /**
   * The content dimensions, e.g. the size of the body element in CSS pixels.
   */
  content: RectSize;

  /**
   * Which implementation has been used to generate this event?
   * See {@link HTMLDimensionsImplementation}.
   */
  implementation: HTMLDimensionsImplementation;
}

/**
 * This feature enables receiving various dimensions relative to the layout. The events
 * will only be fired when a change is observed to either the layout or the content size.
 *
 * @remarks
 * If you need to guarantee that 1 CSS pixel = 1 Device pixel, you should use this
 * feature with a meta tag viewport setting width to device width. See
 * {@link forceResponsiveViewportFeature}.
 *
 * @public
 */
export const handleHTMLDimensionsFeature: EventFeatureOf<
  HandleHTMLDimensionsOptions,
  'onDOMHTMLDimensions',
  HTMLDimensions
> = makeFeature({
  script,
  eventHandlerName: 'onDOMHTMLDimensions',
  featureIdentifier: 'org.formidable-webview/webshell.handle-html-dimensions'
});
