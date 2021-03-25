import { HTMLDimensionsImplementation } from '@formidable-webview/webshell';
import {
  default as React,
  createContext,
  useCallback,
  useState,
  useContext
} from 'react';
import { animateNextFrame } from './styles';

export type ForceMethodOption = 'auto' | HTMLDimensionsImplementation;

interface AppState {
  paddingHz: number;
  togglePadding: () => void;
  showEvidence: boolean;
  toggleEvidence: () => void;
  showConsole: boolean;
  toggleConsole: () => void;
  forceResponsiveLayout: boolean;
  toggleForceResponsiveLayout: () => void;
  instance: number;
  forceRerender: () => void;
  sourceName: string;
  setSourceName: (sourceName: string) => void;
  resizeMethod: ForceMethodOption;
  setResizeMethod: (resizeMethod: ForceMethodOption) => void;
  allowPinchToZoom: boolean;
  toggleAllowPinchToZoom: () => void;
  allowWebViewNavigation: boolean;
  toggleAllowWebViewNavigation: () => void;
  resetHeightOnViewportWidthChange: boolean;
  toggleResetHeightOnViewportWidthChange: () => void;
}

function noop() {}

const defaultState: AppState = {
  paddingHz: 0,
  showEvidence: false,
  showConsole: true,
  forceResponsiveLayout: true,
  instance: 0,
  sourceName: 'welcome',
  resizeMethod: 'auto',
  allowPinchToZoom: false,
  allowWebViewNavigation: false,
  resetHeightOnViewportWidthChange: true,
  forceRerender: noop,
  setResizeMethod: noop,
  setSourceName: noop,
  toggleAllowPinchToZoom: noop,
  toggleAllowWebViewNavigation: noop,
  toggleConsole: noop,
  toggleEvidence: noop,
  toggleForceResponsiveLayout: noop,
  togglePadding: noop,
  toggleResetHeightOnViewportWidthChange: noop
};

const AppStoreContext = createContext<AppState>(defaultState);

export default function AppStoreProvider({ children }: any) {
  const [paddingHz, setPaddingHz] = React.useState(defaultState.paddingHz);
  const [showEvidence, setShowEvidence] = React.useState(
    defaultState.showEvidence
  );
  const [showConsole, setShowConsole] = React.useState(
    defaultState.showConsole
  );
  const [forceResponsiveLayout, setForceResponsiveLayout] = React.useState(
    defaultState.forceResponsiveLayout
  );
  const [instance, setInstance] = React.useState(defaultState.instance);
  const [sourceName, setSourceName] = React.useState<string>(
    defaultState.sourceName
  );
  const [resizeMethod, setResizeMethod] = React.useState(
    defaultState.resizeMethod
  );
  const [allowPinchToZoom, setAllowPinchToZoom] = useState(
    defaultState.allowPinchToZoom
  );
  const [allowWebViewNavigation, setAllowWebViewNavigation] = useState(
    defaultState.allowWebViewNavigation
  );
  const [
    resetHeightOnViewportWidthChange,
    setResetHeightOnViewportWidthChange
  ] = useState(defaultState.resetHeightOnViewportWidthChange);
  const togglePadding = useCallback(() => {
    setPaddingHz((p) => (p ? 0 : 20));
  }, []);
  const toggleEvidence = useCallback(() => {
    animateNextFrame();
    setShowEvidence((b) => !b);
  }, []);
  const toggleAllowPinchToZoom = useCallback(() => {
    setAllowPinchToZoom((p) => !p);
  }, []);
  const toggleAllowWebViewNavigation = useCallback(() => {
    setAllowWebViewNavigation((s) => !s);
  }, []);
  const forceRerender = useCallback(() => {
    setInstance((i) => i + 1);
  }, []);
  const toggleConsole = useCallback(() => {
    animateNextFrame();
    setShowConsole((s) => !s);
  }, []);
  const toggleForceResponsiveLayout = useCallback(() => {
    setForceResponsiveLayout((v) => !v);
  }, []);
  const toggleResetHeightOnViewportWidthChange = useCallback(() => {
    setResetHeightOnViewportWidthChange((v) => !v);
  }, []);
  const state: AppState = {
    paddingHz,
    togglePadding,
    showEvidence,
    toggleEvidence,
    showConsole,
    toggleConsole,
    forceResponsiveLayout,
    toggleForceResponsiveLayout,
    instance,
    forceRerender,
    sourceName,
    setSourceName,
    resizeMethod,
    setResizeMethod,
    allowPinchToZoom,
    toggleAllowPinchToZoom,
    allowWebViewNavigation,
    toggleAllowWebViewNavigation,
    resetHeightOnViewportWidthChange,
    toggleResetHeightOnViewportWidthChange
  };
  return <AppStoreContext.Provider value={state} children={children} />;
}

export function useStore() {
  return useContext(AppStoreContext);
}
