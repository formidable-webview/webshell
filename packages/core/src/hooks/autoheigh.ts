import * as React from 'react';
import type { MinimalWebViewProps, WebshellProps } from '../types';
import type {
  HTMLDimensions,
  HandleHTMLDimensionsFeature,
  HTMLDimensionsImplementation
} from '../features/HandleHTMLDimensionsFeature';
import { StyleProp, ViewStyle } from 'react-native';
import { RectSize } from '../features/types';
import { Feature, FeatureInstanceOf } from '../Feature';

const initialDimensions = { width: undefined, height: undefined };

let numberOfEvents = 0;

/**
 * The state of synchronization between viewport and content size:
 *
 * - init: the initial, "onMount" state;
 * - syncing: the content size is being determined;
 * - synced: the viewport size has been adjusted to content size.
 *
 * @public
 */
export type AutoheightSyncState = 'init' | 'syncing' | 'synced';

/**
 * The state returned by {@link useAutoheight} hook.
 *
 * @public
 */
export interface AutoheightState<
  S extends WebshellProps<
    MinimalWebViewProps,
    [FeatureInstanceOf<typeof HandleHTMLDimensionsFeature>]
  >
> {
  /**
   * The props to inject into webshell in order to support "autoheight"
   * behavior.
   */
  autoheightWebshellProps: Pick<
    S,
    | 'webshellDebug'
    | 'onDOMHTMLDimensions'
    | 'style'
    | 'scalesPageToFit'
    | 'showsVerticalScrollIndicator'
    | 'disableScrollViewPanResponder'
  > &
    Partial<S>;
  /**
   * The implementation used to generate resize events.
   */
  resizeImplementation: HTMLDimensionsImplementation | null;
  /**
   * An object describing the content size. When the size is not yet known,
   * this object fields will be undefined.
   */
  contentSize: Partial<RectSize>;
  /**
   * The state of synchronization between viewport and content size:
   *
   * - init: the initial, "onMount" state;
   * - syncing: the content size is being determined;
   * - synced: the viewport size has been adjusted to content size.
   *
   */
  syncState: AutoheightSyncState;
}

/**
 * Named parameters for autoheight hook.
 *
 * @public
 */
export interface AutoheightParams<
  S extends WebshellProps<MinimalWebViewProps, Feature<any, any>[]>
> {
  /**
   * It's best to pass all props directed to `Webshell` here. This is
   * advised because the hook might react to specific props and warn you of
   * some incompatibilities.
   */
  webshellProps: S;
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
  /**
   * When a width change is detected on viewport, the height of the `WebView`
   * will be set to `undefined` for a few milliseconds. This will allow the
   * best handling of height constraint in edge-cases with, for example,
   * content expanding vertically (display: flex), at the cost of a small flash.
   *
   * @defaultValue true
   */
  reinitHeightOnViewportWidthChange?: boolean;
}
interface AutoheightInternalState {
  implementation: HTMLDimensionsImplementation | null;
  contentSize: Partial<RectSize>;
  syncState: AutoheightSyncState;
  lastFrameChangedWidth: boolean;
  viewportWidth: number;
}

function useAutoheightState<
  S extends WebshellProps<
    MinimalWebViewProps,
    [FeatureInstanceOf<typeof HandleHTMLDimensionsFeature>]
  >
>({ webshellProps, initialHeight }: AutoheightParams<S>) {
  const { scalesPageToFit, source = {}, webshellDebug } = webshellProps;
  const [state, setState] = React.useState<AutoheightInternalState>({
    implementation: null,
    contentSize: initialDimensions,
    syncState: 'init',
    lastFrameChangedWidth: false,
    viewportWidth: 0
  });
  const {
    implementation,
    contentSize: { width, height }
  } = state;
  React.useEffect(() => {
    setState(({ contentSize, viewportWidth }) => ({
      viewportWidth,
      contentSize: {
        height: undefined,
        width: contentSize.width
      },
      implementation: null,
      syncState: 'syncing',
      lastFrameChangedWidth: false
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
 * Requires {@link HandleHTMLDimensionsFeature} and recommends
 * {@link ForceResponsiveViewportFeature}.
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
 *   height to 'auto', see {@link ForceElementSizeFeature}.
 * - When the user clicks to fragment links within the same page (e.g,
 *   “`#help`”), there will be no scrolling, because this is handled by WebView
 *   on overflow, and there is no such overflow when in autoheight mode.
 *
 * @param params - The parameters to specify autoheight behavior.
 * @returns - An object to implement autoheight behavior.
 *
 * @beta
 */
export function useAutoheight<
  S extends WebshellProps<
    MinimalWebViewProps,
    [FeatureInstanceOf<typeof HandleHTMLDimensionsFeature>]
  >
>(params: AutoheightParams<S>): AutoheightState<S> {
  const {
    webshellProps,
    initialHeight = 0,
    width: userExplicitWidth,
    reinitHeightOnViewportWidthChange = true
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
    contentSize: { height },
    implementation,
    lastFrameChangedWidth
  } = state;
  const shouldReinitNextFrameHeight =
    typeof userExplicitWidth !== 'number' &&
    lastFrameChangedWidth &&
    reinitHeightOnViewportWidthChange;
  const handleDOMHTMLDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      setState((prevState) => {
        return {
          viewportWidth: htmlDimensions.layoutViewport.width,
          implementation: htmlDimensions.implementation,
          contentSize: htmlDimensions.content,
          syncState: 'synced',
          lastFrameChangedWidth:
            prevState.viewportWidth !== htmlDimensions.layoutViewport.width
        };
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
        height: shouldReinitNextFrameHeight
          ? undefined
          : typeof height === 'number'
          ? height
          : initialHeight,
        alignSelf: 'stretch'
      }
    ],
    [
      height,
      userExplicitWidth,
      initialHeight,
      style,
      shouldReinitNextFrameHeight
    ]
  );
  React.useEffect(() => {
    const timeout = setTimeout(
      () =>
        setState((prevState) => ({
          ...prevState,
          lastFrameChangedWidth: false
        })),
      50
    );
    return clearTimeout.bind(null, timeout);
  }, [shouldReinitNextFrameHeight, setState]);
  return {
    autoheightWebshellProps: {
      ...passedProps,
      webshellDebug,
      onDOMHTMLDimensions: handleDOMHTMLDimensions,
      style: autoHeightStyle,
      scalesPageToFit: false,
      showsVerticalScrollIndicator: false,
      disableScrollViewPanResponder: true
    } as AutoheightState<S>['autoheightWebshellProps'],
    resizeImplementation: implementation,
    contentSize: state.contentSize,
    syncState: state.syncState
  };
}
