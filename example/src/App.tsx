import * as React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, ScrollView, PixelRatio, View } from 'react-native';
import makeWebshell, {
  fixViewportFeature,
  handleHTMLDimensionsFeature
} from '@formidable-webview/webshell';
import { useWebshellAutoheight } from './autoheigh-hook';
import WebView from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

const Webshell = makeWebshell(
  WebView,
  handleHTMLDimensionsFeature.assemble(),
  fixViewportFeature.assemble({ maxScale: 3 })
);

const html = `
<!DOCTYPE html>
<head>
  <style>
    body {
      border: 1px solid white;
      background-color: yellow;
      flexGrow: 0;
    }
    #container {
      background-color: cornflowerblue;
    }
  </style>
</head>
<html>
  <body>
    <div id="container">
    <h2>This WebView height is automatic</h2>

      <p class="content-box">However, you cannot pinch-zoom.</p>

      <div>
        <img
          id="image"
          src="https://via.placeholder.com/500x200"
          width="500"
          height="200"
        />
      </div>
      <button onclick="shrinkImage()">Shrink Image</button>
      <button onclick="increaseImage()">Increase Image</button>
      <script>
      function shrinkImage() {
        var image = document.getElementById('image');
        image.width = image.width / 1.1;
        image.height = image.height / 1.1;
      }
      function increaseImage() {
        var image = document.getElementById('image');
        image.width = image.width * 1.1;
        image.height = image.height * 1.1;
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
  const autoheightProps = useWebshellAutoheight({
    style: styles.autoheight
  });
  const onLayout = ({ nativeEvent }) => console.info('LAYOUT', nativeEvent);
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Webshell onLayout={onLayout} source={source} {...autoheightProps} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    padding: 10,
    backgroundColor: '#99b998' // green
  },
  autoheight: {
    flexGrow: 0,
    borderWidth: 3,
    borderColor: 'blue',
    backgroundColor: 'transparent' // red
  },
  container: {
    backgroundColor: '#27363b', // gray
    flexGrow: 0,
    padding: 0,
    margin: 0
  }
});
