import * as React from 'react';
import {
  HTMLDimensions,
  MinimalWebViewProps
} from '@formidable-webview/webshell';
import useDeviceOrientation from '@rnhooks/device-orientation';
import { StyleProp } from 'react-native';

const initialDimensions = { width: undefined, height: undefined };
let numberOfEvents = 0;
export function useWebshellAutoheight<W extends MinimalWebViewProps>({
  style,
  onNavigationStateChange,
  scalesPageToFit
}: W) {
  const [contentDimensions, setContentDimensions] = React.useState<{
    width: number | undefined;
    height: number | undefined;
  }>(initialDimensions);
  const { width, height } = contentDimensions;
  const orientation = useDeviceOrientation();
  const onDOMHTMLDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      const nextDimensions = {
        width: htmlDimensions.content.width,
        height: htmlDimensions.content.height
      };
      console.info('On DOM HTML Dimensions', ++numberOfEvents, nextDimensions);
      setContentDimensions(nextDimensions);
    },
    []
  );
  const handleNavigationStateChange = React.useCallback(
    (state: any) => {
      console.info('NavigationState change', state);
      if (state.loading && contentDimensions.height) {
        setContentDimensions(initialDimensions);
        console.info('Navigation state change, resetting dimensions');
      }
      typeof onNavigationStateChange === 'function' &&
        onNavigationStateChange(state);
    },
    [contentDimensions.height, onNavigationStateChange]
  );
  const autoHeightStyle = React.useMemo(
    () => [style, { width, height: height && height, flexGrow: 0 }],
    [width, height, style]
  );
  React.useEffect(() => {
    if (typeof orientation === 'string') {
      setContentDimensions(initialDimensions);
      console.info('reset dimensions +', orientation);
    }
  }, [orientation]);
  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      scalesPageToFit === true &&
        console.warn(
          `${useWebshellAutoheight.name}: You cannot use scalesPageToFit with autoheight hook.`
        );
    }, [scalesPageToFit]);
  return {
    onDOMHTMLDimensions,
    onNavigationStateChange: handleNavigationStateChange,
    style: autoHeightStyle as StyleProp<any>,
    scalesPageToFit: false
  };
}
