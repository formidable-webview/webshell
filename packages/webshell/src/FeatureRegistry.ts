import Feature from './Feature';
import Reporter from './Reporter';
import { PropDefinition, PropsSpecs, WebshellProps } from './types';

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

function getHandlerUUID(identifier: string, eventId: string) {
  return `${identifier}:${eventId}`;
}

function extractHandlersMap(features: Feature<any, PropsSpecs<any, any>>[]) {
  return features
    .map((f: Feature<any, PropsSpecs<any, any>>) => Object.values(f.propSpecs))
    .reduce((p, c) => [...p, ...c], [])
    .reduce((map, spec: PropDefinition<any, any>) => {
      return {
        ...map,
        [getHandlerUUID(spec.featureIdentifier, spec.eventId)]: spec
      };
    }, {}) as Record<string, PropDefinition<any, any>>;
}

function extractPropsSpecsMap(
  features: Feature<any, PropsSpecs<any, any>>[],
  reporter: Reporter
) {
  return features
    .map((f: Feature<any, PropsSpecs<any, any>>) => Object.values(f.propSpecs))
    .reduce((p, c) => [...p, ...c], [])
    .reduce((map, spec: PropDefinition<any, any>) => {
      if (map[spec.name]) {
        reporter.dispatchError(
          'WEBSH_DUPLICATED_REGISTERED_PROP',
          map[spec.name],
          spec
        );
      }
      return { ...map, [spec.name]: spec };
    }, {}) as Record<string, PropDefinition<any, any>>;
}

export default class FeatureRegistry<F extends Feature<any, any, any>[]> {
  readonly propsMap: Record<string, PropDefinition<any, any>>;
  readonly handlersMap: Record<string, PropDefinition<any, any>>;
  readonly features: F;
  constructor(features: F, reporter: Reporter) {
    this.propsMap = extractPropsSpecsMap(features, reporter);
    this.handlersMap = extractHandlersMap(features);
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
