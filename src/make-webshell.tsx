/* eslint-disable dot-notation */
import * as React from 'react';
import {
  Component,
  ComponentType,
  ElementRef,
  ComponentProps,
  ComponentPropsWithRef
} from 'react';
import { NativeSyntheticEvent } from 'react-native';
import featuresLoaderScript from './features-loader.webjs';
import {
  AssembledFeature,
  WebshellProps,
  WebshellInvariantProps,
  MinimalWebViewProps,
  AssembledEventFeature
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

function filterWebViewProps<W>(props: WebshellProps<any, any>): W {
  return Object.keys(props).reduce((obj, key) => {
    if (key.startsWith('onDOM')) {
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
    'eventHandlerName'
  );
}

type Fixup<T> = T extends never ? [] : T;

/**
 * Creates a React component which decorates WebView component with additionnal
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
  class Webshell extends Component<
    WebshellProps<ComponentProps<C>, F> & { webViewRef: ElementRef<C> }
  > {
    static defaultProps = {} as WebshellProps<ComponentProps<C>, F>;

    handleOnMessage = ({
      nativeEvent
    }: NativeSyntheticEvent<WebViewMessage>) => {
      const { onMessage, onDOMError } = this.props as WebshellInvariantProps &
        MinimalWebViewProps;
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
                  ? this.props[handlerName]
                  : null;
              typeof handler === 'function' && handler(body);
              return;
            }
            // TODO inform user unhandled messages
          } else if (type === 'error') {
            // Handle as an error message
            typeof onDOMError === 'function' && onDOMError(identifier, body);
            return;
          }
        }
      } else {
        typeof onMessage === 'function' && onMessage(nativeEvent);
      }
    };

    render() {
      const { webViewRef, injectedJavaScript, ...webViewProps } = this.props;
      const safeUserscript =
        typeof injectedJavaScript === 'string' ? injectedJavaScript : '';
      const resultingJavascript = `(function(){${safeUserscript};${injectableScript};})();true;`;
      return (
        <WebView
          {...filterWebViewProps(webViewProps)}
          ref={webViewRef}
          injectedJavaScript={resultingJavascript}
          javaScriptEnabled={true}
          onMessage={this.handleOnMessage}
        />
      );
    }
  }
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
