import { makeWebshell } from './make-webshell';
export type {
  DOMCollectionRequest,
  DOMElementClassNameRequest,
  DOMElementIdRequest,
  DOMElementQueryRequest,
  DOMElementRequest,
  DOMElementTagNameRequest,
  DOMRect,
  DOMRectSize,
  DOMUtils,
  ExtractFeatureFromClass,
  ExtractPropsFromFeature,
  ExtractPropsFromSpecs,
  ExtractWebHandlerSpecFromDef,
  ExtractWebHandlerSpecsFromFeature,
  ExtractWebshellFromFeatClass,
  FeatureDefinition,
  MinimalWebViewProps,
  PropDefinition,
  PropsSpecs,
  WebHandle,
  WebHandlerDefinition,
  WebHandlersSpecs,
  WebjsContext,
  WebshellComponent,
  WebshellInvariantProps,
  WebshellProps
} from './types';
export * from './FeatureBuilder';
export * from './Feature';
export * from './features';
export * from './hooks/autoheigh';
export { default as useWebshell } from './useWebshell';
export type { UseWebshellParams } from './useWebshell';
export { makeWebshell };
export default makeWebshell;
