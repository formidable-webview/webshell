import * as React from 'react';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { StyleSheet, ScrollView, Text } from 'react-native';
import makeWebshell, {
  forceResponsiveViewportFeature,
  handleHTMLDimensionsFeature,
  forceBodySizeFeature,
  useWebshellAutoheight,
  handleLinkPressFeature
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble(),
  handleHTMLDimensionsFeature.assemble({ forceLegacy: true }),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceBodySizeFeature.assemble()
);

type WebshellProps = React.ComponentProps<typeof Webshell>;

const html = `
<!DOCTYPE html>
<head>
  <style>
    body {
      border: 1px solid #d4aa00;
      background-color: #2b2b2b;
      color: white;
      overflow-vertical: hidden;
      box-sizing: border-box;
      font-size: 14px;
    }
    h2 {
      font-family: serif;
      color: #d4aa00;
      text-align: center;
    }
    * {
      box-sizing: border-box;
    }
    li {
      margin-bottom: 10px;
    }
    .container {
      padding: 10px;
      display: flex;
      justify-content: center;
      flex-gap: 10px;
    }
    footer {
      width: 100%;
      background-color: #1a1a1a;
      color: white;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60px;
      text-align: center;
    }
    article {
      padding: 10px;
    }
    button {
      font-size: 18px;
      margin: 6px;
      font-family: monospace;
    }
    .brand {
      padding: 10px;
      text-align: center;
      font-family: monospace;
    }
    .brand > a {
      font-size: 10px;
      color: white;
      text-decoration: none;
      font-weight: bold;
    }
    .image-container {
      display: flex;
      flex-direction: columns;
      justify-content: center;
    }
  </style>
</head>
<html>
  <body>
    <div id="container">
    <article>
      <div class="image-container">
        <img src="https://avatars3.githubusercontent.com/u/69217828?s=400&u=f3c683287f866a197e49df2c7308fed60df79589&v=4" width="40" height="40" />
      </div>
      <div class="brand">
         <a href="https://github.com/formidable-webview/webshell#readme">@formidable-webview/webshell</a>
      </div>
      <h2>Create a WebView which adjusts its layout to its content size</h2>
      <ul>
        <li>
        Shrink and increase div by pressing buttons and notice how the WebView height adapts dynamically.
        </li>
        <li>
        When the content overflows the layout (which is very bad web design!), you can still scroll horizontally.
        The scroll is happening inside the WebView.
        </li>
        <li>
        Rotate the screen and observe how the WebView height and width will adjust.
        </li>
        <li>
        Because the viewport height is now bound to the content heigh, <b>you cannot and must not have an element which height depends on viewport (vh)</b>.
        That will create an infinite loop. This is why it is strongly advised that you use autoheight only with content you have tested.
        </li>
      </ul>
      <div class="container">
        <button onclick="shrinkDiv()">-20</button>
        <button onclick="increaseDiv()">+20</button>
      </div>
    </article>
    <footer id="fullwidth">
      This footer tag width is 100%. <br/>
      You can change its height with the controls above.
    </footer>

    <script>
    function shrinkDiv() {
      var div = document.getElementById('fullwidth');
      var currentHeight = Number(getComputedStyle(div).height.match(/[\\d.]+/));
      div.style.height = currentHeight - 20 + "px";
    }
    function increaseDiv() {
      var div = document.getElementById('fullwidth');
      var currentHeight = Number(getComputedStyle(div).height.match(/[\\d.]+/));
      div.style.height = currentHeight + 20 + "px";
    }
    </script>
    </div>
  </body>
</html>
`;

let source: WebViewSource = { html };
// source = { uri: 'https://en.wikipedia.org/wiki/React_Native' };
// source = {
//   uri:
//     'https://support.mozilla.org/en-US/kb/get-started-firefox-overview-main-features'
// };

export default function App() {
  const autoheightProps = useWebshellAutoheight<WebshellProps>({
    source,
    style: styles.autoheight,
    onDOMLinkPress: Linking.openURL
  });
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={[styles.text, styles.textInScrollView]}>
        The white area is inside the ScrollView, outside the WebView.
      </Text>
      <Webshell {...autoheightProps} />
      <Text style={[styles.text, styles.textInScrollView]}>
        This is a React Native Text element.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    padding: 10,
    color: '#1a1a1a',
    fontStyle: 'italic'
  },
  textInScrollView: { color: 'black' },
  autoheight: {
    flexGrow: 0,
    backgroundColor: 'transparent'
  },
  container: {
    marginTop: Constants.statusBarHeight,
    backgroundColor: 'white',
    padding: 0,
    margin: 0
  }
});
