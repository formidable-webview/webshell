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
import { WebHandleImpl } from './WebHandleImpl';

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

function useWeb(
  registry: FeatureRegistry<any>,
  {
    webshellDebug,
    onDOMError,
    onMessage,
    ...otherProps
  }: WebshellProps<any, any>
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
                'Use FeatureBuilder.withHandlerProp to register that handler, or make ' +
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
                'Use FeatureBuilder.withHandlerProp to register that handler, or make ' +
                'sure its name is not misspell in the DOM script.'
            );
          }
        } else if (type === 'error') {
          // Handle as an error message
          typeof onDOMError === 'function' && onDOMError(identifier, body);
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
    [...Object.values(domHandlers), onDOMError, onMessage]
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
    (): WebHandleImpl => new WebHandleImpl(webViewRef, registry),
    [webViewRef, registry]
  );
}

function useJavaScript(
  registry: FeatureRegistry<any>,
  injectedJavaScript: string
) {
  return React.useMemo(() => {
    const safeUserscript =
      typeof injectedJavaScript === 'string' ? injectedJavaScript : '';
    return `(function(){\n${safeUserscript}\n${registry.assembledFeaturesScript};\n})();true;`;
  }, [injectedJavaScript, registry]);
}

/**
 * Creates a React component which decorates WebView component with additional
 * props to handle events from the DOM.
 *
 * @param WebView - A WebView component, typically exported from `react-native-webview`.
 * @param features - Features ready to be loaded in the WebView.
 *
 * @public
 */
export function makeWebshell<
  C extends ComponentType<any>,
  F extends Feature<any, any, any>[]
>(WebView: C, ...features: F): WebshellComponent<C, F> {
  const registry = new FeatureRegistry(features);
  const Webshell = (
    props: WebshellProps<ComponentProps<C>, F> & { webViewRef: ElementRef<C> }
  ) => {
    const {
      webHandle: webHandleRef,
      ...otherProps
    } = props as WebshellInvariantProps & MinimalWebViewProps;
    const {
      webViewRef,
      injectedJavaScript,
      webshellDebug,
      ...webViewProps
    } = props;
    const { handleOnWebMessage, isLoaded } = useWeb(registry, otherProps);
    const resultingJavascript = useJavaScript(registry, injectedJavaScript);
    const webHandle = useWebHandle(webViewRef, registry);
    React.useImperativeHandle(webHandleRef, () => webHandle);
    React.useEffect(() => {
      isLoaded && webHandle.setDebug(webshellDebug);
    }, [webshellDebug, webHandle, isLoaded]);
    return (
      <WebView
        {...registry.filterWebViewProps(webViewProps)}
        ref={webViewRef}
        injectedJavaScript={resultingJavascript}
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
