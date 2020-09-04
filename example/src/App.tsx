import * as React from 'react';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
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
  handleHTMLDimensionsFeature.assemble(),
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
      color: #d4aa00;
      text-align: center;
    }
    h2, h3 {
      font-family: serif;
    }
    * {
      box-sizing: border-box;
    }
    li {
      margin-bottom: 10px;
    }
    .container {
      padding-bottom: 10px;
      display: flex;
      justify-content: center;
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
    .workaround {
      border: 1px solid #d4aa00;
      padding: 5px;
    }
    code {
      color: #d4aa00;
      font-size: 12px;
    }
    a {
      color: #329ea8;
      text-decoration: none;
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
      <h2>Create a WebView which adjusts layout viewport to content size</h2>
      Thanks to <code>webshell</code> library, you can decorate <code>WebView</code> with on-demand features.
      It doesn't add a WebView dependency; you pick the WebView you want and use <code>makeWebshell</code> to add the desired features.
      <h3>Strengths</h3>
      <ul>
        <li>
        The behavior has been studied and is rigorous. It will use the best API available in the browser <strong>to dynamically adapt layout to content size</strong>. In order of preference, <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">ResizeObserver</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver">MutationObserver</a> an finally, simple polling.
        </li>
        <li>
        When the content overflows the layout on the horizontal axis, you can still scroll horizontally.
        The scroll is happening inside the <code>WebView</code>.
        </li>
      </ul>
      <h3>Caveats</h3>
      <ul>
        <li>
        Because the <strong>viewport height</strong> is now <strong>bound</strong> to the <strong>content heigh</strong>, you
        must not have a <strong>body</strong> element which height depends on viewport, such as
        when using <code>height: 100vh;</code> or <code>height: 100%;</code>. That is a cyclic dependency which would cast an infinite loop!
        <p class="workaround">
        This can be worked around by forcing body
        height to <strong>auto</strong> with <code>forceBodySizeFeature</code>.
        </p>
        </li>
        <li>
        In some circumstances, the mobile browser might use a virtual viewport much larger then the available width in the WebView, often around 980px for websites
        which have been built for desktop. For this autoheight component to be reliable, you must guarantee that the content has a
        <a href="https://www.w3schools.com/css/css_rwd_viewport.asp">meta viewport element</a> in the header.
        <p class="workaround">
        This can be worked around by forcing responsive layout with <code>forceResponsiveViewportFeature</code>.
        </p>
        </li>
        <li>
        It is buggy with <strong>React Native</strong> <a href="https://reactnative.dev/docs/fast-refresh">Fast Refresh</a> when you change the content of the source on the fly, but that's just during development.
        </li>
        <li>
        Link to scroll (#fragments) will not work, obviously, because there is no scrollable content anymore.
        </li>
      </ul>
      <h3>Play</h3>
      <ul>
        <li>
          <strong>Shrink</strong> and <strong>increase footer</strong> by pressing buttons and notice how the <code>WebView</code> height adapts dynamically.
        </li>
        <li>
        <strong>Rotate</strong> the <strong>screen</strong> and observe how the <code>WebView</code> height and width will adjust.
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
    onDOMLinkPress: WebBrowser.openBrowserAsync
  });
  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.text, styles.textInScrollView]}>
          The white area is inside the ScrollView, outside the WebView. The
          dark-gray area delimits the WebView.
        </Text>
        <Webshell {...autoheightProps} />
        <Text style={[styles.text, styles.textInScrollView]}>
          This is a React Native Text element.
        </Text>
      </ScrollView>
    </View>
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
    backgroundColor: 'white',
    padding: 0,
    margin: 0
  },
  root: {
    flexGrow: 1,
    marginTop: Constants.statusBarHeight
  }
});
