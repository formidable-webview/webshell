import makeWebshell, {
  WebshellComponentOf,
  dimensionsFeature,
  linkPressFeature
} from 'react-native-webshell';
import WebView, { WebViewProps } from 'react-native-webview';

let Webshell1: WebshellComponentOf<WebViewProps, []>;
let Webshell2: WebshellComponentOf<WebViewProps, [typeof dimensionsFeature]>;
let Webshell3: WebshellComponentOf<
  WebViewProps,
  [typeof dimensionsFeature, typeof linkPressFeature]
>;

Webshell1 = makeWebshell(WebView);
Webshell2 = makeWebshell(
  WebView,
  dimensionsFeature.assemble({ tagName: 'body' })
) as WebshellComponentOf<WebViewProps, [typeof dimensionsFeature]>;
Webshell3 = makeWebshell(
  WebView,
  dimensionsFeature.assemble({ tagName: 'body' }),
  linkPressFeature.assemble({})
);

export { Webshell1, Webshell2, Webshell3 };
