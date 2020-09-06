import * as React from 'react';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, ScrollView, Text, View, Button } from 'react-native';
import makeWebshell, {
  forceResponsiveViewportFeature,
  handleHTMLDimensionsFeature,
  forceElementSizeFeature,
  handleHashChangeFeature,
  handleLinkPressFeature,
  useAutoheight,
  LinkPressTarget,
  HashChangeEvent
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble({ forceImplementation: false }),
  handleHashChangeFeature.assemble({ shouldResetHashOnEvent: true }),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceElementSizeFeature.assemble({ target: 'body' })
);

type WebshellProps = React.ComponentProps<typeof Webshell>;

const html = `
<!DOCTYPE html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      background-color: #2b2b2b;
      color: #c9c9c9;
      overflow-vertical: hidden;
      box-sizing: border-box;
      font-size: 14px;
    }
    h2, h3 {
      color: white;
      font-family: serif;
    }
    h2 {
      text-align: center;
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
    strong {
      color: white;
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
      position: relative;
      padding-horizontal: 10px;
      padding: 10px;
      border: 1px solid #d4aa00;
      border-radius: 10px;
      background-color: #303030;
    }
    .workaround::before {
      content: "💡";
      line-height: 1em;
      left: -20px;
      top: calc(50% - 0.5em);
      position: absolute;
      color: yellow;
      font-weight: bold;
    }
    code {
      color: #d4aa00;
      font-size: 12px;
    }
    a {
      color: #329ea8;
      font-style: italic;
      text-decoration: none;
    }
    a[href ^="#"] {
      color: white;
    }
    kbd {
      background-color: #d4aa00;
      color: #2b2b2b;
    }
  </style>
</head>
<html>
  <body>
    <div id="container">
    <article>
      <div class="image-container">
        <a href="https://github.com/formidable-webview/webshell#readme">
          <img src="https://avatars3.githubusercontent.com/u/69217828?s=400&u=f3c683287f866a197e49df2c7308fed60df79589&v=4" width="40" height="40" />
        </a>
      </div>
      <div class="brand">
         <a href="https://github.com/formidable-webview/webshell#readme">@formidable-webview/webshell</a>
      </div>
      <h2>Create a WebView which adjusts layout viewport to content size</h2>
      Thanks to <code>webshell</code> library, you can decorate <code>WebView</code> with on-demand features.
      It doesn't add a WebView dependency; you pick the WebView you want and use <code>makeWebshell</code> to add the desired features.
      <h3>Pros</h3>
      <ul>
        <li>
        The behavior has been studied and is rigorous. It will use the best API available in the browser <strong>to dynamically adapt layout to content size</strong>. In order of preference, <a href="https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver">ResizeObserver</a>, <a href="https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver">MutationObserver</a> and finally, simple polling.
        </li>
        <li>
        The width of the viewport will naturally span to the available horizontal space and doesn't need to be specified.
        </li>
        <li>
        The height of the viewport dynamically adapts to its content height, even during screen rotations. See the <a href="#play">Play</a> section bellow.
        </li>
        <li>
        When the content overflows the layout on the horizontal axis, you can still scroll horizontally.
        The scroll is happening inside the <code>WebView</code>.
        </li>
      </ul>
      <h3>Caveats and Workarounds</h3>
      <ul>
        <li>
        Because the <strong>viewport height</strong> is now <strong>bound</strong> to the <strong>content heigh</strong>, you
        must not have a <strong>body</strong> element height depending on viewport height, such as
        when using <code>height: 100vh;</code> or <code>height: 100%;</code>. That is an evil cyclic dependency ready to cast an infinite loop!
        <p class="workaround">
          This can be guaranteed by forcing body
          height to <strong>auto</strong> with webshell's <code>forceElementSizeFeature</code>.
        </p>
        </li>
        <li>
        In some circumstances, the mobile browser might use a virtual viewport much larger then the available width in the WebView, often around 980px for websites
        which have been built for desktop. For this autoheight component to be reliable, you must guarantee that the content has a
        <a href="https://www.w3schools.com/css/css_rwd_viewport.asp">meta viewport element</a> in the header.
        <p class="workaround">
        This can be guaranteed by forcing responsive layout with webshell's <code>forceResponsiveViewportFeature</code>.
        </p>
        </li>
        <li>
        Scroll to hash on link press (#) will not work out of the box, because the <code>WebView</code> is not scrollable anymore.
        <p class="workaround">
        However, you can react to <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event">hash changes</a> and scroll imperatively with <code>handleHashChangeFeature</code>.
        This is exactly how it is implemented here, <a href="#container">try this</a>.
        </p>
        </li>
        <li>
        When you press the <kbd>ADD PADDING AROUND WEBVIEW</kbd> button above this <code>WebView</code>,
        you will notice the layout reajusts to padding changes. Unfortunately, this cannot be done automatically.
        <p class="workaround">
        You need to provide <code>useAutoheight</code> with <code>extraLayoutViewportProps</code>
        in order to trigger a layout viewport reinitialization when this value changes. This is
        similar to <a href="https://reactnative.dev/docs/flatlist#extradata">React Native FlatList extraData prop</a>.
        </p>
        </li>
        <li>
        While using <strong>React Native</strong> <a href="https://reactnative.dev/docs/fast-refresh">Fast Refresh</a> and changing the content of the source on the fly, you can run into weird behaviors.
        </li>
      </ul>
      <h3 id="play">Play</h3>
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
      <div class="container">
        <a href="#container">↑ go to top</a>
      </div>
    </article>
    <footer id="fullwidth">
      <em>Change this footer height with the controls above</em>.
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

// source = { uri: 'https://www.developpez.com/' };

export default function App() {
  const [padding, setPadding] = React.useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const changePadding = React.useCallback(
    () => setPadding((p) => (p ? 0 : 20)),
    []
  );
  const onDOMLinkPress = React.useCallback((target: LinkPressTarget) => {
    if (target.scheme.match(/^https?$/)) {
      WebBrowser.openBrowserAsync(target.uri);
    }
  }, []);
  const onDOMHashChange = React.useCallback(
    (e: HashChangeEvent) =>
      scrollViewRef.current?.scrollTo({
        y: e.targetElementBoundingRect.top + BUTTON_CONTAINER_HEIGHT,
        animated: true
      }),
    []
  );
  const autoheightProps = useAutoheight<WebshellProps>({
    webViewProps: {
      source,
      style: styles.autoheight
    },
    extraLayout: padding,
    debug: false
  });
  return (
    <View style={styles.root}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            onPress={changePadding}
            color="#d4aa00"
            title={`${padding ? 'Remove' : 'Add'} padding around WebView`}
          />
        </View>
        <View style={{ paddingHorizontal: padding }}>
          <Webshell
            onDOMLinkPress={onDOMLinkPress}
            onDOMHashChange={onDOMHashChange}
            {...autoheightProps}
          />
        </View>
        <Text style={[styles.text, styles.textInScrollView]}>
          This is a React Native Text element.
        </Text>
      </ScrollView>
    </View>
  );
}

const BUTTON_CONTAINER_HEIGHT = 60;

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
  buttonContainer: {
    padding: 10,
    height: BUTTON_CONTAINER_HEIGHT
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
