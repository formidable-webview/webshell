import { default as React, memo } from 'react';
import { LayoutRectangle, StyleSheet, Platform, Text } from 'react-native';
import { STAT_HEIGHT } from './styles';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import {
  HTMLDimensionsImplementation,
  RectSize
} from '@formidable-webview/webshell';
import { ScrollView } from 'react-native-gesture-handler';
import { Surface, useTheme } from 'react-native-paper';

interface Props {
  source: WebViewSource;
  contentSize: Partial<RectSize>;
  layout: LayoutRectangle | null;
  display: boolean;
  resizeImplementation: null | HTMLDimensionsImplementation;
  computingState: string;
}

function getResizeName(
  resizeImplementation: null | HTMLDimensionsImplementation
) {
  return resizeImplementation === 'mutation'
    ? 'MutationObserver'
    : resizeImplementation === 'polling'
    ? 'Polling (200ms)'
    : resizeImplementation === 'resize'
    ? 'ResizeObserver'
    : 'undetermined';
}

export const Stats = memo(
  ({
    display,
    source,
    contentSize,
    layout,
    resizeImplementation,
    computingState
  }: Props) => {
    const { colors } = useTheme();
    const textStyle = [styles.text, { color: 'white' }];
    return display ? (
      <Surface style={[styles.stats, { backgroundColor: colors.primary }]}>
        <ScrollView horizontal>
          <Text selectable style={textStyle}>
            <Text style={styles.entryName}>
              {source['uri'] || 'about:blank'}
            </Text>
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
            {'\n'}
            <Text style={styles.entryName}>impl.</Text>
            {'    '}
            {getResizeName(resizeImplementation)}
            {'\n'}
            <Text style={styles.entryName}>state</Text> {computingState}
          </Text>
        </ScrollView>
      </Surface>
    ) : null;
  }
);

const styles = StyleSheet.create({
  stats: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 3,
    height: STAT_HEIGHT,
    elevation: 0
  },
  text: {
    fontFamily: Platform.select({ default: 'monospace', ios: 'Menlo' }),
    fontSize: 12
  },
  entryName: {
    fontWeight: 'bold'
  }
});
