import { default as React, memo } from 'react';
import {
  LayoutRectangle,
  StyleSheet,
  Platform,
  Text,
  View
} from 'react-native';
import { BACKGROUND, STAT_HEIGHT } from './styles';
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
  syncState: string;
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
    syncState
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
              <View style={{ flexDirection: 'row' }}>
                <View>
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
                  </Text>
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text selectable={false} style={textStyle}>
                    <Text style={entryStyle}>impl. </Text>
                    {getResizeName(resizeImplementation)}
                    {'\n'}
                    <Text style={entryStyle}>state</Text> {syncState}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </Surface>
        ) : null}
      </>
    );
  }
);

const styles = StyleSheet.create({
  stats: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    height: STAT_HEIGHT - 3,
    elevation: 0,
    backgroundColor: BACKGROUND,
    opacity: 0.92
  },
  text: {
    fontFamily: Platform.select({ default: 'monospace', ios: 'Menlo' }),
    fontSize: 11
  },
  entryName: {
    fontWeight: 'bold'
  }
});
