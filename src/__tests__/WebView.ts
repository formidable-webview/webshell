/* eslint-disable dot-notation */
import * as React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { MinimalWebViewProps } from '../types';
import { runScriptInDOM } from './core-utils';

export default function WebView({
  injectedJavaScript,
  javaScriptEnabled,
  onMessage,
  onError,
  source,
  ...otherProps
}: MinimalWebViewProps) {
  useEffect(() => {
    const html =
      source && typeof source === 'object' && typeof source['html'] === 'string'
        ? source['html']
        : '';
    try {
      runScriptInDOM(html, injectedJavaScript as string, onMessage);
    } catch (e) {
      typeof onError === 'function' &&
        onError(
          typeof e === 'string'
            ? e
            : typeof e === 'object' && typeof e.message === 'string'
            ? e.message
            : 'Unknown error'
        );
    }
  }, [injectedJavaScript, onMessage, onError, source]);

  return React.createElement(View, otherProps);
}
