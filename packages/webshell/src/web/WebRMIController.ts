import { RefObject } from 'react';
import Reporter from '../Reporter';

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
  protected reporter: Reporter;
  constructor(webViewRef: RefObject<any>, reporter: Reporter) {
    this.webViewRef = webViewRef;
    this.reporter = reporter;
  }

  protected injectJavaScript(snippets: TemplateStringsArray, ...args: any[]) {
    if (this.webViewRef.current && !this.webViewRef.current.injectJavaScript) {
      this.reporter.dispatchError('WEBSH_WEBVIEW_MISSING_MEMBER');
      return;
    }
    this.webViewRef.current?.injectJavaScript(javaScript(snippets, ...args));
  }
}
