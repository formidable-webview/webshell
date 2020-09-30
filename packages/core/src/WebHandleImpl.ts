import { RefObject } from 'react';
import { Feature } from './Feature';
import { FeatureRegistry } from './FeatureRegistry';
import {
  WebHandle,
  WebHandlerDefinition,
  ExtractWebHandlerSpecFromDef
} from './types';

function javaScript(snippets: TemplateStringsArray, ...args: any[]) {
  return snippets
    .reduce((buffer, currentSnippet, index) => {
      buffer.push(currentSnippet, JSON.stringify(args[index]) || '');
      return buffer;
    }, [] as string[])
    .join('');
}

export class WebHandleImpl implements WebHandle {
  private webViewRef: RefObject<{
    injectJavaScript: (js: string) => void;
  }>;
  private registry: FeatureRegistry<any>;
  constructor(webViewRef: RefObject<any>, registry: FeatureRegistry<any>) {
    this.webViewRef = webViewRef;
    this.registry = registry;
  }

  protected injectJavaScript(snippets: TemplateStringsArray, ...args: any[]) {
    if (this.webViewRef.current && !this.webViewRef.current.injectJavaScript) {
      console.warn(
        '[Webshell]: The WebView element you passed is missing injectJavaScript method.'
      );
      return;
    }
    this.webViewRef.current?.injectJavaScript(javaScript(snippets, ...args));
  }

  postMessageToWeb<
    D extends WebHandlerDefinition<any, any>,
    S extends ExtractWebHandlerSpecFromDef<D>
  >(
    feat: Feature<any, any, S>,
    handlerId: D['handlerId'],
    message: D['payload']
  ) {
    if (__DEV__ && !feat.hasWebHandler(handlerId)) {
      throw new Error(
        `Feature ${feat.featureIdentifier} has no Web handler with ID "${handlerId}".`
      );
    }
    if (__DEV__ && !this.registry.hasFeature(feat)) {
      throw new Error(
        `Feature ${feat.featureIdentifier} has not be instantiated in this shell.`
      );
    }
    this
      .injectJavaScript`window.ReactNativeWebshell.postMessageToWeb(${feat.featureIdentifier},${handlerId},${message});`;
  }

  setDebug(debug: boolean) {
    this.injectJavaScript`window.ReactNativeWebshell.debug=${debug};`;
  }
}
