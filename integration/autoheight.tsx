import React, { useCallback, useState } from 'react';
import makeWebshell, {
  elementDimensionsFeature,
  ElementDimensionsObject
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  elementDimensionsFeature.assemble({ tagName: 'body' })
);

export default function AutoheightWebView(webViewProps) {
  const [height, setHeight] = useState<number | undefined>(undefined);
  const onBodyDimensions = useCallback(
    ({ height: bodyHeight }: ElementDimensionsObject) => setHeight(bodyHeight),
    []
  );
  return (
    <Webshell
      onDOMElementDimensions={onBodyDimensions}
      {...webViewProps}
      style={[webViewProps.style, { height }]}
    />
  );
}
