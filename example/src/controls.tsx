import { default as React, RefObject, useCallback, memo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Switch, Text, Surface, List, Appbar } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Constants from 'expo-constants';
import {
  BOTTOM_SHEET_COLLAPSED_OFFSET,
  BOTTOM_SHEET_CONTENT_HEIGHT,
  APPBAR_HEIGHT,
  BACKGROUND_DARK
} from './styles';

interface Props {
  scrollViewRef: RefObject<ScrollView>;
}

const ControlsHeader = memo(
  ({
    forceRerender,
    scrollToStart,
    scrollToEnd,
    isSheetOpen,
    toggleSettings
  }: any) => {
    return (
      <Appbar style={styles.bottomSheetHeader}>
        <Appbar.Action size={20} icon="refresh" onPress={forceRerender} />
        <Appbar.Content title="" />
        <Appbar.Action size={20} icon="chevron-up" onPress={scrollToStart} />
        <Appbar.Action size={20} icon="chevron-down" onPress={scrollToEnd} />
        <Appbar.Content title="" />
        <Appbar.Action
          size={20}
          icon={isSheetOpen ? 'arrow-expand-down' : 'settings'}
          onPress={toggleSettings}
        />
      </Appbar>
    );
  }
);

export function useControls({ scrollViewRef }: Props) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const [paddingHz, setPaddingHz] = React.useState(0);
  const [hasTextAround, setHasTextAround] = React.useState(false);
  const [animated, setAnimated] = React.useState(false);
  const [instance, setInstance] = React.useState(0);
  const [showStats, setShowStats] = React.useState(true);
  const [sourceName, setSourceName] = React.useState<string>('welcome');
  const [allowPinchToZoom, setAllowPinchToZoom] = React.useState(false);
  const windowDimensions = useWindowDimensions();
  const [allowWebViewNavigation, setAllowWebViewNavigation] = React.useState(
    false
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const togglePadding = React.useCallback(
    () => setPaddingHz((p) => (p ? 0 : 20)),
    []
  );
  const toggleTextAbove = React.useCallback(
    () => setHasTextAround((b) => !b),
    []
  );
  const toggleAnimated = React.useCallback(() => setAnimated((a) => !a), []);
  const toggleShowStats = React.useCallback(() => setShowStats((s) => !s), []);
  const toggleAllowPinchToZoom = React.useCallback(
    () => setAllowPinchToZoom((p) => !p),
    []
  );
  const toggleAllowWebViewNavigation = React.useCallback(
    () => setAllowWebViewNavigation((s) => !s),
    []
  );
  const setSheetOpenTrue = React.useCallback(() => setIsSheetOpen(true), []);
  const setSheetOpenFalse = React.useCallback(() => setIsSheetOpen(false), []);
  const forceRerender = React.useCallback(() => setInstance((i) => i + 1), []);
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
  const snapPointExpended = Math.min(
    BOTTOM_SHEET_CONTENT_HEIGHT + BOTTOM_SHEET_COLLAPSED_OFFSET,
    windowDimensions.height - Constants.statusBarHeight
  );
  const renderControls = React.useCallback(
    () => (
      <Surface style={{ height: BOTTOM_SHEET_CONTENT_HEIGHT }}>
        <View style={styles.bottomSheet}>
          <View style={styles.controlsContainer}>
            <List.Section title="Page">
              <View>
                <Picker
                  style={styles.pagePicker}
                  selectedValue={sourceName}
                  onValueChange={setSourceName as any}>
                  <Picker.Item label="Introduction" value="welcome" />
                  <Picker.Item
                    label="Wikipedia (React Native)"
                    value="wikipedia"
                  />
                  <Picker.Item
                    label="Firefox (getting started)"
                    value="firefox"
                  />
                  <Picker.Item label="Washington Post" value="washington" />
                  <Picker.Item label="Fox News" value="fox" />
                  <Picker.Item label="Expo (Get Started)" value="expo" />
                </Picker>
              </View>
            </List.Section>
            <List.Section title="Customize">
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Add space left and right of WebView?
                </Text>
                <Switch value={!!paddingHz} onValueChange={togglePadding} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Add React Native elements around WebView?
                </Text>
                <Switch value={hasTextAround} onValueChange={toggleTextAbove} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>Use height animations?</Text>
                <Switch value={animated} onValueChange={toggleAnimated} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>Show stats?</Text>
                <Switch value={showStats} onValueChange={toggleShowStats} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Allow pinch-to-zoom (x1.5)?
                </Text>
                <Switch
                  value={allowPinchToZoom}
                  onValueChange={toggleAllowPinchToZoom}
                />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Open links with system web browser?
                </Text>
                <Switch
                  value={!allowWebViewNavigation}
                  onValueChange={toggleAllowWebViewNavigation}
                />
              </View>
            </List.Section>
          </View>
        </View>
      </Surface>
    ),
    [
      sourceName,
      showStats,
      animated,
      hasTextAround,
      paddingHz,
      allowWebViewNavigation,
      allowPinchToZoom,
      toggleTextAbove,
      toggleAnimated,
      toggleShowStats,
      togglePadding,
      toggleAllowWebViewNavigation,
      toggleAllowPinchToZoom
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
      />
    );
  }, [isSheetOpen, scrollToStart, scrollToEnd, toggleSettings, forceRerender]);
  const bottomSheet = (
    <BottomSheet
      enabledInnerScrolling={true}
      enabledContentTapInteraction={false}
      enabledHeaderGestureInteraction={true}
      ref={sheetRef}
      snapPoints={[
        BOTTOM_SHEET_COLLAPSED_OFFSET,
        snapPointExpended,
        BOTTOM_SHEET_COLLAPSED_OFFSET
      ]}
      renderContent={renderControls}
      renderHeader={renderHeader}
      onOpenStart={setSheetOpenTrue}
      onCloseStart={setSheetOpenFalse}
    />
  );
  React.useEffect(() => {
    sheetRef.current?.snapTo(0);
  }, [windowDimensions.height]);
  return {
    bottomSheet,
    allowPinchToZoom,
    allowWebViewNavigation,
    paddingHz,
    hasTextAround,
    animated,
    instance,
    showStats,
    sourceName
  };
}

const styles = StyleSheet.create({
  pagePicker: {
    alignSelf: 'stretch',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20
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
    backgroundColor: BACKGROUND_DARK,
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
    maxWidth: 400
  }
});
