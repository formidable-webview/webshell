import * as React from 'react';
import WebView from 'react-native-webview';
import { makeWebshell } from '@formidable-webview/webshell';
import { FeatureWithToken } from './FeatureWithToken';
const featureWithToken = new FeatureWithToken();
const Webshell = makeWebshell(WebView, featureWithToken);
export const APIComponent = (props) => {
  const webHandleRef = React.useRef(null);
  React.useEffect(() => {
    webHandleRef.current?.postMessageToWeb(
      featureWithToken,
      'apiTokenChange',
      props.apiToken
    );
  }, [props.apiToken]);
  return <Webshell webHandleRef={webHandleRef} />;
};
