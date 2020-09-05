import type { Feature, RequiredIfObjectHasRequiredField } from './types';

/**
 * Create a feature.
 *
 * @param params - An object to specify attributes of the feature.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Static attributes of this feature.
 * @typeparam P - The type of the new properties added to webshell.
 * @public
 */
export function makeFeature<O extends {}, S extends {} = {}, P extends {} = {}>(
  params: Pick<Feature<O, S, P>, keyof S | 'script' | 'featureIdentifier'>
): Feature<O, S, P> {
  return {
    ...params,
    assemble: (...args) => {
      return {
        ...params,
        options: args[0] as RequiredIfObjectHasRequiredField<O>
      };
    }
  };
}
