/* eslint-disable no-spaced-func */
import { Feature } from './Feature';
import type { FeatureConstructor } from './Feature';
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
 * @public
 */
export interface FeatureBuilderConfig<
  O extends {},
  S extends PropsSpecs<any, any> = {}
> extends FeatureDefinition<O> {
  /**
   * @internal
   */
  __propSpecs?: S;
  /**
   * @internal
   */
  __webSpecs?: WebHandlersSpecs<any>;
}

/**
 * A utility to create feature classes.
 *
 * @param config - An object to specify attributes of the feature.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the Web script.
 * @typeparam S - Specifications for the new properties added by the built feature.
 * @public
 */
export class FeatureBuilder<
  O extends {},
  S extends PropsSpecs<any, any> = {},
  W extends WebHandlersSpecs<any> = {}
> {
  private config: FeatureBuilderConfig<O, S>;

  public constructor(config: FeatureBuilderConfig<O, S>) {
    this.config = config;
  }
  /**
   * Instruct that the shell will receive events from the Web, and provide a
   * new handler prop.
   *
   * @param propName - The name of the handler prop added to the shell.
   * It is advised to follow the convention of prefixing all these handlers
   * with `onDom` to avoid collisions with `WebView` own props.
   *
   * @param handlerId - The unique identifier of the handler that will be used by the Web
   * script to post a message. If none is provided, fallback to `"default"`.
   */
  withandlerProp<P, H extends string>(
    propName: H,
    handlerId: string = 'default'
  ) {
    const propDefinition: PropDefinition<H, (p: P) => void> = {
      handlerId,
      name: propName,
      featureIdentifier: this.config.featureIdentifier,
      type: 'handler'
    };
    const propSpec = {
      [propName]: propDefinition
    } as PropsSpecs<H, typeof propDefinition>;
    return new FeatureBuilder<O, S & PropsSpecs<H, (p: P) => void>, W>({
      ...this.config,
      __propSpecs: {
        ...((this.config.__propSpecs || {}) as S),
        ...propSpec
      }
    });
  }
  /**
   * Instruct that the Web script will receive events from the shell.
   * See {@link WebshellInvariantProps.webHandle} and {@link WebjsContext.onShellMessage}.
   *
   * @param handlerId - The name of the handler in the Web script.
   */
  withWebHandler<P = undefined, I extends string = string>(handlerId: I) {
    return new FeatureBuilder<
      O,
      S,
      W & { [k in I]: WebHandlerDefinition<P, I> }
    >({
      ...this.config,
      __webSpecs: {
        ...(this.config.__webSpecs || {}),
        [handlerId]: { async: false, handlerId }
      }
    });
  }
  /**
   * Assemble this configuration into a feature class.
   */
  build(): FeatureConstructor<O, S, W> {
    const {
      script,
      featureIdentifier,
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
            featureIdentifier,
            defaultOptions,
            propSpecs: (propSpecs || []) as S,
            webSpecs: (webSpecs || {}) as W
          },
          (args[0] || {}) as O
        );
      }
    };
    Object.defineProperty(ctor, 'name', {
      configurable: true,
      enumerable: false,
      writable: false,
      value: `Feature(${featureIdentifier})`
    });
    return ctor;
  }
}
