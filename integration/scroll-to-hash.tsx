import makeWebshell, {
  HandleHashChangeFeature,
  HandleHTMLDimensionsFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new HandleHashChangeFeature({ shouldResetHashOnEvent: true })
);

const SCROLL_SPACE_TOP = 30;

export const MyScrollableAutoheightWebView = (webshellProps) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  const onDOMHashChange = React.useCallback((e) => {
    scrollViewRef.current &&
      scrollViewRef.current.scrollTo({
        y: e.targetElementBoundingRect.top + SCROLL_SPACE_TOP,
        animated: true
      });
  }, []);
  return (
    <ScrollView style={styles.scrollView} ref={scrollViewRef}>
      <View style={styles.viewBeforeWebView} />
      <Webshell
        onDOMHashChange={onDOMHashChange}
        {...autoheightWebshellProps}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewBeforeWebView: { height: SCROLL_SPACE_TOP, alignSelf: 'stretch' },
  scrollView: { flex: 1 }
});
