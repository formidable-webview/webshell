import React, { createRef } from 'react';
import makeWebshell from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
const Webshell = makeWebshell(WebView);
const webViewRef = createRef();
// Should not throw error
<Webshell ref={webViewRef} />;
