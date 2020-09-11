import { default as React, memo } from 'react';
import { LayoutRectangle, StyleSheet, Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { STAT_HEIGHT } from './styles';
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes';
import {
  HTMLDimensionsImplementation,
  RectSize
} from '@formidable-webview/webshell';
import { ScrollView } from 'react-native-gesture-handler';
import { Surface, useTheme } from 'react-native-paper';

export interface StatsProps {
  source: WebViewSource;
  contentSize: Partial<RectSize>;
  layout: LayoutRectangle | null;
  display?: boolean;
  resizeImplementation: null | HTMLDimensionsImplementation;
  computingState: string;
}

const BACKGROUND = '#0f0f0f';

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
    const textStyle = [styles.text, { color: '#aaaaaa' }];
    const entryStyle = [styles.entryName, { color: colors.accent }];
    return (
      <>
        {display ? (
          <Surface style={styles.stats}>
            <ScrollView
              horizontal
              contentContainerStyle={{ flexDirection: 'column' }}>
              <Text selectable style={textStyle}>
                {source['uri'] || 'about:blank'}
              </Text>
              <Text selectable={false} style={textStyle}>
                <Text style={entryStyle}>content</Text>
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
                <Text style={entryStyle}>viewport</Text> W:{' '}
                {layout == null ? 'unset' : Math.round(layout.width)}
                {', '}
                H: {layout == null ? 'unset' : Math.round(layout.height)}
                {'\n'}
                <Text style={entryStyle}>impl.</Text>
                {'    '}
                {getResizeName(resizeImplementation)}
                {'\n'}
                <Text style={entryStyle}>state</Text>
                {'    '}
                {computingState}
              </Text>
            </ScrollView>
          </Surface>
        ) : null}
        <StatusBar style="light" backgroundColor={BACKGROUND} />
      </>
    );
  }
);
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  stats: {
    position: 'absolute',
    top: Constants.statusBarHeight + 3,
    left: 3,
    right: 3,
    padding: 8,
    height: STAT_HEIGHT - 6,
    elevation: 0,
    backgroundColor: BACKGROUND,
    opacity: 0.92
  },
  text: {
    fontFamily: Platform.select({ default: 'monospace', ios: 'Menlo' }),
    fontSize: 12
  },
  entryName: {
    fontWeight: 'bold'
  }
});
