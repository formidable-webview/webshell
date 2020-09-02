import * as React from 'react';
import { HTMLDimensions } from '@formidable-webview/webshell';
import useDeviceOrientation from '@rnhooks/device-orientation';
import { ViewStyle, StyleProp } from 'react-native';

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
      console.info('DIMENSIONS', htmlDimensions);
      setContentDimensions({
        width: htmlDimensions.content.width,
        height: htmlDimensions.scrollable.height
      });
    },
    []
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
    style: autoHeightStyle,
    scalesPageToFit: false
  };
}
