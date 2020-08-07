import type { Feature } from './types';

/**
 * An object to specify attributes of the feature.
 *
 * @public
 */
export interface MakeFeatureParams<E extends string, P> {
  /** {@inheritDoc AssembledFeature.script} */
  readonly script: string;
  /** {@inheritDoc AssembledFeature.identifier} */
  readonly identifier: string;
  /** {@inheritDoc AssembledFeature.eventHandlerName} */
  readonly eventHandlerName: E;
  /** {@inheritDoc AssembledFeature.payloadType} */
  readonly payloadType?: P;
}

/**
 * Create a feature.
 *
 * @param params - An object to specify attributes of the feature.
 *
 * @public
 */
export function makeFeature<O extends {}, E extends string, P>({
  script,
  identifier,
  eventHandlerName,
  payloadType
}: MakeFeatureParams<E, P>): Feature<O, E, P> {
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
