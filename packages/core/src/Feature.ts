import type {
  FeatureDefinition,
  ExtractPropsFromSpecs,
  PropsSpecs,
  WebHandlersSpecs
} from './types';

/**
 * A lookup type to infer the additional props from a feature.
 *
 * @public
 */
export type PropsFromFeature<F> = F extends Feature<any, infer S, any>
  ? ExtractPropsFromSpecs<S>
  : {};

/**
 * A feature constructor function, aka class.
 *
 * @public
 */
export interface FeatureConstructor<
  O extends {},
  S extends PropsSpecs<any, any> = {},
  W extends WebHandlersSpecs<any> = {}
> {
  new (...args: O extends Partial<O> ? [] | [O] : [O]): Feature<O, S, W>;
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
  infer S,
  infer W
>
  ? Feature<O, S, W>
  : never;

/**
 * A feature encapsulates injectable behaviors in a WebView.
 *
 * @remarks
 * You should never instantiate that class directly. Use {@link FeatureBuilder} instead.
 *
 * @param params - An object to specify attributes of the feature.
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the Web script.
 * @typeparam S - Specifications for the new properties added to webshell.
 * @public
 */
export abstract class Feature<
  O extends {},
  P extends PropsSpecs<any, any> = {},
  W extends WebHandlersSpecs<any> = {}
> implements FeatureDefinition<O> {
  /**
   * {@inheritdoc FeatureDefinition.script}
   */
  readonly script: string;
  readonly identifier: string;
  readonly propSpecs: P;
  readonly webSpecs: W;
  readonly defaultOptions: Required<O>;
  readonly options: O;
  /**
   * @internal
   */
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

  hasWebHandler(handlerId: string) {
    return !!this.webSpecs[handlerId];
  }
}
