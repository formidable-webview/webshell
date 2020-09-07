import * as React from 'react';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, ScrollView, View, LayoutRectangle } from 'react-native';
import makeWebshell, {
  forceResponsiveViewportFeature,
  handleHTMLDimensionsFeature,
  forceElementSizeFeature,
  handleHashChangeFeature,
  handleLinkPressFeature,
  useAutoheight,
  LinkPressTarget,
  HashChangeEvent,
  ContentSize
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
import { Provider as PaperProvider, Text, DarkTheme } from 'react-native-paper';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import {
  TOP_TEXT_HEIGHT,
  BOTTOM_SHEET_COLLAPSED_OFFSET,
  STAT_HEIGHT
} from './styles';
import { Stats } from './Stats';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { useControls } from './controls';
import introduction from './introduction.html';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble({ forceImplementation: false }),
  handleHashChangeFeature.assemble({ shouldResetHashOnEvent: true }),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceElementSizeFeature.assemble({ target: 'body' })
);

type WebshellProps = React.ComponentProps<typeof Webshell>;

const sourceMap: Record<string, WebViewSource> = {
  welcome: { html: introduction },
  wikipedia: { uri: 'https://en.wikipedia.org/wiki/React_Native' },
  firefox: {
    uri:
      'https://support.mozilla.org/en-US/kb/get-started-firefox-overview-main-features'
  },
  expo: { uri: 'https://docs.expo.io/' },
  washington: { uri: 'https://www.washingtonpost.com/' },
  fox: { uri: 'https://www.foxnews.com/' }
};

const theme: Theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, surface: '#1f1b6f' }
};

export default function App() {
  const [contentSize, setContentSize] = React.useState<ContentSize>({
    height: undefined,
    width: undefined
  });
  const [layout, setLayout] = React.useState<LayoutRectangle | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const {
    animated,
    bottomSheet,
    hasTextAround,
    instance,
    paddingHz,
    showStats,
    sourceName
  } = useControls({ scrollViewRef });
  const source = sourceMap[sourceName];
  const onDOMLinkPress = React.useCallback((target: LinkPressTarget) => {
    if (target.scheme.match(/^https?$/)) {
      WebBrowser.openBrowserAsync(target.uri);
    }
  }, []);
  const onLayout = React.useCallback(
    (e) => setLayout(e.nativeEvent.layout),
    []
  );
  const onDOMHashChange = React.useCallback(
    (e: HashChangeEvent) =>
      scrollViewRef.current?.scrollTo({
        y:
          e.targetElementBoundingRect.top +
          (hasTextAround ? TOP_TEXT_HEIGHT : 0),
        animated: true
      }),
    [hasTextAround]
  );
  const autoheightProps = useAutoheight<WebshellProps>({
    webshellProps: {
      source,
      style: styles.autoheight,
      webshellDebug: false
    },
    onContentSizeChange: setContentSize,
    animated
  });
  const webshellContainerStyle = {
    paddingHorizontal: paddingHz,
    alignSelf: 'stretch' as 'stretch'
  };
  React.useEffect(() => {
    setContentSize({ width: undefined, height: undefined });
    setLayout(null);
  }, [instance]);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.root}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={[
            styles.container,
            { paddingBottom: BOTTOM_SHEET_COLLAPSED_OFFSET },
            showStats ? { paddingTop: STAT_HEIGHT } : null
          ]}>
          <View style={webshellContainerStyle}>
            {hasTextAround ? (
              <Text style={[styles.text, { height: TOP_TEXT_HEIGHT }]}>
                This is a React Native Text element inside of the containing
                ScrollView, above the WebView component.
              </Text>
            ) : null}
            <Webshell
              caca={'sssssqsqs'}
              key={instance}
              onDOMLinkPress={onDOMLinkPress}
              onDOMHashChange={onDOMHashChange}
              onLayout={onLayout}
              pointerEvents="none"
              {...autoheightProps}
            />
          </View>
          {hasTextAround ? (
            <Text style={[styles.text, { height: TOP_TEXT_HEIGHT }]}>
              This is a React Native Text element inside of the containing
              ScrollView, bellow the WebView component.
            </Text>
          ) : null}
        </ScrollView>
        <Stats
          display={showStats}
          contentSize={contentSize}
          layout={layout}
          source={source}
        />
      </View>
      {bottomSheet}
    </PaperProvider>
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
    backgroundColor: 'transparent'
  },
  controlsContainer: {
    maxWidth: 400
  },
  container: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    paddingBottom: BOTTOM_SHEET_COLLAPSED_OFFSET
  },
  root: {
    flexGrow: 1,
    marginTop: Constants.statusBarHeight
  }
});
