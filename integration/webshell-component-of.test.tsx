import React from 'react';
import makeWebshell, {
  WebshellComponentOf,
  handleElementCSSBoxFeature,
  handleLinkPressFeature,
  MinimalWebViewProps
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';
import { ComponentType } from 'react';

let Webshell1: WebshellComponentOf<typeof WebView, []>;
let Webshell2: WebshellComponentOf<
  typeof WebView,
  [typeof handleElementCSSBoxFeature]
>;
let Webshell3: WebshellComponentOf<
  typeof WebView,
  [typeof handleElementCSSBoxFeature, typeof handleLinkPressFeature]
>;
// Testing for generic type
export type WebshellWithElementDimensionsFeatureType = WebshellComponentOf<
  ComponentType<MinimalWebViewProps>,
  [typeof handleElementCSSBoxFeature]
>;

Webshell1 = makeWebshell(WebView);
Webshell2 = makeWebshell(
  WebView,
  handleElementCSSBoxFeature.assemble({ tagName: 'body' })
) as WebshellComponentOf<typeof WebView, [typeof handleElementCSSBoxFeature]>;
Webshell3 = makeWebshell(
  WebView,
  handleElementCSSBoxFeature.assemble({ tagName: 'body' }),
  handleLinkPressFeature.assemble({})
);
const Webshell4 = makeWebshell(
  WebView,
  handleElementCSSBoxFeature.assemble({ tagName: 'body' }),
  handleLinkPressFeature.assemble({})
);

const props: WebViewProps = {};

<Webshell1 {...props} />;
<Webshell2 onDOMElementCSSBoxDimensions={() => undefined} {...props} />;
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
