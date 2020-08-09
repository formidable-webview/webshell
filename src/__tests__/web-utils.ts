/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WebjsContext } from '../types';

export function createWebjsContext<O, P>(
  options: O,
  _payloadType?: P
): WebjsContext<O, P> {
  return {
    options,
    postMessage: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}
