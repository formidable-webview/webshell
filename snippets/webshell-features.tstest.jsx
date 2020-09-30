import React, { createRef } from 'react';
import makeWebshell, {
  FeatureBuilder
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
const Feature1 = new FeatureBuilder({
  defaultOptions: {},
  identifier: 'test',
  script: ''
})
  .withWebHandler('event1')
  .withWebHandler('event2')
  .build();
const feature1 = new Feature1();
const Webshell = makeWebshell(WebView, feature1);
const webHandle = createRef();
webHandle.current?.postMessageToWeb(feature1, 'event1', {
  foo: ''
});
webHandle.current?.postMessageToWeb(feature1, 'event2', {
  bar: ''
});
// Should not throw error
<Webshell webHandle={webHandle} />;
