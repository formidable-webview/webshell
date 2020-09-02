import * as React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import makeWebshell, {
  fixViewportFeature,
  handleHTMLDimensionsFeature
} from '@formidable-webview/webshell';
import { useWebshellAutoheight } from './autoheigh-hook';
import WebView from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

const Webshell = makeWebshell(
  WebView,
  handleHTMLDimensionsFeature.assemble({ forceLegacy: false }),
  fixViewportFeature.assemble({ maxScale: 2 })
);

const html = `
<!DOCTYPE html>
<head>
  <style>
    body {
      border: 1px solid white;
      background-color: #27363b;
      color: #aaaaaa;
      overflow-vertical: hidden;
      box-sizing: border-box;
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
    #fullwidth {
      width: 100%;
      background-color: white;
      padding: 10px;
      display: flex;
      justify-content: center;
    }
    article {
      padding: 10px;
    }
    button {
      font-size: 18px;
      margin: 6px;
      font-family: monospace;
    }
  </style>
</head>
<html>
  <body>
    <div id="container">
    <article>
      <h2>This WebView adjusts its layout to its content size</h2>
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
    <div id="fullwidth">
      This div tag width is 100%. <br/>
      You can control its height with the controls above.
    </div>

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
source = {
  uri:
    'https://support.mozilla.org/en-US/kb/get-started-firefox-overview-main-features'
};

export default function App() {
  const autoheightProps = useWebshellAutoheight({
    style: styles.autoheight
  });
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}>
          The green area is outside of the WebView.
        </Text>
        <Webshell source={source} {...autoheightProps} />
        <Text style={styles.text}>This is a React Native Text element.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { textAlign: 'center', padding: 10 },
  root: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    padding: 10,
    backgroundColor: '#99b998' // green
  },
  autoheight: {
    flexGrow: 0,
    backgroundColor: 'transparent'
  },
  container: {
    flexGrow: 0,
    padding: 0,
    margin: 0
  }
});
