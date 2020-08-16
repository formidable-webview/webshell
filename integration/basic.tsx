import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  linkPressFeature,
  elementDimensionsFeature,
  ElementDimensionsObject
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  linkPressFeature.assemble({ preventDefault: true }),
  elementDimensionsFeature.assemble({ tagName: 'body' })
);

export default function EnhancedWebView(webViewProps) {
  const onLinkPress = useCallback((url: string) => Linking.openURL(url), []);
  const onBodyDimensions = useCallback(
    ({ width, height }: ElementDimensionsObject) => console.info(width, height),
    []
  );
  const onError = useCallback((featureIdentifier, errorMessage) => {
    if (featureIdentifier === linkPressFeature.identifier) {
      // Handle linkPress error
      console.error(errorMessage);
    } else if (featureIdentifier === elementDimensionsFeature.identifier) {
      // Handle dimensions error
      console.error(errorMessage);
    }
  }, []);
  return (
    <Webshell
      onDOMLinkPress={onLinkPress}
      onDOMElementDimensions={onBodyDimensions}
      onDOMError={onError}
      {...webViewProps}
    />
  );
}
