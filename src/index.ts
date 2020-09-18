import { makeWebshell } from './make-webshell';
export type {
  DOMCollectionRequest,
  DOMElementClassNameRequest,
  DOMElementIdRequest,
  DOMElementQueryRequest,
  DOMElementRequest,
  DOMElementTagNameRequest,
  DOMRect,
  EventHandlerProps,
  FeatureBase,
  MinimalWebViewProps,
  PropDefinition,
  PropsFromSpecs,
  PropsSpecs,
  WebjsContext,
  WebshellComponent,
  WebshellComponentOf,
  WebshellInvariantProps,
  WebshellProps
} from './types';
export * from './features/types';
export * from './FeatureBuilder';
export * from './Feature';
export * from './features';
export * from './hooks/autoheigh';
export { makeWebshell };
export default makeWebshell;
