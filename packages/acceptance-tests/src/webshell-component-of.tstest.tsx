import React from 'react';
import makeWebshell, {
  WebshellComponentOf,
  HandleElementCSSBoxFeature,
  HandleLinkPressFeature,
  MinimalWebViewProps
} from '@formidable-webview/webshell';
import WebView, {
  WebViewProps
} from 'react-native-webview';
import type { ComponentType } from 'react';

let Webshell1: WebshellComponentOf<typeof WebView, []>;
let Webshell2: WebshellComponentOf<
  typeof WebView,
  [typeof HandleElementCSSBoxFeature]
>;
let Webshell3: WebshellComponentOf<
  typeof WebView,
  [
    typeof HandleElementCSSBoxFeature,
    typeof HandleLinkPressFeature
  ]
>;
// Testing for generic type
export type WebshellWithElementDimensionsFeatureType = WebshellComponentOf<
  ComponentType<MinimalWebViewProps>,
  [typeof HandleElementCSSBoxFeature]
>;

Webshell1 = makeWebshell(WebView);
Webshell2 = makeWebshell(
  WebView,
  new HandleElementCSSBoxFeature({ target: 'body' })
) as WebshellComponentOf<
  typeof WebView,
  [typeof HandleElementCSSBoxFeature]
>;
Webshell3 = makeWebshell(
  WebView,
  new HandleElementCSSBoxFeature({ target: 'body' }),
  new HandleLinkPressFeature({})
);
const Webshell4 = makeWebshell(
  WebView,
  new HandleElementCSSBoxFeature({ target: 'body' }),
  new HandleLinkPressFeature({})
);

const props: WebViewProps = {};

<Webshell1 {...props} />;
<Webshell2
  onDOMElementCSSBoxDimensions={() => undefined}
  {...props}
/>;
<Webshell3
  onDOMLinkPress={() => undefined}
  onDOMElementCSSBoxDimensions={() => undefined}
  {...props}
/>;
<Webshell4
  onDOMLinkPress={() => undefined}
  onDOMElementCSSBoxDimensions={() => undefined}
  {...props}
/>;

export { Webshell1, Webshell2, Webshell3 };
