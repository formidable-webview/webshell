import { default as React, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Switch, Surface, List, useTheme } from 'react-native-paper';
import PickerSelect, { PickerStyle } from 'react-native-picker-select';
import { useStore } from './Provider';

const sourceItems = [
  { label: 'Showcase', value: 'welcome' },
  { label: 'Wikipedia', value: 'wikipedia' },
  { label: 'Firefox', value: 'firefox' },
  { label: 'Expo', value: 'expo' },
  { label: 'Washington Post', value: 'washington' },
  { label: 'Fake News', value: 'fox' },
  { label: 'NSFW', value: 'nsfw' }
];

const resizeMethodItems = [
  { label: 'Automatic', value: 'auto' },
  { label: 'ResizeObserver', value: 'resize' },
  { label: 'MutationObserver', value: 'mutation' },
  { label: 'Polling', value: 'polling' }
];

export const OptionsScreen = () => {
  const theme = useTheme();
  const windowDimensions = useWindowDimensions();
  const {
    allowWebViewNavigation,
    allowPinchToZoom,
    forceResponsiveLayout,
    showEvidence,
    showConsole,
    paddingHz,
    sourceName,
    resizeMethod,
    setResizeMethod,
    setSourceName,
    toggleAllowPinchToZoom,
    toggleAllowWebViewNavigation,
    toggleConsole,
    toggleEvidence,
    toggleForceResponsiveLayout,
    togglePadding
  } = useStore();
  const pickerStyle: PickerStyle = useMemo(
    () => ({
      viewContainer: { marginHorizontal: 8 },
      inputAndroid: { color: theme.colors.onSurface },
      inputIOS: { color: theme.colors.onSurface }
    }),
    [theme.colors]
  );
  return (
    <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      <Surface style={{ flexGrow: 1 }}>
        <View style={styles.bottomSheet}>
          <View style={{ width: Math.min(500, windowDimensions.width) }}>
            <List.Section title="Page">
              <View>
                <PickerSelect
                  value={sourceName}
                  useNativeAndroidPickerStyle={true}
                  style={pickerStyle}
                  items={sourceItems}
                  onValueChange={setSourceName}
                />
              </View>
            </List.Section>
            <List.Section title="Resize implementation">
              <View>
                <PickerSelect
                  value={resizeMethod}
                  useNativeAndroidPickerStyle={true}
                  style={pickerStyle}
                  items={resizeMethodItems}
                  onValueChange={setResizeMethod}
                />
              </View>
            </List.Section>
            <List.Section title="Customize">
              <List.Item
                title="Show evidence"
                description="Add React Native elements above and below WebView."
                right={() => (
                  <Switch value={showEvidence} onValueChange={toggleEvidence} />
                )}
              />

              <List.Item
                title="Display horizontal padding"
                description="You will notice the width of the content adjust."
                right={() => (
                  <Switch value={!!paddingHz} onValueChange={togglePadding} />
                )}
              />
              <List.Item
                title="Show console"
                description="Display a sticky frame with autoheight metrics"
                right={() => (
                  <Switch value={showConsole} onValueChange={toggleConsole} />
                )}
              />
              <List.Item
                title="Enable pinch-to-zoom (x1.5)"
                description="Allow the WebView to be zoomed"
                right={() => (
                  <Switch
                    value={allowPinchToZoom}
                    onValueChange={toggleAllowPinchToZoom}
                  />
                )}
              />
              <List.Item
                title="Open external links in system browser"
                description="When off, external links will cause the WebView to change location."
                right={() => (
                  <Switch
                    value={!allowWebViewNavigation}
                    onValueChange={toggleAllowWebViewNavigation}
                  />
                )}
              />
              <List.Item
                title="Force responsive layout"
                description="Insert a meta viewport element."
                right={() => (
                  <Switch
                    value={forceResponsiveLayout}
                    onValueChange={toggleForceResponsiveLayout}
                  />
                )}
              />
            </List.Section>
          </View>
        </View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  pagePicker: {
    backgroundColor: 'rgba(0,0,0,0.035)'
  },
  bottomSheet: {
    alignItems: 'center',
    flexGrow: 1
  },
  safePlaceholder: {
    width: '100%',
    backgroundColor: '#1b2229'
  },
  bottomSheetHeader: {
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  controlText: {
    paddingRight: 10
  },
  controlContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  }
});
