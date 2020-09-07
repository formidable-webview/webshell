import { default as React, memo } from 'react';
import { Text, LayoutRectangle, StyleSheet, Platform } from 'react-native';
import { STAT_HEIGHT, BACKGROUND_DARK } from './styles';
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
      <Text selectable style={styles.text}>
        <Text style={styles.entryName}>{source['uri'] || 'about:blank'}</Text>
        {'\n'}
        <Text style={styles.entryName}>content</Text>
        {'  '}W:{' '}
        {contentSize.width === undefined
          ? 'unset'
          : Math.round(contentSize.width)}
        {', '}
        H:{' '}
        {contentSize.height === undefined
          ? 'unset'
          : Math.round(contentSize.height)}
        {'\n'}
        <Text style={styles.entryName}>viewport</Text> W:{' '}
        {layout == null ? 'unset' : Math.round(layout.width)}
        {', '}
        H: {layout == null ? 'unset' : Math.round(layout.height)}
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
    backgroundColor: BACKGROUND_DARK,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'white',
    padding: 3,
    height: STAT_HEIGHT
  },
  text: {
    fontFamily: Platform.select({ default: 'monospace', ios: 'Menlo' }),
    color: 'white',
    fontSize: 12
  },
  entryName: {
    fontWeight: 'bold'
  }
});
