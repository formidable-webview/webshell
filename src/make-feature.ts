import type { Feature } from './types';

/**
 * An object to specify attributes of the feature.
 *
 * @typeparam E - The name of the event handler prop assembled in the webshell.
 * @typeparam P - The type of the argument which will be passed to the event handler prop.
 * @public
 */
export interface MakeFeatureParams<E extends string, P> {
  /** {@inheritdoc AssembledFeature.script} */
  readonly script: string;
  /** {@inheritdoc AssembledFeature.identifier} */
  readonly identifier: string;
  /** {@inheritdoc AssembledFeature.eventHandlerName} */
  readonly eventHandlerName: E;
  /** {@inheritdoc AssembledFeature.payloadType} */
  readonly payloadType?: P;
}

/**
 * Create a feature.
 *
 * @param params - An object to specify attributes of the feature.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam E - The name of the event handler prop assembled in the webshell.
 * @typeparam P - The type of the argument which will be passed to the event handler prop.
 * @public
 */
export function makeFeature<O extends {}, E extends string, P>(
  params: MakeFeatureParams<E, P>
): Feature<O, E, P> {
  const { script, identifier, eventHandlerName, payloadType } = params;
  return {
    identifier,
    eventHandlerName,
    assemble: (options: Partial<O> = {}) => ({
      script,
      identifier,
      eventHandlerName,
      payloadType,
      options: options
    })
  };
}
