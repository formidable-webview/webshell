import makeWebshell, {
  HandleHashChangeFeature,
  HandleHTMLDimensionsFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new HandleHashChangeFeature({ shouldResetHashOnEvent: true })
);
export const AutoheightWebViewInScrollView = (webshellProps) => {
  const scrollViewRef = useRef(null);
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  const [spaceTop, setSpaceTop] = useState(0);
  const onLayout = useCallback((e) => setSpaceTop(e.nativeEvent.layout.y), []);
  const onDOMHashChange = useCallback(
    (e) => {
      scrollViewRef.current?.scrollTo({
        y: e.targetElementBoundingRect.top + spaceTop,
        animated: true
      });
    },
    [spaceTop]
  );
  return (
    <ScrollView style={styles.scrollView} ref={scrollViewRef}>
      <View style={styles.viewBeforeWebView} />
      <Webshell
        onDOMHashChange={onDOMHashChange}
        onLayout={onLayout}
        {...autoheightWebshellProps}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  viewBeforeWebView: { height: 50, alignSelf: 'stretch' },
  scrollView: { flex: 1 }
});
