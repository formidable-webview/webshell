import { makeWebshell } from './make-webshell';
export type {
  Feature,
  AssembledFeature,
  AssembledFeatureOf,
  EventNameOf,
  MinimalWebViewProps,
  PayloadOf,
  WebshellComponentOf,
  WebshellProps,
  WebshellInvariantProps,
  WebshellHandlerProps,
  WebjsContext
} from './types';
export * from './make-feature';
export * from './features';
export { makeWebshell };
export default makeWebshell;
