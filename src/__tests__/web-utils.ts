import type { WebjsContext } from '../types';

export function createWebjsContext<O, P>(
  options: O,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _payloadType?: P
): WebjsContext<O, P> {
  return {
    options,
    postMessage: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}
