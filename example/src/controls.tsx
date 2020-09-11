import { default as React, RefObject, useCallback, memo, useMemo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useWindowDimensions } from 'react-native';
import {
  Switch,
  Text,
  Surface,
  List,
  Appbar,
  useTheme
} from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import BottomSheet from 'reanimated-bottom-sheet';
import Constants from 'expo-constants';
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

export type ForceMethodOption = 'auto' | HTMLDimensionsImplementation;

export function useControls({ scrollViewRef }: Props) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const theme = useTheme();
  const [paddingHz, setPaddingHz] = React.useState(0);
  const [showEvidence, setShowEvidence] = React.useState(false);
  const [showConsole, setShowConsole] = React.useState(false);
  const [animated, setAnimated] = React.useState(false);
  const [instance, setInstance] = React.useState(0);
  const [sourceName, setSourceName] = React.useState<string>('welcome');
  const [resizeMethod, setResizeMethod] = React.useState<ForceMethodOption>(
    'auto'
  );
  const [allowPinchToZoom, setAllowPinchToZoom] = React.useState(false);
  const windowDimensions = useWindowDimensions();
  const [allowWebViewNavigation, setAllowWebViewNavigation] = React.useState(
    false
  );
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const togglePadding = React.useCallback(() => {
    setPaddingHz((p) => (p ? 0 : 20));
  }, []);
  const toggleEvidence = React.useCallback(() => {
    animateNextFrame();
    setShowEvidence((b) => !b);
  }, []);
  const toggleAnimated = React.useCallback(() => setAnimated((a) => !a), []);
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
  const toggleConsole = React.useCallback(() => {
    animateNextFrame();
    setShowConsole((s) => !s);
  }, []);
  const snapPointExpended = Math.min(
    BOTTOM_SHEET_CONTENT_HEIGHT + BOTTOM_SHEET_COLLAPSED_OFFSET,
    windowDimensions.height - Constants.statusBarHeight
  );
  const pickerStyle = useMemo(
    () => [styles.pagePicker, { color: theme.colors.accent }],
    [theme.colors.accent]
  );
  const makeRenderControls = React.useCallback(
    () => () => (
      <Surface style={{ height: BOTTOM_SHEET_CONTENT_HEIGHT }}>
        <View style={styles.bottomSheet}>
          <View style={styles.controlsContainer}>
            <List.Section title="Page">
              <View>
                <Picker
                  style={pickerStyle}
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
                  <Picker.Item
                    label="A non-responsive website"
                    value="nonresponsive"
                  />
                  <Picker.Item label="NSFW" value="nsfw" />
                </Picker>
              </View>
            </List.Section>
            <List.Section title="Resize implementation">
              <View>
                <Picker
                  style={pickerStyle}
                  selectedValue={resizeMethod}
                  onValueChange={setResizeMethod as any}>
                  <Picker.Item label="Automatic" value="auto" />
                  <Picker.Item label="ResizeObserver" value="resize" />
                  <Picker.Item label="MutationObserver" value="mutation" />
                  <Picker.Item label="Polling" value="polling" />
                </Picker>
              </View>
            </List.Section>
            <List.Section title="Customize">
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>Show evidence?</Text>
                <Switch value={showEvidence} onValueChange={toggleEvidence} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Add horizontal space around WebView?
                </Text>
                <Switch value={!!paddingHz} onValueChange={togglePadding} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>Use height animations?</Text>
                <Switch value={animated} onValueChange={toggleAnimated} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Enable pinch-to-zoom (x1.5)?
                </Text>
                <Switch
                  value={allowPinchToZoom}
                  onValueChange={toggleAllowPinchToZoom}
                />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>
                  Open links in system browser?
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
      animated,
      showEvidence,
      paddingHz,
      allowWebViewNavigation,
      allowPinchToZoom,
      resizeMethod,
      toggleEvidence,
      toggleAnimated,
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
      snapPoints={[
        BOTTOM_SHEET_COLLAPSED_OFFSET,
        snapPointExpended,
        BOTTOM_SHEET_COLLAPSED_OFFSET
      ]}
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
    animated,
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
    maxWidth: 400
  }
});
