import * as React from 'react';
import {
  MinimalWebViewProps,
  WebshellProps,
  AssembledFeatureOf
} from '../types';
import type {
  HTMLDimensions,
  handleHTMLDimensionsFeature,
  HTMLDimensionsImplementation
} from '../features/handle-html-dimensions';
import { useAnimation } from './animated';
import { StyleProp, ViewStyle } from 'react-native';
import { RectSize } from 'src/features/types';

const initialDimensions = { width: undefined, height: undefined };

let numberOfEvents = 0;

interface AutoheightState {
  implementation: HTMLDimensionsImplementation | null;
  contentDimensions: Partial<RectSize>;
  computingState: 'init' | 'processing' | 'computed';
}

/**
 * A hook which resets dimensions on certain events.
 */
function useAutoheightState<S extends WebshellProps<MinimalWebViewProps, any>>({
  webshellProps,
  initialHeight
}: AutoheightParams<S>) {
  const { scalesPageToFit, source = {}, webshellDebug } = webshellProps;
  const [state, setState] = React.useState<AutoheightState>({
    implementation: null,
    contentDimensions: initialDimensions,
    computingState: 'init'
  });
  const {
    implementation,
    contentDimensions: { width, height }
  } = state;
  React.useEffect(() => {
    setState(({ contentDimensions }) => ({
      contentDimensions: {
        height: initialHeight,
        width: contentDimensions.width
      },
      implementation: null,
      computingState: 'processing'
    }));
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
  React.useEffect(() => {
    webshellDebug &&
      console.info(
        `${
          useAutoheight.name
        }: DOMHTMLDimensions event #${++numberOfEvents} (implementation: ${implementation}, content width: ${width}, content height: ${height})`
      );
  }, [webshellDebug, implementation, height, width]);
  return { state, setState };
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
   * By default, the width of `Webshell` will grow to the horizontal space available.
   * This is realized with `width: '100%'` and `alignSelf: 'stretch'`.
   * If you need to set explicit width, do it here.
   */
  width?: number;
  /**
   * The height occupied by the `WebView` prior to knowing its content height.
   * It will be reused each time the source changes.
   *
   * @defaultValue 0
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
  const { state, setState } = useAutoheightState(params);
  const {
    contentDimensions: { height },
    implementation
  } = state;
  const diffHeight = Math.abs(useDiff(height || 0));
  const animatedHeight = useAnimation({
    duration: Math.min(Math.max(diffHeight, 5), 500),
    toValue: height || initialHeight,
    type: 'timing',
    useNativeDriver: false
  });
  const handleDOMHTMLDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      setState({
        implementation: htmlDimensions.implementation,
        contentDimensions: htmlDimensions.content,
        computingState: 'computed'
      });
      typeof onDOMHTMLDimensions === 'function' &&
        onDOMHTMLDimensions(htmlDimensions);
    },
    [setState, onDOMHTMLDimensions]
  );
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
    autoheightWebshellProps: {
      ...passedProps,
      webshellDebug,
      onDOMHTMLDimensions: handleDOMHTMLDimensions,
      style: autoHeightStyle,
      scalesPageToFit: false,
      showsVerticalScrollIndicator: false,
      disableScrollViewPanResponder: true,
      webshellAnimatedHeight: animated ? (animatedHeight as any) : undefined
    },
    resizeImplementation: implementation,
    contentSize: state.contentDimensions,
    computingState: state.computingState
  };
}
