import * as React from 'react';
import { HTMLDimensions } from '@formidable-webview/webshell';
import useDeviceOrientation from '@rnhooks/device-orientation';
import { ViewStyle, StyleProp } from 'react-native';
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes';

const initialDimensions = { width: undefined, height: undefined };

export function useAutoheight({ style }: { style?: StyleProp<ViewStyle> }) {
  const [contentDimensions, setContentDimensions] = React.useState<{
    width: number | undefined;
    height: number | undefined;
  }>(initialDimensions);
  const { width, height } = contentDimensions;
  const orientation = useDeviceOrientation();
  const onDOMHtmlDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      const nextDimensions = {
        width: htmlDimensions.content.width,
        height: htmlDimensions.scrollable.height
      };
      console.info('On DOM HTML Dimensions', nextDimensions);
      setContentDimensions(nextDimensions);
    },
    []
  );
  const onNavigationStateChange = React.useCallback(
    (state: WebViewNavigation) => {
      if (!state.loading && contentDimensions.height) {
        setContentDimensions(initialDimensions);
        console.info('Navigation state change', state);
      }
    },
    [contentDimensions.height]
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
  return {
    onDOMHtmlDimensions,
    onNavigationStateChange,
    style: autoHeightStyle,
    scalesPageToFit: false
  };
}
