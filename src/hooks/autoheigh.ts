import * as React from 'react';
import type { StyleProp } from 'react-native';
import { MinimalWebViewProps } from '../types';
import { useDeviceOrientation } from './device-orientation';
import type { HTMLDimensions } from '../features/handle-html-dimensions';

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
export interface AutoheightConfig<W extends MinimalWebViewProps> {
  webViewProps: W;
  extraLayout?: any;
  debug?: boolean;
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
 *   height to 'auto', see {@link forceBodySizeFeature}.
 * - React Native Fast Refresh can cause bugs.
 * - When the user clicks to fragment links within the same page (e.g,
 *   “#help”), there will be no scrolling, because this is handled by WebView
 *   on overflow, and there is no such overflow when in autoheight mode.
 *
 * @param webViewProps - The `Webshell` props you whish to transform.
 * @returns - The `Webshell` props implementing autoheight behavior.
 *
 * @beta
 */
export function useAutoheight<W extends MinimalWebViewProps>({
  webViewProps,
  extraLayout,
  debug = __DEV__
}: AutoheightConfig<W>) {
  const {
    style,
    onNavigationStateChange,
    scalesPageToFit,
    ...passedProps
  } = webViewProps;
  const { contentDimensions, setContentDimensions } = useAutoheightDimensions(
    webViewProps,
    extraLayout
  );
  const { width, height } = contentDimensions;
  const onDOMHTMLDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      const nextDimensions = htmlDimensions.content;
      debug &&
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
    },
    [debug, setContentDimensions]
  );
  const autoHeightStyle = React.useMemo(
    () => [style, { width, height: height && height, flexGrow: 0 }],
    [width, height, style]
  );

  return {
    ...passedProps,
    onDOMHTMLDimensions,
    style: autoHeightStyle as StyleProp<any>,
    scalesPageToFit: false
  };
}
