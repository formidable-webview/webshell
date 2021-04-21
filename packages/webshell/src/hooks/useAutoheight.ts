import * as React from 'react';
import type {
  DOMRectSize,
  ExtractFeatureFromClass,
  MinimalWebViewProps,
  WebshellProps
} from '../types';
import type {
  HTMLDimensions,
  HandleHTMLDimensionsFeature,
  HTMLDimensionsImplementation
} from '../features/HandleHTMLDimensionsFeature';
import { StyleProp, ViewStyle } from 'react-native';
import Feature from '../Feature';

const initialDimensions = { width: undefined, height: undefined };

const overridenWebViewProps = {
  scalesPageToFit: false,
  showsVerticalScrollIndicator: false,
  disableScrollViewPanResponder: true,
  contentMode: 'mobile'
} as const;

const overridenWebViewKeys = Object.keys(overridenWebViewProps);

/**
 * The state of synchronization between viewport and content size:
 *
 * - `init`: the initial state;
 * - `syncing`: the content size is being determined;
 * - `synced`: the viewport size has been adjusted to content size.
 *
 * @public
 */
export type AutoheightSyncState = 'init' | 'syncing' | 'synced';

/**
 * The state returned by {@link useAutoheight} hook.
 *
 * @typeparam S - The type of the `Webshell` props used by this hook.
 *
 * @public
 */
export interface AutoheightState<
  S extends WebshellProps<
    MinimalWebViewProps,
    [ExtractFeatureFromClass<typeof HandleHTMLDimensionsFeature>]
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
    | 'contentMode'
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
  contentSize: Partial<DOMRectSize>;
  /**
   * The state of synchronization between viewport and content size:
   *
   * - `'init'`: the initial, "onMount" state;
   * - `'syncing'`: the content size is being determined;
   * - `'synced'`: the viewport size has been adjusted to content size.
   *
   */
  syncState: AutoheightSyncState;
}

/**
 * Named parameters for autoheight hook.
 *
 * @typeparam S - The type of the `Webshell` props used by this hook.
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
  resetHeightOnViewportWidthChange?: boolean;
}
interface AutoheightInternalState {
  implementation: HTMLDimensionsImplementation | null;
  contentSize: Partial<DOMRectSize>;
  syncState: AutoheightSyncState;
  lastFrameChangedWidth: boolean;
  viewportWidth: number;
}

const initialState: AutoheightInternalState = {
  implementation: null,
  contentSize: initialDimensions,
  syncState: 'init',
  lastFrameChangedWidth: false,
  viewportWidth: 0
};

function useDevFeedbackEffect({
  autoHeightParams: { webshellProps },
  state: {
    implementation,
    contentSize: { width, height }
  }
}: {
  autoHeightParams: AutoheightParams<WebshellProps<MinimalWebViewProps, []>>;
  state: AutoheightInternalState;
}) {
  const numberOfEventsRef = React.useRef(0);
  const { webshellDebug } = webshellProps;
  const forbiddenWebViewProps = overridenWebViewKeys
    .map((key) => [key, webshellProps[key]])
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as any);
  React.useEffect(
    function warnOverridenProps() {
      for (const forbiddenKey of overridenWebViewKeys) {
        if (
          forbiddenWebViewProps[forbiddenKey] !== undefined &&
          forbiddenWebViewProps[forbiddenKey] !==
            overridenWebViewProps[forbiddenKey]
        ) {
          console.warn(
            `${useAutoheight.name}: You cannot set "${forbiddenKey}" prop to "${webshellProps[forbiddenKey]}" with autoheight hook. The value will be overriden to "${overridenWebViewProps[forbiddenKey]}".`
          );
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [webshellDebug, ...Object.values(forbiddenWebViewProps)]
  );
  React.useEffect(
    function debugDOMHTMLDimensions() {
      webshellDebug &&
        console.info(
          `${
            useAutoheight.name
          }: DOMHTMLDimensions event #${++numberOfEventsRef.current} (implementation: ${implementation}, content width: ${width}, content height: ${height})`
        );
    },
    [webshellDebug, implementation, height, width]
  );
}

function useAutoheightState<
  S extends WebshellProps<
    MinimalWebViewProps,
    [ExtractFeatureFromClass<typeof HandleHTMLDimensionsFeature>]
  >
>(autoHeightParams: AutoheightParams<S>) {
  const { webshellProps, initialHeight } = autoHeightParams;
  const { source = {}, webshellDebug } = webshellProps;
  const [state, setState] = React.useState<AutoheightInternalState>(
    initialState
  );
  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDevFeedbackEffect({ autoHeightParams, state });
  }
  React.useEffect(
    function resetHeightOnSourceChanges() {
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
      __DEV__ &&
        webshellDebug &&
        console.info(
          `${useAutoheight.name}: source change detected, resetting height to ${initialHeight}dp.`
        );
    },
    [source.uri, source.html, webshellDebug, initialHeight]
  );
  if (__DEV__) {
  }
  return { state, setState };
}

/**
 *
 * This hook will provide props to inject in a shell component to implement an "autoheight" behavior.
 * It requires {@link HandleHTMLDimensionsFeature} to have be instantiated in the shell.
 * Also recommend (see remarks):
 *
 * - {@link ForceElementSizeFeature},
 * - {@link ForceResponsiveViewportFeature}.
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
 * - In some circumstances, the mobile browser might use a virtual
 *   viewport much larger then the available width in the `<WebView />`, often
 *   around 980px for websites which have been built for desktop. For
 *   this autoheight component to be reliable, you must ensure that the
 *   content has a [meta viewport element](https://www.w3schools.com/css/css_rwd_viewport.asp)
 *   in the header. You can enforce this behavior with {@link ForceResponsiveViewportFeature}.
 *
 * @example
 *
 * ```tsx
 * export default function MinimalAutoheightWebView(
 *   webshellProps: ComponentProps<typeof Webshell>
 * ) {
 *   const { autoheightWebshellProps } = useAutoheight({
 *     webshellProps
 *   });
 *   return <Webshell {...autoheightWebshellProps} />;
 * }
 * ```
 *
 * @param params - The parameters to specify autoheight behavior.
 * @typeparam S - The type of the `Webshell` props used by this hook.
 * @returns - An object to implement autoheight behavior.
 *
 * @public
 */
export default function useAutoheight<
  S extends WebshellProps<
    MinimalWebViewProps,
    [ExtractFeatureFromClass<typeof HandleHTMLDimensionsFeature>]
  >
>(params: AutoheightParams<S>): AutoheightState<S> {
  const {
    webshellProps,
    initialHeight = 0,
    width: userExplicitWidth,
    resetHeightOnViewportWidthChange = true
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
    resetHeightOnViewportWidthChange;
  const handleOnDOMHTMLDimensions = React.useCallback(
    function handleOnDOMHTMLDimensions(htmlDimensions: HTMLDimensions) {
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
  React.useEffect(
    function resetLastFrameChangedWidth() {
      const timeout = setTimeout(
        () =>
          setState((prevState) => ({
            ...prevState,
            lastFrameChangedWidth: false
          })),
        50
      );
      return () => clearTimeout(timeout);
    },
    [shouldReinitNextFrameHeight, setState]
  );
  return {
    autoheightWebshellProps: {
      ...passedProps,
      webshellDebug,
      onDOMHTMLDimensions: handleOnDOMHTMLDimensions,
      style: autoHeightStyle,
      ...overridenWebViewProps
    } as AutoheightState<S>['autoheightWebshellProps'],
    resizeImplementation: implementation,
    contentSize: state.contentSize,
    syncState: state.syncState
  };
}
