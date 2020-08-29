import * as React from 'react';
import { HTMLDimensions } from '@formidable-webview/webshell';
import useDeviceOrientation from '@rnhooks/device-orientation';
import { ViewStyle, StyleProp } from 'react-native';

const initialDimensions = { width: undefined, height: undefined };

function createMetaViewportInsertScript({
  maxScale = 1
}: {
  maxScale: number;
}) {
  const maxScaleFixed = maxScale.toFixed(2);
  return `
Array.prototype.forEach.call(document.getElementsByTagName('meta'), function(elem){
  elem.name === 'viewport' && elem.parentNode.removeChild(elem);
});
var metaViewport = document.createElement('meta');
metaViewport.setAttribute('name', 'viewport');
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=${maxScaleFixed}');
document.getElementsByTagName('head')[0].appendChild(metaViewport);
`;
}

export function useAutoheight<W extends { style?: StyleProp<ViewStyle> }>({
  style,
  maxScale
}: {
  style?: StyleProp<ViewStyle>;
  maxScale: number;
}) {
  const [contentDimensions, setContentDimensions] = React.useState<{
    width: number | undefined;
    height: number | undefined;
  }>(initialDimensions);
  const { width, height } = contentDimensions;
  const orientation = useDeviceOrientation();
  const onDOMHtmlDimensions = React.useCallback(
    (htmlDimensions: HTMLDimensions) => {
      console.info('DIMENSIONS', htmlDimensions);
      setContentDimensions(htmlDimensions.content);
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
    scalesPageToFit: false,
    injectedJavaScript: createMetaViewportInsertScript({ maxScale })
  };
}
