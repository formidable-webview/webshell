import React from 'react';
import makeWebshell, {
  HandleElementCSSBoxFeature,
  HandleLinkPressFeature
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
let Webshell1;
let Webshell2;
let Webshell3;
Webshell1 = makeWebshell(WebView);
Webshell2 = makeWebshell(
  WebView,
  new HandleElementCSSBoxFeature({ target: 'body' })
);
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
const props = {};
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
