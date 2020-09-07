import { default as React, RefObject, useCallback } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Switch, Text, Surface, List, Appbar } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import BottomSheet from 'reanimated-bottom-sheet';
import {
  BOTTOM_SHEET_COLLAPSED_OFFSET,
  BOTTOM_SHEET_CONTENT_HEIGHT,
  APPBAR_HEIGHT
} from './styles';

interface Props {
  scrollViewRef: RefObject<ScrollView>;
}

export function useControls({ scrollViewRef }: Props) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const [paddingHz, setPaddingHz] = React.useState(0);
  const [hasTextAbove, setHasTextAbove] = React.useState(false);
  const [animated, setAnimated] = React.useState(false);
  const [instance, setInstance] = React.useState(0);
  const [showStats, setShowStats] = React.useState(false);
  const [sourceName, setSourceName] = React.useState<string>('welcome');
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const togglePadding = () => setPaddingHz(paddingHz ? 0 : 20);
  const toggleTextAbove = () => setHasTextAbove(!hasTextAbove);
  const toggleAnimated = () => setAnimated(!animated);
  const toggleShowStats = () => setShowStats(!showStats);
  const setSheetOpenTrue = React.useCallback(() => setIsSheetOpen(true), []);
  const setSheetOpenFalse = React.useCallback(() => setIsSheetOpen(false), []);
  const renderControls = () => {
    return (
      <Surface>
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
                <Text style={styles.controlText}>Add Text above WebView?</Text>
                <Switch value={hasTextAbove} onValueChange={toggleTextAbove} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>Use height animations?</Text>
                <Switch value={animated} onValueChange={toggleAnimated} />
              </View>
              <View style={styles.controlContainer}>
                <Text style={styles.controlText}>Show console?</Text>
                <Switch value={showStats} onValueChange={toggleShowStats} />
              </View>
            </List.Section>
          </View>
        </View>
      </Surface>
    );
  };
  const renderHeader = useCallback(() => {
    const rerenderWebshell = () => setInstance((i) => i + 1);
    const scrollToStart = () =>
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    const scrollToEnd = () =>
      scrollViewRef.current?.scrollToEnd({ animated: true });
    const toggleSettings = () => sheetRef.current?.snapTo(isSheetOpen ? 0 : 1);
    return (
      <Appbar style={styles.appbar}>
        <Appbar.Action size={20} icon="refresh" onPress={rerenderWebshell} />
        <Appbar.Action
          size={20}
          icon="arrow-expand-up"
          onPress={scrollToStart}
        />
        <Appbar.Action
          size={20}
          icon="arrow-expand-down"
          onPress={scrollToEnd}
        />
        <Appbar.Action size={20} icon="settings" onPress={toggleSettings} />
      </Appbar>
    );
  }, [scrollViewRef, isSheetOpen]);
  const bottomSheet = (
    <BottomSheet
      enabledInnerScrolling={false}
      enabledContentTapInteraction={false}
      enabledHeaderGestureInteraction={true}
      ref={sheetRef}
      snapPoints={[
        BOTTOM_SHEET_COLLAPSED_OFFSET,
        BOTTOM_SHEET_CONTENT_HEIGHT,
        BOTTOM_SHEET_COLLAPSED_OFFSET
      ]}
      renderContent={renderControls}
      renderHeader={renderHeader}
      onOpenStart={setSheetOpenTrue}
      onCloseStart={setSheetOpenFalse}
    />
  );
  return {
    bottomSheet,
    paddingHz,
    hasTextAbove,
    animated,
    instance,
    showStats,
    sourceName
  };
}

const styles = StyleSheet.create({
  appbar: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: APPBAR_HEIGHT,
    backgroundColor: '#1d2d47'
  },
  pagePicker: {
    alignSelf: 'stretch',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20
  },
  bottomSheet: {
    height: BOTTOM_SHEET_CONTENT_HEIGHT,
    alignItems: 'center',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: 'gray'
  },
  bottomSheetHeader: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderColor: 'gray',
    padding: 3,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    height: BOTTOM_SHEET_COLLAPSED_OFFSET,
    backgroundColor: '#120e56',
    flexDirection: 'row'
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
