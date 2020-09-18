import type { FeatureBase, PropsFromSpecs, PropsSpecs } from './types';

/**
 * A lookup type to infer the additional props from a feature.
 *
 * @public
 */
export type PropsFromFeature<F> = F extends Feature<any, infer S>
  ? PropsFromSpecs<S>
  : never;

/**
 * A feature constructor function, aka class.
 *
 * @public
 */
export interface FeatureConstructor<
  O extends {},
  S extends PropsSpecs<any> = []
> {
  new (...args: O extends Partial<O> ? [] | [O] : [O]): Feature<O, S>;
  name: string;
  identifier: string;
}

/**
 * A lookup type to extract the instance from a {@link FeatureConstructor}.
 *
 * @public
 */
export type FeatureInstanceOf<F> = F extends FeatureConstructor<
  infer O,
  infer S
>
  ? Feature<O, S>
  : never;

/**
 * A feature encapsulates injectable behaviors in a WebView.
 *
 * @param params - An object to specify attributes of the feature.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Specifications for the new properties added to webshell.
 * @public
 */
export class Feature<O extends {}, S extends PropsSpecs<any> = []>
  implements FeatureBase<O> {
  readonly script: string;
  readonly featureIdentifier: string;
  readonly propSpecs: S;
  readonly defaultOptions: O;
  readonly options: O;
  constructor(params: FeatureBase<O> & { propSpecs: S }, options: O) {
    this.script = params.script;
    this.featureIdentifier = params.featureIdentifier;
    this.propSpecs = params.propSpecs;
    this.defaultOptions = params.defaultOptions;
    this.options = { ...params.defaultOptions, ...options };
  }
}
