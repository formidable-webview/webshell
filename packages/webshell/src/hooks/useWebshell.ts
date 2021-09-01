/* eslint-disable dot-notation */
import * as React from 'react';
import type { ComponentType, ElementRef } from 'react';
import type { NativeSyntheticEvent } from 'react-native';
import Feature from '../Feature';
import {
  WebshellProps,
  WebshellInvariantProps,
  MinimalWebViewProps
} from '../types';
import FeatureRegistry from '../FeatureRegistry';
import { BufferedWebRMIHandle } from '../web/BufferedWebRMIHandle';
import { WebFeaturesLoader } from '../web/WebFeaturesLoader';
import Reporter from '../Reporter';

interface WebViewMessage {
  data: string;
}

interface PostMessage {
  identifier: string;
  eventId: string;
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
  const domHandlers = registry.getWebHandlers(otherProps);
  const handleOnWebMessage = React.useCallback(
    function handleOnWebMessage({
      nativeEvent
    }: NativeSyntheticEvent<WebViewMessage>) {
      const parsedJSON = parseJSONSafe(nativeEvent.data);
      if (isPostMessageObject(parsedJSON)) {
        const { type, identifier, body, eventId, severity } = parsedJSON;
        if (type === 'init') {
          setIsLoaderReady(true);
          return;
        }
        if (type === 'feature') {
          const propDef = registry.getPropDefFromId(identifier, eventId);
          if (!propDef) {
            reporter.dispatchError(
              'WEBSH_MISSING_SHELL_HANDLER',
              identifier,
              eventId
            );
            return;
          }
          const handlerName = propDef.name;
          const handler =
            typeof eventId === 'string' ? domHandlers[handlerName] : null;
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
        typeof onMessage === 'function' && onMessage({ nativeEvent });
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
 * Parameters for {@link useWebshell} hook.
 *
 * @public
 */
export interface UseWebshellParams<
  W extends MinimalWebViewProps,
  F extends Feature<{}, {}, {}>[]
> {
  /**
   * The list of feature instances to inject.
   */
  features: F;
  /**
   * The Webshell props, which extends WebView props with a few custom props.
   */
  props: WebshellProps<W, F>;
  /**
   * An optional reference object to the underlying WebView.
   */
  webViewRef?: ElementRef<any>;
}

const defaultProps = {
  webshellDebug: __DEV__,
  webshellStrictMode: false
};

/**
 * Inject features into a `WebView`, enabling capabilities such
 * as:
 *
 * - handling messages from the Web environment;
 * - sending messages to the Web environment, see {@link WebHandle};
 * - running script in the Web environment.
 *
 * @remarks
 * - You should **always** pass all props returned by this hook to the
 * `WebView` component, and **never** override any of those props.
 * - If you need to pass props to the `WebView`, use the `props` parameter field.
 * - If you need to pass a reference to the `WebView`, pass this reference to the
 * `webViewRef` parameter field.
 *
 * @param param - A param object comprised of features, (webshell) props and
 * optionally a webViewRef object.
 * @returns Props for the `WebView` component.
 *
 * @typeparam C - The type of the `WebView` component.
 * @typeparam F - The type for a collection of features to inject.
 *
 * @example
 *
 * ```ts
 * import {
 *   useWebshell,
 *   HandleHashChangeFeature,
 *   HandleVisualViewportFeature
 * } from '@formidable-webview/webshell';
 *
 * const features = [
 *   new HandleHashChangeFeature(),
 *   new HandleVisualViewportFeature()
 * ]
 *
 * const MyCustomWebView = (props) => {
 *   const webViewProps = useWebshell({ features, props });
 *   return <WebView {...webViewProps} />;
 * }
 *
 * ```
 *
 * @public
 */
export default function useWebshell<
  C extends ComponentType<any>,
  F extends Feature<{}, {}, {}>[]
>({
  features,
  props: webshellProps,
  webViewRef
}: UseWebshellParams<React.ComponentProps<C>, F>): React.ComponentProps<C> & {
  ref: ElementRef<C>;
} {
  const localWebViewRef = React.useRef<any>();
  const resolvedWebViewRef = (webViewRef as any) || localWebViewRef;
  const filteredFeatures = React.useMemo(() => features.filter((f) => !!f), [
    features
  ]);
  const loader = React.useMemo(() => new WebFeaturesLoader(filteredFeatures), [
    filteredFeatures
  ]);
  const {
    webHandleRef,
    injectedJavaScript: userInjectedJavaScript,
    webshellDebug = defaultProps.webshellDebug,
    webshellStrictMode = defaultProps.webshellStrictMode,
    ...props
  } = webshellProps;
  const reporter = React.useMemo(
    () => new Reporter(webshellDebug, webshellStrictMode),
    [webshellDebug, webshellStrictMode]
  );
  const registry = React.useMemo(
    () => new FeatureRegistry(filteredFeatures, reporter),
    [reporter, filteredFeatures]
  );
  const { handleOnWebMessage, isLoaderReady } = useWebMessageBus(
    registry,
    reporter,
    props
  );
  const injectedJavaScript = useJavaScript(
    loader,
    userInjectedJavaScript as string
  );
  const webHandle = useWebHandle(resolvedWebViewRef, registry, reporter);
  React.useImperativeHandle(webHandleRef, () => webHandle);
  React.useEffect(
    function syncDebug() {
      webHandle.setDebug(webshellDebug);
    },
    [webshellDebug, webHandle]
  );
  React.useEffect(
    function flushPendingMessages() {
      if (isLoaderReady) {
        webHandle.flushPendingMessages();
      }
    },
    [isLoaderReady, webHandle]
  );
  return ({
    ...registry.filterWebViewProps<React.ComponentProps<C>>(webshellProps),
    injectedJavaScript,
    javaScriptEnabled: true,
    onMessage: handleOnWebMessage,
    ref: resolvedWebViewRef
  } as unknown) as React.ComponentProps<C>;
}
