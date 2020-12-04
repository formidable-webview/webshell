import { PropDefinition } from './types';

export type ErrorCode =
  | 'WEBSH_MISSING_SHELL_HANDLER'
  | 'WEBSH_SCRIPT_ERROR'
  | 'WEBSH_WEBVIEW_MISSING_MEMBER'
  | 'WEBSH_FEAT_MISSING_WEB_HANDLER'
  | 'WEBSH_FEAT_MISSING_IN_SHELL'
  | 'WEBSH_DUPLICATED_REGISTERED_PROP';

function describe(template: TemplateStringsArray, ...args: any[]) {
  return (
    '[Webshell]: ' +
    template
      .reduce((buffer, currentSnippet, index) => {
        buffer.push(currentSnippet, args[index] || '');
        return buffer;
      }, [] as string[])
      .join('')
  );
}

interface ErrorDefinition<E extends ErrorCode> {
  code: E;
  verbose: (...args: any[]) => string;
}

const codes: Record<ErrorCode, ErrorDefinition<ErrorCode>> = {
  WEBSH_MISSING_SHELL_HANDLER: {
    code: 'WEBSH_MISSING_SHELL_HANDLER',
    verbose: function (identifier, eventId) {
      return describe`Web script from feature "${identifier}" sent an event for "${eventId}" shell handler, but there is no shell handler registered for this feature. Use FeatureBuilder.withShellHandler to register that handler, or make sure its name is not misspell in the DOM script.`;
    }
  },
  WEBSH_FEAT_MISSING_WEB_HANDLER: {
    code: 'WEBSH_FEAT_MISSING_WEB_HANDLER',
    verbose: function (identifier, eventId) {
      return describe`Feature "${identifier}" has no Web handler with ID "${eventId}".`;
    }
  },
  WEBSH_FEAT_MISSING_IN_SHELL: {
    code: 'WEBSH_FEAT_MISSING_IN_SHELL',
    verbose: function (identifier) {
      return describe`Feature ${identifier} has not be instantiated in this shell.`;
    }
  },
  WEBSH_SCRIPT_ERROR: {
    code: 'WEBSH_SCRIPT_ERROR',
    verbose: function (identifier, body = 'empty error') {
      return describe`Web script from feature "${identifier}" raised an error: ${body}`;
    }
  },
  WEBSH_WEBVIEW_MISSING_MEMBER: {
    code: 'WEBSH_WEBVIEW_MISSING_MEMBER',
    verbose: function () {
      return describe`The WebView element you passed is missing "injectJavaScript" method.`;
    }
  },
  WEBSH_DUPLICATED_REGISTERED_PROP: {
    code: 'WEBSH_DUPLICATED_REGISTERED_PROP',
    verbose: function (
      originalSpec: PropDefinition<any, any>,
      duplicatingSpec: PropDefinition<any, any>
    ) {
      return describe`Prop "${duplicatingSpec.name}" from feature "${duplicatingSpec.featureIdentifier}" is in conflict with a prop of the same name from feature "${originalSpec.featureIdentifier}".`;
    }
  }
};

export default class Reporter {
  private readonly webshellDebug: boolean;
  private readonly strict: boolean;
  constructor(webshellDebug: boolean, strict: boolean) {
    this.webshellDebug = webshellDebug;
    this.strict = strict;
  }
  dispatchError(code: ErrorCode, ...args: any[]) {
    if (!this.webshellDebug) {
      return;
    }
    const message = codes[code].verbose(...args);
    if (this.strict) {
      throw new Error(message);
    } else {
      console.warn(message);
    }
  }

  dispatchWebLog(
    severity: 'warn' | 'info',
    identifier: string,
    message: string
  ) {
    if (!this.webshellDebug) {
      return;
    }
    if (severity === 'warn') {
      console.warn(`[Webshell(${identifier})]: ${message}`);
    } else if (severity === 'info') {
      console.info(`[Webshell(${identifier})]: ${message}`);
    }
  }
}
