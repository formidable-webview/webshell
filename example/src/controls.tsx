import { default as React, RefObject, useCallback, memo, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Switch, Surface, List, Appbar, useTheme } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import Constants from 'expo-constants';
import PickerSelect, { PickerStyle } from 'react-native-picker-select';
import {
  BOTTOM_SHEET_COLLAPSED_OFFSET,
  BOTTOM_SHEET_CONTENT_HEIGHT,
  APPBAR_HEIGHT,
  animateNextFrame
} from './styles';
import { HTMLDimensionsImplementation } from '@formidable-webview/webshell';

interface Props {
  scrollViewRef: RefObject<ScrollView>;
}

const ControlsHeader = memo(
  ({
    forceRerender,
    scrollToStart,
    scrollToEnd,
    isSheetOpen,
    showConsole,
    showEvidence,
    toggleSettings,
    toggleConsole,
    toggleEvidence
  }: any) => {
    const {
      colors: { accent }
    } = useTheme();
    return (
      <Appbar style={styles.bottomSheetHeader}>
        <Appbar.Action size={20} icon="refresh" onPress={forceRerender} />
        <Appbar.Action size={20} icon="chevron-up" onPress={scrollToStart} />
        <Appbar.Action size={20} icon="chevron-down" onPress={scrollToEnd} />
        <Appbar.Content title="" />
        <Appbar.Action
          color={showConsole ? accent : undefined}
          size={20}
          icon="console-line"
          onPress={toggleConsole}
        />
        <Appbar.Action
          color={showEvidence ? accent : undefined}
          size={20}
          icon="foot-print"
          onPress={toggleEvidence}
        />
        <Appbar.Action
          size={20}
          icon={isSheetOpen ? 'arrow-expand-down' : 'settings'}
          onPress={toggleSettings}
        />
      </Appbar>
    );
  }
);

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

export type ForceMethodOption = 'auto' | HTMLDimensionsImplementation;

export function useControls({ scrollViewRef }: Props) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const theme = useTheme();
  const [paddingHz, setPaddingHz] = React.useState(0);
  const [showEvidence, setShowEvidence] = React.useState(false);
  const [showConsole, setShowConsole] = React.useState(false);
  const [instance, setInstance] = React.useState(0);
  const [sourceName, setSourceName] = React.useState<string>('welcome');
  const [resizeMethod, setResizeMethod] = React.useState<ForceMethodOption>(
    'auto'
  );
  const pickerStyle: PickerStyle = useMemo(
    () => ({
      viewContainer: { marginHorizontal: 8 },
      inputAndroid: { color: theme.colors.onSurface },
      inputIOS: { color: theme.colors.onSurface }
    }),
    [theme.colors]
  );
  const [allowPinchToZoom, setAllowPinchToZoom] = React.useState(false);
  const windowDimensions = useWindowDimensions();
  const [allowWebViewNavigation, setAllowWebViewNavigation] = React.useState(
    false
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const closeBottomSheet = React.useCallback(
    () => sheetRef.current?.snapTo(0),
    []
  );
  const togglePadding = React.useCallback(() => {
    setPaddingHz((p) => (p ? 0 : 20));
    closeBottomSheet();
  }, [closeBottomSheet]);
  const toggleEvidence = React.useCallback(() => {
    animateNextFrame();
    setShowEvidence((b) => !b);
    closeBottomSheet();
  }, [closeBottomSheet]);
  const toggleAllowPinchToZoom = React.useCallback(() => {
    setAllowPinchToZoom((p) => !p);
    closeBottomSheet();
  }, [closeBottomSheet]);
  const toggleAllowWebViewNavigation = React.useCallback(() => {
    closeBottomSheet();
    setAllowWebViewNavigation((s) => !s);
  }, [closeBottomSheet]);
  const setSheetOpenTrue = React.useCallback(() => setIsSheetOpen(true), []);
  const setSheetOpenFalse = React.useCallback(() => setIsSheetOpen(false), []);
  const forceRerender = React.useCallback(() => {
    setInstance((i) => i + 1);
    closeBottomSheet();
  }, [closeBottomSheet]);
  const scrollToStart = React.useCallback(
    () => scrollViewRef.current?.scrollTo({ y: 0, animated: true }),
    [scrollViewRef]
  );
  const scrollToEnd = React.useCallback(
    () => scrollViewRef.current?.scrollToEnd({ animated: true }),
    [scrollViewRef]
  );
  const toggleSettings = React.useCallback(
    () => sheetRef.current?.snapTo(isSheetOpen ? 0 : 1),
    [isSheetOpen]
  );
  const toggleConsole = React.useCallback(() => {
    animateNextFrame();
    setShowConsole((s) => !s);
    closeBottomSheet();
  }, [closeBottomSheet]);
  const snapPointExpended = Math.min(
    BOTTOM_SHEET_CONTENT_HEIGHT + BOTTOM_SHEET_COLLAPSED_OFFSET,
    windowDimensions.height - Constants.statusBarHeight
  );
  const makeRenderControls = React.useCallback(
    () => () => (
      <Surface style={{ height: BOTTOM_SHEET_CONTENT_HEIGHT }}>
        <View style={styles.bottomSheet}>
          <View style={styles.controlsContainer}>
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
            </List.Section>
          </View>
        </View>
      </Surface>
    ),
    [
      sourceName,
      showEvidence,
      showConsole,
      paddingHz,
      allowWebViewNavigation,
      allowPinchToZoom,
      resizeMethod,
      toggleEvidence,
      toggleConsole,
      togglePadding,
      toggleAllowWebViewNavigation,
      toggleAllowPinchToZoom,
      pickerStyle
    ]
  );
  const renderHeader = useCallback(() => {
    return (
      <ControlsHeader
        forceRerender={forceRerender}
        scrollToEnd={scrollToEnd}
        scrollToStart={scrollToStart}
        toggleSettings={toggleSettings}
        isSheetOpen={isSheetOpen}
        showConsole={showConsole}
        showEvidence={showEvidence}
        toggleConsole={toggleConsole}
        toggleEvidence={toggleEvidence}
      />
    );
  }, [
    isSheetOpen,
    showConsole,
    showEvidence,
    scrollToStart,
    scrollToEnd,
    toggleSettings,
    forceRerender,
    toggleConsole,
    toggleEvidence
  ]);
  const renderSheet = () => (
    <BottomSheet
      enabledInnerScrolling={true}
      enabledContentTapInteraction={false}
      enabledHeaderGestureInteraction={true}
      ref={sheetRef}
      snapPoints={[BOTTOM_SHEET_COLLAPSED_OFFSET, snapPointExpended]}
      renderContent={makeRenderControls()}
      renderHeader={renderHeader}
      onOpenStart={setSheetOpenTrue}
      onOpenEnd={setSheetOpenTrue}
      onCloseStart={setSheetOpenFalse}
      onCloseEnd={setSheetOpenFalse}
    />
  );
  React.useEffect(() => {
    sheetRef.current?.snapTo(0);
  }, [windowDimensions.height]);
  return {
    renderSheet,
    allowPinchToZoom,
    allowWebViewNavigation,
    paddingHz,
    showEvidence,
    showConsole,
    instance,
    sourceName,
    resizeMethod
  };
}

const styles = StyleSheet.create({
  pagePicker: {
    backgroundColor: 'rgba(0,0,0,0.035)'
  },
  bottomSheet: {
    alignItems: 'center',
    flexGrow: 1,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray'
  },
  bottomSheetHeader: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: APPBAR_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'white'
  },
  controlText: {
    paddingRight: 10
  },
  controlContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  controlsContainer: {
    maxWidth: 400,
    alignSelf: 'stretch'
  }
});
