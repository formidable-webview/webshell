import { default as React, RefObject, useCallback, memo } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { APPBAR_HEIGHT } from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from './Provider';
import { useNavigation } from '@react-navigation/native';

interface Props {
  scrollViewRef: RefObject<ScrollView>;
}

const ControlsHeader = memo(
  ({
    forceRerender,
    scrollToStart,
    scrollToEnd,
    showConsole,
    showEvidence,
    goToOptions,
    toggleConsole,
    toggleEvidence
  }: any) => {
    const {
      colors: { accent }
    } = useTheme();
    const { left, right } = useSafeAreaInsets();
    return (
      <View style={{ height: APPBAR_HEIGHT }}>
        <Appbar
          style={[
            styles.bottomSheetHeader,
            {
              height: APPBAR_HEIGHT,
              paddingLeft: left,
              paddingRight: right
            }
          ]}>
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
          <Appbar.Action size={20} icon="settings" onPress={goToOptions} />
        </Appbar>
      </View>
    );
  }
);

export function AppControls({ scrollViewRef }: Props) {
  const navigation = useNavigation();
  const {
    showConsole,
    showEvidence,
    toggleConsole,
    toggleEvidence,
    forceRerender
  } = useStore();
  const goToOptions = useCallback(() => navigation.navigate('Options'), [
    navigation
  ]);
  const scrollToStart = React.useCallback(
    () => scrollViewRef.current?.scrollTo({ y: 0, animated: true }),
    [scrollViewRef]
  );
  const scrollToEnd = React.useCallback(
    () => scrollViewRef.current?.scrollToEnd({ animated: true }),
    [scrollViewRef]
  );
  return (
    <ControlsHeader
      forceRerender={forceRerender}
      scrollToEnd={scrollToEnd}
      scrollToStart={scrollToStart}
      goToOptions={goToOptions}
      showConsole={showConsole}
      showEvidence={showEvidence}
      toggleConsole={toggleConsole}
      toggleEvidence={toggleEvidence}
    />
  );
}

const styles = StyleSheet.create({
  safePlaceholder: {
    width: '100%',
    backgroundColor: '#1b2229'
  },
  bottomSheetHeader: {
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});
