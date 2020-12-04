/* eslint-disable no-spaced-func */
import Feature from './Feature';
import type { FeatureClass } from './Feature';
import type {
  FeatureDefinition,
  PropDefinition,
  PropsSpecs,
  WebHandlerDefinition,
  WebHandlersSpecs
} from './types';

/**
 * See {@link FeatureBuilder}.
 *
 * @typeparam O - A type describing the shape of the JSON-serializable object that will be passed to the Web script.
 *
 * @public
 */
export interface FeatureBuilderConfig<O extends {}>
  extends FeatureDefinition<O> {
  /**
   * @internal
   */
  __propSpecs?: PropsSpecs<any, any>;
  /**
   * @internal
   */
  __webSpecs?: WebHandlersSpecs<any>;
}

/**
 * A utility to create feature classes.
 *
 * @typeparam O - A type describing the shape of the JSON-serializable object that will be passed to the Web script.
 * @typeparam S - A type specifying the new properties added to the shell (capabilities to send message to the shell).
 * @typeparam W - A type specifying the Web handlers added to the shell (capabilities to send message to the Web script).
 *
 * @public
 */
export default class FeatureBuilder<
  O extends {} = {},
  S extends PropsSpecs<any, any> = {},
  W extends WebHandlersSpecs<any> = {}
> {
  private config: FeatureBuilderConfig<O>;

  /**
   *
   * @param config - An object to specify attributes of the feature.
   */
  public constructor(config: FeatureBuilderConfig<O>) {
    this.config = config;
    if (typeof config.script === 'function') {
      throw new TypeError(
        '[FeatureBuilder]: config.script must be a string. If you are trying to import a ' +
          'webjs file such as in the docs, you need to setup babel-plugin-inline-import. ' +
          'See our guide here: https://formidable-webview.github.io/webshell/docs/tooling#babel'
      );
    }
  }
  /**
   * Instruct that the shell will receive events from the Web, and provide a
   * new handler prop for that purpose.
   *
   * @param propName - The name of the handler prop added to the shell.
   * It is advised to follow the convention of prefixing all these handlers
   * with `onDOM` or `onWeb` to avoid collisions with `WebView` own props.
   * @param eventId - A unique identifier for the event received by the shell.
   * If none is provided, fallback to `"default"`.
   *
   * @typeparam N - A type to define the name of the prop.
   * @typeparam P - A type describing the shape of payloads sent to shell handlers.
   */
  withShellHandler<N extends string, P>(
    propName: N,
    eventId: string = 'default'
  ) {
    const propDefinition: PropDefinition<N, (p: P) => void> = {
      eventId,
      name: propName,
      featureIdentifier: this.config.identifier,
      type: 'handler'
    };
    const propSpec = {
      [propName]: propDefinition
    } as PropsSpecs<N, typeof propDefinition>;
    return new FeatureBuilder<O, S & PropsSpecs<N, (p: P) => void>, W>({
      ...this.config,
      __propSpecs: {
        ...(this.config.__propSpecs || {}),
        ...propSpec
      }
    });
  }
  /**
   * Instruct that the Web script will receive events from the shell.
   * See {@link WebshellInvariantProps.webHandleRef}, {@link WebHandle.postMessageToWeb} and {@link WebjsContext.onShellMessage}.
   *
   * @param eventId - A unique identifier for the event received by the Web script.
   *
   * @typeparam I - A type for the event identifier.
   * @typeparam P - A type describing the shape of payloads sent to Web handlers.
   */
  withWebHandler<I extends string = string, P = undefined>(eventId: I) {
    return new FeatureBuilder<
      O,
      S,
      W & { [k in I]: WebHandlerDefinition<I, P> }
    >({
      ...this.config,
      __webSpecs: {
        ...(this.config.__webSpecs || {}),
        [eventId]: { async: false, eventId }
      }
    });
  }
  /**
   * Assemble this builder object into a feature class.
   */
  build(): FeatureClass<O, S, W> {
    const {
      script,
      identifier: featureIdentifier,
      __propSpecs: propSpecs,
      __webSpecs: webSpecs,
      defaultOptions
    } = this.config;
    const ctor = class extends Feature<O, S, W> {
      static identifier = featureIdentifier;
      constructor(...args: O extends Partial<O> ? [] | [O] : [O]) {
        super(
          {
            script,
            identifier: featureIdentifier,
            defaultOptions,
            propSpecs: (propSpecs || []) as S,
            webSpecs: (webSpecs || {}) as W
          },
          (args[0] || {}) as O
        );
      }
    };
    Object.defineProperty(ctor, 'displayName', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: `Feature(${featureIdentifier})`
    });
    return ctor;
  }
}
