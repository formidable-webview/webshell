import * as React from 'react';
import Constants from 'expo-constants';
import { StyleSheet, ScrollView, PixelRatio } from 'react-native';
import makeWebshell, {
  htmlDimensionsFeature
} from '@formidable-webview/webshell';
import { useAutoheight } from './autoheigh-hook';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(WebView, htmlDimensionsFeature.assemble());

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

export default function App() {
  const autoheightProps = useAutoheight({
    style: styles.autoheight,
    maxScale: 3
  });
  const onLayout = ({ nativeEvent }) => console.info('LAYOUT', nativeEvent);
  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <Webshell onLayout={onLayout} source={{ html }} {...autoheightProps} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
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
    flexGrow: 1,
    padding: 0,
    margin: 0
  }
});
