import type { FeatureDefinition, PropsSpecs, WebHandlersSpecs } from './types';

/**
 * A feature constructor function, aka class.
 *
 * @typeparam O - A type describing the shape of the JSON-serializable object that will be passed to the Web script.
 * @typeparam P - A type specifying the new properties added to the shell (capabilities to send message to the shell).
 * @typeparam W - A type specifying the Web handlers added to the shell (capabilities to send message to the Web script).
 *
 * @public
 */
export interface FeatureClass<
  O extends {} = {},
  P extends PropsSpecs<any, any> = {},
  W extends WebHandlersSpecs<any> = {}
> {
  new (...args: O extends Partial<O> ? [] | [O] : [O]): Feature<O, P, W>;
  name: string;
  identifier: string;
}
/**
 * A feature encapsulates injectable behaviors in a WebView.
 *
 * @remarks
 * You should never instantiate that class directly. Use {@link FeatureBuilder} instead.
 *
 * @typeparam O - A type describing the shape of the JSON-serializable object that will be passed to the Web script.
 * @typeparam P - A type specifying the new properties added to the shell (capabilities to send message to the shell).
 * @typeparam W - A type specifying the Web handlers added to the shell (capabilities to send message to the Web script).
 *
 * @public
 */
export default abstract class Feature<
  O extends {} = {},
  P extends PropsSpecs<any, any> = {},
  W extends WebHandlersSpecs<any> = {}
> implements FeatureDefinition<O> {
  /**
   * The string containing valid ECMAScript 5 to be run in the WebView.
   *
   * @remarks
   * The script must define a single function which only argument is of the
   * type {@link WebjsContext}.
   *
   * It is recommended that you use eslint to validate this script syntax, and
   * event better, unit-test the script. See our repository home page for more
   * information.
   */
  readonly script: string;
  /**
   * A unique identifier of the feature. The convention is to use a reverse
   * namespace domain ending with the feature name.
   *
   * @example
   * org.formidable-webview/webshell.link-press
   */
  readonly identifier: string;
  /**
   * An object specifying which props this feature will add to the shell.
   */
  readonly propSpecs: P;
  /**
   * An object specifying which handlers this feature Web script will support.
   */
  readonly webSpecs: W;
  /**
   * These options will be shallow-merged with the options provided to the {@link FeatureClass}.
   */
  readonly defaultOptions: Required<O>;
  /**
   * The options that will be passed to the Web script.
   */
  readonly options: O;
  protected constructor(
    params: FeatureDefinition<O> & {
      propSpecs: P;
      webSpecs: W;
    },
    options: O
  ) {
    this.script = params.script;
    this.identifier = params.identifier;
    this.propSpecs = params.propSpecs;
    this.defaultOptions = params.defaultOptions;
    this.options = { ...params.defaultOptions, ...options };
    this.webSpecs = params.webSpecs;
  }

  /**
   * @internal
   */
  hasWebHandler(eventId: string) {
    return !!this.webSpecs[eventId];
  }
}
