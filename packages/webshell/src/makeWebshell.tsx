import * as React from 'react';
import type { ComponentType, ElementRef, ComponentPropsWithRef } from 'react';
import Feature from './Feature';
import type {
  WebshellProps,
  MinimalWebViewProps,
  WebshellComponent
} from './types';
import useWebshell from './hooks/useWebshell';

const defaultProps = {
  webshellDebug: __DEV__,
  webshellStrictMode: false
};

/**
 * Creates a React component which decorates `WebView` component with additional
 * capabilities such as:
 *
 * - handling messages from the Web environment;
 * - sending messages to the Web environment, see {@link WebHandle};
 * - running script in the Web environment.
 *
 * @param WebView - A `WebView` component, typically exported from `react-native-webview`.
 * @param features - Features to inject in the `WebView`.
 *
 * @typeparam C - The type of the `WebView` component.
 * @typeparam F - The type for a collection of features to inject.
 *
 * @example
 *
 * ```ts
 * import {
 *   makeWebshell,
 *   HandleHashChangeFeature,
 *   HandleVisualViewportFeature
 * } from '@formidable-webview/webshell';
 *
 * const features = [
 *   new HandleHashChangeFeature(),
 *   new HandleVisualViewportFeature()
 * ]
 *
 * const Webshell = makeWebshell(
 *   WebView,
 *   ...features
 * );
 * ```
 *
 * @public
 */
export default function makeWebshell<
  C extends ComponentType<any>,
  F extends Feature<{}, {}, {}>[]
>(WebView: C, ...features: F): WebshellComponent<C, F> {
  const Webshell = ({
    webViewRef,
    ...props
  }: WebshellProps<MinimalWebViewProps, F> & {
    webViewRef: ElementRef<any>;
  }) => {
    const webViewProps = useWebshell({ features, props, webViewRef });
    return React.createElement(WebView, webViewProps);
  };
  Webshell.defaultProps = defaultProps;
  return React.forwardRef<
    ElementRef<C>,
    WebshellProps<ComponentPropsWithRef<C>, F>
  >((props, ref) => {
    const localWebViewRef = React.useRef();
    return (
      <Webshell
        webViewRef={ref || localWebViewRef}
        {...(props as WebshellProps<ComponentPropsWithRef<any>, F>)}
      />
    );
  }) as any;
}
