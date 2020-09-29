import React, { createRef } from 'react';
import makeWebshell, {
  FeatureBuilder,
  WebHandle
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Feature1 = new FeatureBuilder({
  defaultOptions: {},
  featureIdentifier: 'test',
  script: ''
})
  .withWebHandler<{ foo: string }, 'event1'>('event1')
  .withWebHandler<{ bar: string }, 'event2'>('event2')
  .build();

const feature1 = new Feature1();

const Webshell = makeWebshell(WebView, feature1);

const webHandle = createRef<WebHandle>();

webHandle.current?.postMessageToWeb(feature1, 'event1', {
  foo: ''
});

webHandle.current?.postMessageToWeb(feature1, 'event2', {
  bar: ''
});

// Should not throw error
<Webshell webHandle={webHandle} />;
