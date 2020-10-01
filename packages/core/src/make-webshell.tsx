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
  {
    webshellDebug,
    onWebFeatureError,
    onMessage,
    ...otherProps
  }: WebshellInvariantProps & MinimalWebViewProps
) {
  const [isLoaded, setIsLoaded] = React.useState(false);
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
          setIsLoaded(true);
          return;
        }
        if (type === 'feature') {
          const propDef = registry.getPropDefFromId(identifier, handlerId);
          if (!propDef) {
            console.warn(
              `[Webshell]: script from feature "${identifier}" sent an event towards ${handlerId} handler, but there is ` +
                'no handler registered for this feature. ' +
                'Use FeatureBuilder.withShellHandler to register that handler, or make ' +
                'sure its name is not misspell in the DOM script.'
            );
            return;
          }
          const handlerName = propDef.name;
          const handler =
            typeof handlerId === 'string' ? domHandlers[handlerName] : null;
          if (registry.getPropDefFromHandlerName(handlerName)) {
            if (typeof handler === 'function') {
              handler(body);
            } else {
              webshellDebug &&
                console.info(
                  `[Webshell]: script from feature "${identifier}" sent an event towards ${handlerId} handler, but there ` +
                    `is no handler prop named "${handlerName}" attached to the shell.`
                );
            }
          } else {
            console.warn(
              `[Webshell]: script from feature "${identifier}" sent an event towards ${handlerId} handler, but there is ` +
                `no handler named "${handlerName}" defined with this handler ID. ` +
                'Use FeatureBuilder.withShellHandler to register that handler, or make ' +
                'sure its name is not misspell in the DOM script.'
            );
          }
        } else if (type === 'error') {
          // Handle as an error message
          typeof onWebFeatureError === 'function' &&
            onWebFeatureError(identifier, body);
          webshellDebug &&
            console.warn(
              `[Webshell]: script from feature "${identifier}" raised an error: ${body}`
            );
          return;
        } else if (type === 'log') {
          webshellDebug && severity === 'warn' && console.warn(body);
          webshellDebug && severity === 'info' && console.info(body);
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
    isLoaded
  };
}

function useWebHandle(
  webViewRef: React.RefObject<any>,
  registry: FeatureRegistry<any>
) {
  return React.useMemo(
    (): BufferedWebRMIHandle => new BufferedWebRMIHandle(webViewRef, registry),
    [webViewRef, registry]
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
  const registry = new FeatureRegistry(filteredFeatures);
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
      ...webViewProps
    } = props;
    const { handleOnWebMessage, isLoaded } = useWebMessageBus(
      registry,
      otherProps
    );
    const injectedJavaScript = useJavaScript(loader, userInjectedJavaScript);
    const webHandle = useWebHandle(webViewRef, registry);

    React.useImperativeHandle(webHandleRef, () => webHandle);
    React.useEffect(() => {
      webHandle.setDebug(webshellDebug);
    }, [webshellDebug, webHandle]);
    React.useEffect(() => {
      if (isLoaded) {
        webHandle.load();
      }
    }, [isLoaded, webHandle]);
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
    webshellDebug: __DEV__
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
