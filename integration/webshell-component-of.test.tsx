import React from 'react';
import makeWebshell, {
  WebshellComponentOf,
  elementDimensionsFeature,
  linkPressFeature,
  MinimalWebViewProps
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';
import { ComponentType } from 'react';

let Webshell1: WebshellComponentOf<typeof WebView, []>;
let Webshell2: WebshellComponentOf<
  typeof WebView,
  [typeof elementDimensionsFeature]
>;
let Webshell3: WebshellComponentOf<
  typeof WebView,
  [typeof elementDimensionsFeature, typeof linkPressFeature]
>;
// Testing for generic type
export type WebshellWithElementDimensionsFeatureType = WebshellComponentOf<
  ComponentType<MinimalWebViewProps>,
  [typeof elementDimensionsFeature]
>;

Webshell1 = makeWebshell(WebView);
Webshell2 = makeWebshell(
  WebView,
  elementDimensionsFeature.assemble({ tagName: 'body' })
) as WebshellComponentOf<typeof WebView, [typeof elementDimensionsFeature]>;
Webshell3 = makeWebshell(
  WebView,
  elementDimensionsFeature.assemble({ tagName: 'body' }),
  linkPressFeature.assemble({})
);

const props: WebViewProps = {};

<Webshell1 {...props} />;
<Webshell2 onDOMElementDimensions={() => undefined} {...props} />;
<Webshell3
  onDOMLinkPress={() => undefined}
  onDOMElementDimensions={() => undefined}
  {...props}
/>;

export { Webshell1, Webshell2, Webshell3 };
