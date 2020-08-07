import espree from 'espree';
import { JSDOM } from 'jsdom';

export function validateJavascript(script: string) {
  espree.parse(script, { ecmascriptVersion: 5 });
}

export function runScriptInDOM(
  html: string,
  script: unknown,
  onMessage?: unknown
) {
  const dom = new JSDOM(html, {
    runScripts: 'dangerously'
  });
  dom.window.ReactNativeWebView = {
    postMessage: (message: any) => {
      typeof onMessage === 'function' &&
        onMessage({ nativeEvent: { data: message } });
    }
  };
  if (typeof script === 'string') {
    dom.window.eval(script);
  }
}
