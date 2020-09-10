import { default as React, memo } from 'react';
import { LayoutRectangle, StyleSheet, Platform, Text } from 'react-native';
import { STAT_HEIGHT } from './styles';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import {
  HTMLDimensionsImplementation,
  RectSize
} from '@formidable-webview/webshell';
import { ScrollView } from 'react-native-gesture-handler';
import { Surface, useTheme, Colors } from 'react-native-paper';

export interface StatsProps {
  source: WebViewSource;
  contentSize: Partial<RectSize>;
  layout: LayoutRectangle | null;
  display?: boolean;
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
    display = true,
    source,
    contentSize,
    layout,
    resizeImplementation,
    computingState
  }: StatsProps) => {
    const { colors } = useTheme();
    const textStyle = [styles.text, { color: colors.accent }];
    return display ? (
      <Surface style={styles.stats}>
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
            <Text style={styles.entryName}>state</Text>
            {'    '}
            {computingState}
          </Text>
        </ScrollView>
      </Surface>
    ) : null;
  }
);
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  stats: {
    position: 'absolute',
    top: Constants.statusBarHeight,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 8,
    height: STAT_HEIGHT,
    elevation: 0,
    backgroundColor: '#2b2a2a',
    opacity: 0.9
  },
  text: {
    fontFamily: Platform.select({ default: 'monospace', ios: 'Menlo' }),
    fontSize: 12,
    color: Colors.green300
  },
  entryName: {
    fontWeight: 'bold'
  }
});
