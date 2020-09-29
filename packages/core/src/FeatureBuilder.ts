/* eslint-disable no-spaced-func */
import { Feature } from './Feature';
import type { FeatureConstructor } from './Feature';
import type { FeatureDefinition, PropDefinition, PropsSpecs } from './types';

/**
 * See {@link FeatureBuilder}.
 *
 * @public
 */
export interface FeatureBuilderConfig<
  O extends {},
  S extends PropsSpecs<any> = []
> extends FeatureDefinition<O> {
  /**
   * @internal
   */
  __propSpecs?: S;
}

/**
 * A utility to create feature classes.
 *
 * @param config - An object to specify attributes of the feature.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Specifications for the new properties added by the built feature.
 * @public
 */
export class FeatureBuilder<O extends {}, S extends PropsSpecs<any> = []> {
  private config: FeatureBuilderConfig<O, S>;

  public constructor(config: FeatureBuilderConfig<O, S>) {
    this.config = config;
  }
  /**
   * Signal that the feature will receive events from the DOM, and the shell
   * will provide a new handler prop.
   *
   * @param eventHandlerName - The name of the handler prop added to the shell.
   * It is advised to follow the convention of prefixing all these handlers
   * with `onDom` to avoid collisions with `WebView` own props.
   */
  withEventHandlerProp<P, H extends string>(eventHandlerName: H) {
    const propDefinition: PropDefinition<{ [k in H]?: (p: P) => void }> = {
      name: eventHandlerName,
      featureIdentifier: this.config.featureIdentifier,
      type: 'handler'
    };
    return new FeatureBuilder<
      O,
      S[number] extends never
        ? [PropDefinition<{ [k in H]?: (p: P) => void }>]
        : [PropDefinition<{ [k in H]?: (p: P) => void }>, ...S[number][]]
    >({
      ...this.config,
      __propSpecs: [...(this.config.__propSpecs || []), propDefinition] as any
    });
  }
  /**
   * Assemble this configuration into a feature class.
   */
  build(): FeatureConstructor<O, S> {
    const {
      script,
      featureIdentifier,
      __propSpecs: propSpecs,
      defaultOptions
    } = this.config;
    const ctor = class extends Feature<O, S> {
      static identifier = featureIdentifier;
      constructor(...args: O extends Partial<O> ? [] | [O] : [O]) {
        super(
          {
            script,
            featureIdentifier,
            defaultOptions,
            propSpecs: (propSpecs || []) as S
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
