import React, { createRef } from 'react';
import makeWebshell, {
  FeatureBuilder,
  WebHandle
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Feature1 = new FeatureBuilder({
  defaultOptions: {},
  identifier: 'test',
  script: ''
})
  .withWebHandler<'event1', { foo: string }>('event1')
  .withWebHandler<'event2', { bar: string }>('event2')
  .build();

const feature1 = new Feature1();

const Webshell = makeWebshell(WebView, feature1);

const webHandleRef = createRef<WebHandle>();

webHandleRef.current?.postMessageToWeb(feature1, 'event1', {
  foo: ''
});

webHandleRef.current?.postMessageToWeb(feature1, 'event2', {
  bar: ''
});

// Should not throw error
<Webshell webHandleRef={webHandleRef} />;
