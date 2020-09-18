/* eslint-disable no-spaced-func */
import { Feature } from './Feature';
import type { FeatureConstructor } from './Feature';
import type { FeatureBase, PropDefinition, PropsSpecs } from './types';

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
  constructor(
    private config: FeatureBase<O> & {
      propSpecs?: S;
    } & { className: string }
  ) {}
  /**
   * TODO: comment
   * @param eventHandlerName
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
      propSpecs: [...(this.config.propSpecs || []), propDefinition] as any
    });
  }
  /**
   * TODO: comment
   */
  build(): FeatureConstructor<O, S> {
    const {
      script,
      featureIdentifier,
      className,
      propSpecs,
      defaultOptions
    } = this.config;
    const BuiltFeature: FeatureConstructor<O, S> = class extends Feature<O, S> {
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
    return { [className]: BuiltFeature }[className];
  }
}
