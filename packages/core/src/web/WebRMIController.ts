import { RefObject } from 'react';

function javaScript(snippets: TemplateStringsArray, ...args: any[]) {
  return snippets
    .reduce((buffer, currentSnippet, index) => {
      buffer.push(currentSnippet, JSON.stringify(args[index]) || '');
      return buffer;
    }, [] as string[])
    .join('');
}

export class WebRMIController {
  private webViewRef: RefObject<{
    injectJavaScript: (js: string) => void;
  }>;
  constructor(webViewRef: RefObject<any>) {
    this.webViewRef = webViewRef;
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
}
