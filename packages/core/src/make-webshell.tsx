/* eslint-disable dot-notation */
import * as React from 'react';
import type {
  ComponentType,
  ElementRef,
  ComponentProps,
  ComponentPropsWithRef
} from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import { Feature } from './Feature';
import type {
  WebshellProps,
  WebshellInvariantProps,
  MinimalWebViewProps,
  WebshellComponent
} from './types';
import { FeatureRegistry } from './FeatureRegistry';
import { BufferedWebRMIHandle } from './web/BufferedWebRMIHandle';
import { WebFeaturesLoader } from './web/WebFeaturesLoader';
import { Reporter } from './Reporter';

interface WebViewMessage {
  data: string;
}

interface PostMessage {
  identifier: string;
  handlerId: string;
  type: 'feature' | 'error' | 'log' | 'init';
  severity: 'warn' | 'info';
  body: any;
}

function parseJSONSafe(text: string) {
  try {
    return (JSON.parse(text) as unknown) ?? null;
  } catch (e) {
    return null;
  }
}

function isPostMessageObject(o: unknown): o is PostMessage {
  return (
    typeof o === 'object' &&
    o !== null &&
    typeof o['type'] === 'string' &&
    o['__isWebshellPostMessage'] === true
  );
}

function useWebMessageBus(
  registry: FeatureRegistry<any>,
  reporter: Reporter,
  {
    webshellDebug,
    onWebFeatureError,
    onMessage,
    ...otherProps
  }: WebshellInvariantProps & MinimalWebViewProps
) {
  const [isLoaderReady, setIsLoaderReady] = React.useState(false);
  const domHandlers = React.useMemo(() => registry.getWebHandlers(otherProps), [
    otherProps,
    registry
  ]);

  const handleOnWebMessage = React.useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<WebViewMessage>) => {
      const parsedJSON = parseJSONSafe(nativeEvent.data);
      if (isPostMessageObject(parsedJSON)) {
        const { type, identifier, body, handlerId, severity } = parsedJSON;
        if (type === 'init') {
          setIsLoaderReady(true);
          return;
        }
        if (type === 'feature') {
          const propDef = registry.getPropDefFromId(identifier, handlerId);
          if (!propDef) {
            reporter.dispatchError(
              'WEBSH_MISSING_SHELL_HANDLER',
              identifier,
              handlerId
            );
            return;
          }
          const handlerName = propDef.name;
          const handler =
            typeof handlerId === 'string' ? domHandlers[handlerName] : null;
          if (typeof handler === 'function') {
            handler(body);
          }
        } else if (type === 'error') {
          // Handle as an error message
          typeof onWebFeatureError === 'function' &&
            onWebFeatureError(identifier, body);
          reporter.dispatchError('WEBSH_SCRIPT_ERROR', identifier, body);
        } else if (type === 'log') {
          reporter.dispatchWebLog(severity, identifier, body);
        }
      } else {
        typeof onMessage === 'function' && onMessage(nativeEvent);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(domHandlers), onWebFeatureError, onMessage]
  );
  return {
    handleOnWebMessage,
    isLoaderReady
  };
}

function useWebHandle(
  webViewRef: React.RefObject<any>,
  registry: FeatureRegistry<any>,
  reporter: Reporter
) {
  return React.useMemo(
    (): BufferedWebRMIHandle =>
      new BufferedWebRMIHandle(webViewRef, registry, reporter),
    [webViewRef, registry, reporter]
  );
}

function useJavaScript(
  loader: WebFeaturesLoader<any>,
  injectedJavaScript: string
) {
  return React.useMemo(() => {
    const safeUserscript =
      typeof injectedJavaScript === 'string' ? injectedJavaScript : '';
    return `(function(){\n${safeUserscript}\n${loader.assembledFeaturesScript};\n})();true;`;
  }, [injectedJavaScript, loader]);
}

/**
 * Creates a React component which decorates `WebView` component with additional
 * capabilities such as:
 *
 * - handling messages from the Web environment;
 * - sending messages to the Web environment, see {@link WebHandle};
 * - running script in the Web environment.
 *
 * @param WebView - A `WebView` component, typically exported from `react-native-webview`.
 * @param features - Features to inject in the `WebView`.
 *
 * @typeparam C - The type of the `WebView` component.
 * @typeparam F - The type for a collection of features to inject.
 *
 * @example
 *
 * ```ts
 * import {
 *   makeWebshell,
 *   HandleHashChangeFeature,
 *   HandleVisualViewportFeature
 * } from '@formidable-webview/webshell';
 *
 * const Webshell = makeWebshell(
 *   WebView,
 *   new HandleHashChangeFeature(),
 *   new HandleVisualViewportFeature()
 * );
 * ```
 *
 * @public
 */
export function makeWebshell<
  C extends ComponentType<any>,
  F extends Feature<any, any, any>[]
>(WebView: C, ...features: F): WebshellComponent<C, F> {
  const filteredFeatures = features.filter((f) => !!f);
  const loader = new WebFeaturesLoader(filteredFeatures);
  const Webshell = (
    props: WebshellProps<ComponentProps<C>, F> & { webViewRef: ElementRef<C> }
  ) => {
    const {
      webHandle: webHandleRef,
      ...otherProps
    } = props as WebshellInvariantProps & MinimalWebViewProps;
    const {
      webViewRef,
      injectedJavaScript: userInjectedJavaScript,
      webshellDebug,
      webshellStrictMode,
      ...webViewProps
    } = props;
    const reporter = React.useMemo(
      () => new Reporter(webshellDebug, webshellStrictMode),
      [webshellDebug, webshellStrictMode]
    );
    const registry = React.useMemo(
      () => new FeatureRegistry(filteredFeatures, reporter),
      [reporter]
    );
    const { handleOnWebMessage, isLoaderReady } = useWebMessageBus(
      registry,
      reporter,
      otherProps
    );
    const injectedJavaScript = useJavaScript(loader, userInjectedJavaScript);
    const webHandle = useWebHandle(webViewRef, registry, reporter);

    React.useImperativeHandle(webHandleRef, () => webHandle);
    React.useEffect(() => {
      webHandle.setDebug(webshellDebug);
    }, [webshellDebug, webHandle]);
    React.useEffect(() => {
      if (isLoaderReady) {
        webHandle.flushPendingMessages();
      }
    }, [isLoaderReady, webHandle]);
    return (
      <WebView
        {...registry.filterWebViewProps(webViewProps)}
        ref={webViewRef}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled={true}
        onMessage={handleOnWebMessage}
      />
    );
  };
  Webshell.defaultProps = {
    webshellDebug: __DEV__,
    webshellStrict: false
  };
  return React.forwardRef<
    ElementRef<C>,
    WebshellProps<ComponentPropsWithRef<C>, F>
  >((props, ref) => {
    const localWebViewRef = React.useRef();
    return (
      <Webshell
        webViewRef={ref || localWebViewRef}
        {...(props as WebshellProps<ComponentPropsWithRef<any>, F>)}
      />
    );
  }) as any;
}
