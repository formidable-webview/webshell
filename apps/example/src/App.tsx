import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from './HomeScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, View } from 'react-native';
import { STAT_HEIGHT, BACKGROUND } from './styles';
import { StatusBar } from 'expo-status-bar';
import AppStoreProvider from './Provider';
import { OptionsScreen } from './OptionsScreen';

const Stack = createStackNavigator();

export default function App() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <AppStoreProvider>
        <StatusBar translucent={true} style="light" />
        <View
          style={[
            styles.statusBarPlaceholder,
            {
              paddingTop: insets.top,
              paddingBottom: insets.bottom
            }
          ]}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                options={{
                  headerShown: false,
                  safeAreaInsets: StyleSheet.absoluteFillObject
                }}
                name="Home"
                component={HomeScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: true,
                  safeAreaInsets: { top: 0, bottom: 0 }
                }}
                name="Options"
                component={OptionsScreen}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </AppStoreProvider>
    </>
  );
}
const styles = StyleSheet.create({
  safeContainer: {},
  statusBarPlaceholder: {
    flex: 1,
    backgroundColor: BACKGROUND,
    width: '100%'
  },
  autoheight: {
    backgroundColor: 'transparent'
  },
  statsPlaceholder: {
    height: STAT_HEIGHT,
    alignSelf: 'stretch'
  },
  container: {
    padding: 0,
    margin: 0,
    alignItems: 'center',
    flexShrink: 0
  },
  root: {
    flexGrow: 1
  }
});
