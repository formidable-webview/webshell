import * as React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, ScrollView, PixelRatio, View } from 'react-native';
import makeWebshell, {
  htmlDimensionsFeature,
  fixViewportFeature
} from '@formidable-webview/webshell';
import { useAutoheight } from './autoheigh-hook';
import WebView from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

const Webshell = makeWebshell(
  WebView,
  htmlDimensionsFeature.assemble(),
  fixViewportFeature.assemble()
);

const width = 500;
const height = 200;

const html = `
<!DOCTYPE html>
<head>
  <style>
    body {
      border: 1px solid white;
      background-color: yellow;
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
          src="https://via.placeholder.com/${
            PixelRatio.get() * width + 'x' + PixelRatio.get() * height
          }"
          width="${width}"
          height="${height}"
        />
      </div>
    </div>
  </body>
</html>
`;

let source: WebViewSource = { html };
source = {
  uri:
    'https://support.mozilla.org/en-US/kb/get-started-firefox-overview-main-features'
};

export default function App() {
  const autoheightProps = useAutoheight({
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
