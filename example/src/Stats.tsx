import { default as React, memo } from 'react';
import { Text, LayoutRectangle, StyleSheet } from 'react-native';
import { STAT_HEIGHT } from './styles';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import { ContentSize } from '@formidable-webview/webshell';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
  source: WebViewSource;
  contentSize: ContentSize;
  layout: LayoutRectangle | null;
  display: boolean;
}

export const Stats = memo(({ display, source, contentSize, layout }: Props) => {
  return display ? (
    <ScrollView horizontal={true} style={styles.stats}>
      <Text style={styles.text}>
        <Text style={styles.entryName}>Content</Text>
        {'  '}Width:{' '}
        {contentSize.width === undefined
          ? 'unset'
          : Math.round(contentSize.width)}
        {', '}
        Height:{' '}
        {contentSize.height === undefined
          ? 'unset'
          : Math.round(contentSize.height)}
        {'\n'}
        <Text style={styles.entryName}>Viewport</Text> Width:{' '}
        {layout == null ? 'unset' : Math.round(layout.width)}
        {', '}
        Height: {layout == null ? 'unset' : Math.round(layout.height)}
        {'\n'}
        <Text style={styles.entryName}>URL</Text>
        {'      '}
        {source['uri'] || 'about:blank'}
      </Text>
    </ScrollView>
  ) : null;
});

const styles = StyleSheet.create({
  stats: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    padding: 3,
    height: STAT_HEIGHT
  },
  text: { fontFamily: 'monospace', color: 'green', fontSize: 12 },
  entryName: {
    fontWeight: 'bold'
  }
});
