import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, ScrollView, View, LayoutRectangle } from 'react-native';
import {
  ForceResponsiveViewportFeature,
  HandleHTMLDimensionsFeature,
  ForceElementSizeFeature,
  HandleHashChangeFeature,
  HandleLinkPressFeature,
  useAutoheight,
  LinkPressTarget,
  HashChangeEvent,
  useWebshell
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import { TOP_TEXT_HEIGHT, STAT_HEIGHT, BACKGROUND } from './styles';
import { Stats } from './Stats';
import { AppControls } from './AppControls';
import introduction from './introduction.html';
import { Evidence } from './Evidence';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from './Provider';

const sourceMap: Record<string, WebViewSource> = {
  welcome: { html: introduction },
  wikipedia: { uri: 'https://en.wikipedia.org/wiki/React_Native' },
  firefox: {
    uri:
      'https://support.mozilla.org/en-US/kb/get-started-firefox-overview-main-features'
  },
  expo: { uri: 'https://docs.expo.io/' },
  washington: { uri: 'https://www.washingtonpost.com/' },
  fox: { uri: 'https://www.foxnews.com/' },
  nonresponsive: {
    uri: 'https://dequeuniversity.com/library/responsive/1-non-responsive#'
  },
  nsfw: {
    uri: 'https://motherfuckingwebsite.com/'
  }
};

export function HomeScreen() {
  const [layout, setLayout] = React.useState<LayoutRectangle | null>(null);
  const scrollViewRef = React.useRef<ScrollView>(null);
  const containerPaddingTopRef = React.useRef<number>(0);
  const insets = useSafeAreaInsets();
  const {
    allowWebViewNavigation,
    allowPinchToZoom,
    forceResponsiveLayout,
    showEvidence,
    showConsole,
    instance,
    paddingHz,
    sourceName,
    resizeMethod
  } = useStore();
  const source = sourceMap[sourceName];
  const {
    autoheightWebshellProps,
    resizeImplementation,
    contentSize,
    syncState
  } = useAutoheight({
    webshellProps: {
      source,
      style: styles.autoheight,
      webshellDebug: true
    },
    initialHeight: 200
  });
  const containerPaddingTop = showEvidence ? TOP_TEXT_HEIGHT : 0;
  containerPaddingTopRef.current = containerPaddingTop;
  const features = React.useMemo(() => {
    const fts = [
      new HandleLinkPressFeature({
        preventDefault: !allowWebViewNavigation
      }),
      new HandleHTMLDimensionsFeature({
        forceImplementation: resizeMethod === 'auto' ? false : resizeMethod,
        deltaMin: 0
      }),
      new HandleHashChangeFeature({ shouldResetHashOnEvent: true }),
      new ForceResponsiveViewportFeature({
        maxScale: allowPinchToZoom ? 1.5 : 1
      })
    ];
    forceResponsiveLayout &&
      fts.push(new ForceElementSizeFeature({ target: 'body' }) as any);
    return fts;
  }, [
    allowPinchToZoom,
    allowWebViewNavigation,
    resizeMethod,
    forceResponsiveLayout
  ]);
  const onDOMLinkPress = React.useCallback(
    (target: LinkPressTarget) => {
      if (target.scheme.match(/^https?$/)) {
        if (!allowWebViewNavigation) {
          WebBrowser.openBrowserAsync(target.uri);
        } else {
          scrollViewRef.current?.scrollTo({
            y: containerPaddingTop,
            animated: true
          });
        }
      }
    },
    [allowWebViewNavigation, containerPaddingTop]
  );
  const onLayout = React.useCallback(
    (e) => setLayout(e.nativeEvent.layout),
    []
  );
  const onDOMHashChange = React.useCallback(
    (e: HashChangeEvent) =>
      scrollViewRef.current?.scrollTo({
        y: e.targetElementBoundingRect.top + containerPaddingTop,
        animated: true
      }),
    [containerPaddingTop]
  );
  const safeAreaStyle = React.useMemo(
    () => ({
      flex: 1,
      paddingLeft: insets.left,
      paddingRight: insets.right
    }),
    [insets]
  );
  const webshellContainerStyle = {
    paddingHorizontal: paddingHz,
    alignSelf: 'stretch' as 'stretch'
  };
  const webViewProps = useWebshell({
    features,
    props: {
      ...autoheightWebshellProps,
      onDOMLinkPress,
      onDOMHashChange,
      onLayout,
      scrollEnabled: false
    }
  });
  React.useEffect(() => {
    setLayout(null);
  }, [instance]);
  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({
      y: containerPaddingTopRef.current,
      animated: true
    });
  }, [source]);
  React.useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, [showEvidence]);
  return (
    <>
      <View style={[styles.root, safeAreaStyle]}>
        <ScrollView
          key={instance}
          ref={scrollViewRef}
          pinchGestureEnabled={false}
          horizontal={false}
          contentContainerStyle={[styles.container]}>
          {showConsole ? <View style={styles.statsPlaceholder} /> : null}
          {showEvidence ? <Evidence webshellPosition="below" /> : null}
          <View style={webshellContainerStyle}>
            <WebView {...webViewProps} />
          </View>
          {showEvidence ? <Evidence webshellPosition="above" /> : null}
        </ScrollView>
        <AppControls scrollViewRef={scrollViewRef} />
        <Stats
          display={showConsole}
          contentSize={contentSize}
          layout={layout}
          source={source}
          resizeImplementation={resizeImplementation}
          syncState={syncState}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  safeContainer: {},
  statusBarPlaceholder: {
    backgroundColor: BACKGROUND,
    width: '100%'
  },
  autoheight: {
    backgroundColor: 'transparent'
  },
  statsPlaceholder: {
    height: STAT_HEIGHT,
    alignSelf: 'stretch'
  },
  container: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    flexShrink: 0,
    flexGrow: 1
  },
  root: {
    flexGrow: 1
  }
});
