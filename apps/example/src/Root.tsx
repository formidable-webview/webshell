import React from 'react';
import {
  SafeAreaProvider,
  initialWindowMetrics
} from 'react-native-safe-area-context';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import App from './App';

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    accent: '#0f9ec5',
    primary: '#2f3745'
  }
};

export default function Root() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <App />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
