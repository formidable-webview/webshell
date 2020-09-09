import * as React from 'react';
import {
  MinimalWebViewProps,
  WebshellProps,
  AssembledFeatureOf
} from '../types';
import type {
  HTMLDimensions,
  handleHTMLDimensionsFeature
} from '../features/handle-html-dimensions';
import { useAnimation } from './animated';
import { StyleProp, ViewStyle } from 'react-native';

const initialDimensions = { width: undefined, height: undefined };

let numberOfEvents = 0;

/**
 * A hook which resets dimensions on certain events.
 */
function useAutoheightDimensions<
  S extends WebshellProps<MinimalWebViewProps, any>
>({ webshellProps, initialHeight }: AutoheightParams<S>) {
  const { scalesPageToFit, source = {}, webshellDebug } = webshellProps;
  const [contentDimensions, setContentDimensions] = React.useState<{
    width: number | undefined;
    height: number | undefined;
  }>(initialDimensions);
  React.useEffect(() => {
    setContentDimensions((d) => ({ height: initialHeight, width: d.width }));
    webshellDebug &&
      console.info(
        `${useAutoheight.name}: source change detected, resetting height to ${initialHeight}dp.`
      );
  }, [source.uri, source.html, webshellDebug, initialHeight]);
  React.useEffect(() => {
    webshellDebug &&
      scalesPageToFit === true &&
      console.warn(
        `${useAutoheight.name}: You cannot use scalesPageToFit with autoheight hook. The value will be overriden to false`
      );
  }, [scalesPageToFit, webshellDebug]);
  return { contentDimensions, setContentDimensions };
}

/**
 * @public
 */
export interface ContentSize {
  width: number | undefined;
  height: number | undefined;
}

/**
 * Named parameters for autoheight hook.
 *
 * @public
 */
export interface AutoheightParams<
  S extends WebshellProps<MinimalWebViewProps, []>
> {
  /**
   * You should pass all the props directed to `Webshell` here. This is
   * important because this hook might react to specific props and warn you of
   * some incompatibilities.
   */
  webshellProps: S;
  /**
   * Animate height transitions.
   * **Warning**: this feature is experimental.
   *
   * @defaultValue false
   */
  animated?: boolean;
  /**
   * Triggered when content size changes.
   * Also triggered when reset to undefined.
   */
  onContentSizeChange?: (contentSize: ContentSize) => void;
  /**
   * By default, the width of `Webshell` will grow to the horizontal space available.
   * This is realized with `width: '100%'` and `alignSelf: 'stretch'`.
   * If you need to set explicit width, do it here.
   */
  width?: number;
  /**
   * The height occupied by the `WebView` prior to knowing its content height.
   * It will be reused each time the source changes.
   *
   * @defaultvalue 0
   */
  initialHeight?: number;
}

function useDiff(value: number) {
  const ref = React.useRef<number>(0);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return value - ref.current;
}

/**
 * Requires {@link handleHTMLDimensionsFeature} and recommends
 * {@link forceResponsiveViewportFeature}.
 *
 * @remarks
 * This hook has caveats you must understand:
 *
 * - Because the viewport height is now bound to the content heigh, you cannot
 *   and must not have an element which height depends on viewport, such as
 *   when using `vh` unit or `height: 100%;` on body. That will either create
 *   an infinite loop, or a zero-height page (this happens for Wikipedia).
 *   Hence, it is strongly advised that you use autoheight only with content
 *   you have been able to test. This can be worked around by forcing body
 *   height to 'auto', see {@link forceElementSizeFeature}.
 * - When the user clicks to fragment links within the same page (e.g,
 *   “`#help`”), there will be no scrolling, because this is handled by WebView
 *   on overflow, and there is no such overflow when in autoheight mode.
 *
 * @param params - The parameters to specify autoheight behavior.
 * @returns - The `Webshell` props implementing autoheight behavior.
 *
 * @beta
 */
export function useAutoheight<
  S extends WebshellProps<
    MinimalWebViewProps,
    [AssembledFeatureOf<typeof handleHTMLDimensionsFeature>]
  >
>(params: AutoheightParams<S>) {
  const {
    webshellProps,
    animated,
    onContentSizeChange,
    initialHeight = 0,
    width: userExplicitWidth
  } = params;
  const {
    style,
    onNavigationStateChange,
    scalesPageToFit,
    webshellDebug,
    onDOMHTMLDimensions,
    ...passedProps
  } = webshellProps;
  const { contentDimensions, setContentDimensions } = useAutoheightDimensions(
    params
  );
  const { height } = contentDimensions;
  const diffHeight = Math.abs(useDiff(height || 0));
  const animatedHeight = useAnimation({
    duration: Math.min(Math.max(diffHeight, 5), 500),
    toValue: height || initialHeight,
    type: 'timing',
    useNativeDriver: false
  });
  const handleDOMHTMLDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      const nextDimensions = htmlDimensions.content;
      webshellDebug &&
        console.info(
          `${
            useAutoheight.name
          }: DOMHTMLDimensions event #${++numberOfEvents} (implementation: ${
            htmlDimensions.implementation
          }, content width: ${htmlDimensions.content.width}, content height: ${
            htmlDimensions.content.height
          })`
        );
      setContentDimensions(nextDimensions);
      typeof onDOMHTMLDimensions === 'function' &&
        onDOMHTMLDimensions(htmlDimensions);
    },
    [webshellDebug, setContentDimensions, onDOMHTMLDimensions]
  );
  React.useEffect(() => {
    typeof onContentSizeChange === 'function' &&
      onContentSizeChange(contentDimensions);
  }, [contentDimensions, onContentSizeChange]);
  const autoHeightStyle = React.useMemo<StyleProp<ViewStyle>>(
    () => [
      style as StyleProp<ViewStyle>,
      {
        width:
          typeof userExplicitWidth === 'number' ? userExplicitWidth : '100%',
        height: typeof height === 'number' ? height : initialHeight,
        alignSelf: 'stretch'
      }
    ],
    [height, userExplicitWidth, initialHeight, style]
  );
  return {
    ...passedProps,
    webshellDebug,
    onDOMHTMLDimensions: handleDOMHTMLDimensions,
    style: autoHeightStyle,
    scalesPageToFit: false,
    showsVerticalScrollIndicator: false,
    disableScrollViewPanResponder: true,
    webshellAnimatedHeight: animated ? (animatedHeight as any) : undefined
  };
}
