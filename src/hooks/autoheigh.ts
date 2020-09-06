import * as React from 'react';
import {
  MinimalWebViewProps,
  WebshellProps,
  AssembledFeatureOf
} from '../types';
import { useDeviceOrientation } from './device-orientation';
import type {
  HTMLDimensions,
  handleHTMLDimensionsFeature
} from '../features/handle-html-dimensions';
import { useAnimation } from './animated';
import { StyleProp, ViewStyle, Dimensions } from 'react-native';

const initialDimensions = { width: undefined, height: undefined };

let numberOfEvents = 0;

/**
 * A hook which resets dimensions on certain events.
 */
function useAutoheightDimensions<W extends MinimalWebViewProps>(
  webshellProps: W,
  extraLayout?: any
) {
  const { scalesPageToFit } = webshellProps;
  const orientation = useDeviceOrientation();
  const [contentDimensions, setContentDimensions] = React.useState<{
    width: number | undefined;
    height: number | undefined;
  }>(initialDimensions);
  React.useEffect(() => {
    setContentDimensions(initialDimensions);
  }, [orientation, extraLayout]);
  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      scalesPageToFit === true &&
        console.warn(
          `${useAutoheight.name}: You cannot use scalesPageToFit with autoheight hook. The value will be overriden to false`
        );
    }, [scalesPageToFit]);
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
   * important because this hook might react to some props and warn you of
   * some incompatibilities.
   */
  webshellProps: S;
  /**
   * A marker property for telling the hook to reset layout viewport dimensions
   * when its value changes.
   */
  extraLayout?: any;
  /**
   * Animate height transitions.
   *
   * @defaultValue false
   */
  animated?: boolean;
  /**
   * Triggered when content size changes.
   * Also triggered when reset to undefined.
   */
  onContentSizeChange?: (contentSize: ContentSize) => void;
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
 *
 * - React Native Fast Refresh can cause bugs.
 *
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
  const { webshellProps, extraLayout, animated, onContentSizeChange } = params;
  const {
    style,
    onNavigationStateChange,
    scalesPageToFit,
    webshellDebug,
    onDOMHTMLDimensions,
    ...passedProps
  } = webshellProps;
  const { contentDimensions, setContentDimensions } = useAutoheightDimensions(
    webshellProps,
    extraLayout
  );
  const { width, height } = contentDimensions;
  const diffHeight = Math.abs(useDiff(height || 0));
  const animatedHeight = useAnimation({
    duration: Math.min(Math.max(diffHeight, 5), 500),
    toValue: height || (Dimensions.get('window').height * 2) / 3,
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
        width,
        height,
        alignSelf: 'stretch'
      }
    ],
    [width, height, style]
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
