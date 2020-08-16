import makeWebshell, {
  WebshellComponentOf,
  elementDimensionsFeature,
  linkPressFeature
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';

let Webshell1: WebshellComponentOf<WebViewProps, [], typeof WebView>;
let Webshell2: WebshellComponentOf<
  WebViewProps,
  [typeof elementDimensionsFeature],
  typeof WebView
>;
let Webshell3: WebshellComponentOf<
  WebViewProps,
  [typeof elementDimensionsFeature, typeof linkPressFeature],
  typeof WebView
>;

Webshell1 = makeWebshell(WebView);
Webshell2 = makeWebshell(
  WebView,
  elementDimensionsFeature.assemble({ tagName: 'body' })
) as WebshellComponentOf<
  WebViewProps,
  [typeof elementDimensionsFeature],
  typeof WebView
>;
Webshell3 = makeWebshell(
  WebView,
  elementDimensionsFeature.assemble({ tagName: 'body' }),
  linkPressFeature.assemble({})
);

export { Webshell1, Webshell2, Webshell3 };
