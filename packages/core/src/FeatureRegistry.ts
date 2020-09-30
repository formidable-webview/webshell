import { Feature } from './Feature';
import { PropDefinition, PropsSpecs, WebshellProps } from './types';
import featuresLoaderScript from './features-loader.webjs';

function serializeFeature(feature: Feature<any, PropsSpecs<any, any>>) {
  return `{source:${feature.script},identifier:${JSON.stringify(
    feature.featureIdentifier
  )},options:${JSON.stringify(feature.options || {})}}`;
}

function extractFeatureProps(
  props: WebshellProps<any, any>,
  propsMap: Record<string, PropDefinition<any, any>>,
  type: 'handler' | 'inert' | null = null
): any {
  return Object.keys(props).reduce((obj, key) => {
    if (propsMap[key] && (type == null || propsMap[key].type === type)) {
      return {
        ...obj,
        [key]: props[key]
      };
    }
    return obj;
  }, {});
}

function filterWebViewProps<W>(
  props: WebshellProps<any, any>,
  propsMap: Record<string, PropDefinition<any, any>>
): W {
  return Object.keys(props).reduce((obj, key) => {
    if (propsMap[key] || key.startsWith('webshell')) {
      return obj;
    }
    return {
      ...obj,
      [key]: props[key]
    };
  }, {} as W);
}

function getHandlerUUID(identifier: string, handlerId: string) {
  return `${identifier}:${handlerId}`;
}

function extractHandlersMap(features: Feature<any, PropsSpecs<any, any>>[]) {
  return features
    .map((f: Feature<any, PropsSpecs<any, any>>) => Object.values(f.propSpecs))
    .reduce((p, c) => [...p, ...c], [])
    .reduce(
      (map, spec: PropDefinition<any, any>) => ({
        ...map,
        [getHandlerUUID(spec.featureIdentifier, spec.handlerId)]: spec
      }),
      {}
    ) as Record<string, PropDefinition<any, any>>;
}

function extractPropsSpecsMap(features: Feature<any, PropsSpecs<any, any>>[]) {
  return features
    .map((f: Feature<any, PropsSpecs<any, any>>) => Object.values(f.propSpecs))
    .reduce((p, c) => [...p, ...c], [])
    .reduce(
      (map, spec: PropDefinition<any, any>) => ({ ...map, [spec.name]: spec }),
      {}
    ) as Record<string, PropDefinition<any, any>>;
}

function registerFeature(feat: Feature<any, any>) {
  return `try {
    window.ReactNativeWebshell.registerFeature(${serializeFeature(feat)});
  } catch (e) {
    window.ReactNativeWebshell.sendErrorMessage(${JSON.stringify(
      feat.featureIdentifier
    )},e);
  };`;
}

export function assembleScript(feats: Feature<any, any>[]) {
  return `${featuresLoaderScript}(function(){${feats.map(
    registerFeature
  )};})();`;
}

export class FeatureRegistry<F extends Feature<any, any>[]> {
  readonly propsMap: Record<string, PropDefinition<any, any>>;
  readonly handlersMap: Record<string, PropDefinition<any, any>>;
  readonly assembledFeaturesScript: string;
  readonly features: F;
  constructor(features: F) {
    const filteredFeatures = features.filter((f) => !!f);
    this.propsMap = extractPropsSpecsMap(filteredFeatures);
    this.handlersMap = extractHandlersMap(filteredFeatures);
    this.assembledFeaturesScript = assembleScript(filteredFeatures);
    this.features = features;
  }

  getWebHandlers(props: WebshellProps<any, any>) {
    return extractFeatureProps(props, this.propsMap, 'handler');
  }

  getPropDefFromId(identifier: string, shellHandlerId: string) {
    return this.handlersMap[getHandlerUUID(identifier, shellHandlerId)];
  }

  getPropDefFromHandlerName(handlerName: string) {
    return this.propsMap[handlerName];
  }

  filterWebViewProps<W>(webShellProps: WebshellProps<any, any>) {
    return filterWebViewProps<W>(webShellProps, this.propsMap);
  }

  hasFeature(feature: Feature<any, any, any>) {
    return this.features.indexOf(feature) !== -1;
  }
}
