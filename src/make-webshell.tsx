/* eslint-disable dot-notation */
import * as React from 'react';
import {
  ComponentType,
  ElementRef,
  ComponentProps,
  ComponentPropsWithRef
} from 'react';
import { NativeSyntheticEvent, Animated } from 'react-native';
import featuresLoaderScript from './features-loader.webjs';
import {
  AssembledFeature,
  WebshellProps,
  WebshellInvariantProps,
  MinimalWebViewProps,
  AssembledEventFeature,
  EventHandlerDefinition
} from './types.js';

interface WebViewMessage {
  data: string;
}

interface PostMessage {
  identifier: string;
  type: 'feature' | 'error';
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
    typeof o['type'] === 'string' &&
    o['__isWebshellPostMessage'] === true
  );
}

function serializeFeature(feature: AssembledFeature) {
  return `{
    source:${feature.script},
    identifier:${JSON.stringify(feature.featureIdentifier)},
    options:${JSON.stringify(feature.options || {})}
  }`;
}

function serializeFeatureList(specs: AssembledFeature[]) {
  return `[${specs.map(serializeFeature).join(',')}]`;
}

function extractDOMHandlers(props: WebshellProps<any, any>): any {
  return Object.keys(props).reduce((obj, key) => {
    if (key.startsWith('onDOM')) {
      return {
        ...obj,
        [key]: props[key]
      };
    }
    return obj;
  }, {});
}

function filterWebViewProps<W>(props: WebshellProps<any, any>): W {
  return Object.keys(props).reduce((obj, key) => {
    if (key.startsWith('onDOM') || key.startsWith('webshell')) {
      return obj;
    }
    return {
      ...obj,
      [key]: props[key]
    };
  }, {} as W);
}

function isEventFeature(
  assembledFeature: AssembledFeature
): assembledFeature is AssembledEventFeature {
  return Object.prototype.hasOwnProperty.call(
    assembledFeature,
    'eventHandlerName' as keyof EventHandlerDefinition<any, any>
  );
}

function isInvalidFeature<F extends AssembledFeature>(feat: F): boolean {
  return isEventFeature(feat) && !feat.eventHandlerName.startsWith('onDOM');
}

/**
 * Creates a React component which decorates WebView component with additional
 * props to handle events from the DOM.
 *
 * @param WebView - A WebView component, typically exported from `react-native-webview`.
 * @param assembledFeatures - Assembled features ready to be loaded in the WebView DOM.
 *
 * @public
 */
export function makeWebshell<
  C extends ComponentType<any>,
  F extends AssembledFeature[]
>(
  WebView: C,
  ...assembledFeatures: F
): React.ForwardRefExoticComponent<
  WebshellProps<React.ComponentPropsWithoutRef<C>, F> &
    React.RefAttributes<ElementRef<C>>
> {
  const serializedFeatures = serializeFeatureList(assembledFeatures);
  const injectableScript = featuresLoaderScript.replace(
    '$$___FEATURES___$$',
    serializedFeatures
  );
  if (__DEV__) {
    const failingFeature = assembledFeatures.find(isInvalidFeature) as
      | AssembledEventFeature<any, any>
      | undefined;
    if (failingFeature) {
      throw new TypeError(
        `[makeWebshell]: Feature "${failingFeature.featureIdentifier}" event handler name, "${failingFeature.eventHandlerName}" doesn't comply with handler name requirement: name must start with "onDOM".`
      );
    }
  }
  const Webshell = (
    props: WebshellProps<ComponentProps<C>, F> & { webViewRef: ElementRef<C> }
  ) => {
    const {
      onMessage,
      onDOMError,
      webshellDebug,
      webshellAnimatedHeight,
      ...otherProps
    } = props as WebshellInvariantProps & MinimalWebViewProps;
    const domHandlers = extractDOMHandlers(otherProps);
    const handleOnMessage = React.useCallback(
      ({ nativeEvent }: NativeSyntheticEvent<WebViewMessage>) => {
        const parsedJSON = parseJSONSafe(nativeEvent.data);
        if (isPostMessageObject(parsedJSON)) {
          const { type, identifier, body } = parsedJSON;
          if (typeof type === 'string' && typeof identifier === 'string') {
            if (type === 'feature') {
              // Handle as a feature message
              const source = assembledFeatures.find(
                (s) => s.featureIdentifier === identifier
              );
              if (source && isEventFeature(source)) {
                const handlerName = source.eventHandlerName;
                const handler =
                  typeof handlerName === 'string'
                    ? domHandlers[handlerName]
                    : null;
                if (typeof handler === 'function') {
                  handler(body);
                } else {
                  webshellDebug &&
                    console.info(
                      `[Webshell]: script from feature "${identifier}" sent an event, but there is no handler prop attached to it (${handlerName}).`
                    );
                }
                return;
              }
            } else if (type === 'error') {
              // Handle as an error message
              typeof onDOMError === 'function' && onDOMError(identifier, body);
              webshellDebug &&
                console.warn(
                  `[Webshell]: script from feature "${identifier}" raised an error: ${body}`
                );
              return;
            }
          }
        } else {
          typeof onMessage === 'function' && onMessage(nativeEvent);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...Object.values(domHandlers), onDOMError, onMessage]
    );
    const { webViewRef, injectedJavaScript, style, ...webViewProps } = props;
    const resultingJavascript = React.useMemo(() => {
      const safeUserscript =
        typeof injectedJavaScript === 'string' ? injectedJavaScript : '';
      return `(function(){${safeUserscript};${injectableScript};})();true;`;
    }, [injectedJavaScript]);
    const renderInContainer = React.useCallback(
      (children: any) => {
        const animatedStyle = {
          height: webshellAnimatedHeight || undefined,
          flexGrow: 1,
          alignSelf: 'stretch' as 'stretch'
        };
        return webshellAnimatedHeight ? (
          <Animated.View style={animatedStyle} children={children} />
        ) : (
          children
        );
      },
      [webshellAnimatedHeight]
    );
    return renderInContainer(
      <WebView
        {...filterWebViewProps(webViewProps)}
        style={style}
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
