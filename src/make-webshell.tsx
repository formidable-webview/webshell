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
import featuresLoaderScript from './features-loader.webjs';
import type {
  WebshellProps,
  WebshellInvariantProps,
  MinimalWebViewProps,
  PropsSpecs,
  PropDefinition
} from './types';

interface WebViewMessage {
  data: string;
}

interface PostMessage {
  identifier: string;
  handlerName: string;
  type: 'feature' | 'error' | 'log';
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
    typeof o['identifier'] === 'string' &&
    typeof o['handlerName'] === 'string' &&
    typeof o['type'] === 'string' &&
    o['__isWebshellPostMessage'] === true
  );
}

function serializeFeature(feature: Feature<any, any>) {
  return `{
    source:${feature.script},
    identifier:${JSON.stringify(feature.featureIdentifier)},
    options:${JSON.stringify(feature.options || {})}
  }`;
}

function serializeFeatureList(feats: Feature<any, any>[]) {
  return `[${feats.map(serializeFeature).join(',')}]`;
}

function extractFeatureProps(
  props: WebshellProps<any, any>,
  propsMap: Record<string, PropDefinition<any>>,
  type: 'handler' | 'inert' | null = null
): any {
  return Object.keys(props).reduce((obj, key) => {
    if (propsMap[key] && (type == null || propsMap[key].type === type)) {
      return {
        ...obj,
        [key]: props[key]
      };
    }
    return obj;
  }, {});
}

function filterWebViewProps<W>(
  props: WebshellProps<any, any>,
  propsMap: Record<string, PropDefinition<any>>
): W {
  return Object.keys(props).reduce((obj, key) => {
    if (propsMap[key] || key.startsWith('webshell')) {
      return obj;
    }
    return {
      ...obj,
      [key]: props[key]
    };
  }, {} as W);
}

function extractPropsSpecsMap(features: Feature<any, PropsSpecs<any>>[]) {
  return features
    .map((f: Feature<any, PropsSpecs<any>>) => f.propSpecs)
    .reduce((p, c) => [...p, ...c], [])
    .reduce(
      (map, spec: PropDefinition<any>) => ({ ...map, [spec.name]: spec }),
      {}
    ) as Record<string, PropDefinition<any>>;
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
  F extends Feature<any, any>[]
>(
  WebView: C,
  ...features: F
): React.ForwardRefExoticComponent<
  WebshellProps<React.ComponentPropsWithoutRef<C>, F> &
    React.RefAttributes<ElementRef<C>>
> {
  const propsMap = extractPropsSpecsMap(features);
  const serializedFeatureScripts = serializeFeatureList(features);
  const injectableScript = featuresLoaderScript
    .replace('$$___FEATURES___$$', serializedFeatureScripts)
    .replace('$$__DEBUG__$$', __DEV__ + '');
  const Webshell = (
    props: WebshellProps<ComponentProps<C>, F> & { webViewRef: ElementRef<C> }
  ) => {
    const {
      onMessage,
      onDOMError,
      webshellDebug,
      ...otherProps
    } = props as WebshellInvariantProps & MinimalWebViewProps;
    const domHandlers = extractFeatureProps(otherProps, propsMap, 'handler');
    const handleOnMessage = React.useCallback(
      ({ nativeEvent }: NativeSyntheticEvent<WebViewMessage>) => {
        const parsedJSON = parseJSONSafe(nativeEvent.data);
        if (isPostMessageObject(parsedJSON)) {
          const { type, identifier, body, handlerName, severity } = parsedJSON;
          if (type === 'feature') {
            const handler =
              typeof handlerName === 'string' ? domHandlers[handlerName] : null;
            if (propsMap[handlerName]) {
              if (typeof handler === 'function') {
                handler(body);
              } else {
                webshellDebug &&
                  console.info(
                    `[Webshell]: script from feature "${identifier}" sent an event, but there ` +
                      `is no handler prop named "${handlerName}" attached to the shell.`
                  );
              }
            } else {
              console.warn(
                `[Webshell]: script from feature "${identifier}" sent an event, but there is ` +
                  `no handler named "${handlerName}" defined for this feature. ` +
                  'Use FeatureBuilder.withEventHandlerProp to register that handler, or make ' +
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
    const { webViewRef, injectedJavaScript, ...webViewProps } = props;
    const resultingJavascript = React.useMemo(() => {
      const safeUserscript =
        typeof injectedJavaScript === 'string' ? injectedJavaScript : '';
      return `(function(){${safeUserscript};${injectableScript};})();true;`;
    }, [injectedJavaScript]);
    return (
      <WebView
        {...filterWebViewProps(webViewProps, propsMap)}
        ref={webViewRef}
        injectedJavaScript={resultingJavascript}
        javaScriptEnabled={true}
        onMessage={handleOnMessage}
      />
    );
  };
  Webshell.defaultProps = {
    webshellDebug: __DEV__
  };
  return React.forwardRef<
    ElementRef<C>,
    WebshellProps<ComponentPropsWithRef<C>, F>
  >((props, ref) => (
    <Webshell
      webViewRef={ref}
      {...(props as WebshellProps<ComponentPropsWithRef<any>, F>)}
    />
  )) as any;
}
