import Feature from '../Feature';
import featuresLoaderScript from './web-features-loader.webjs';
import { PropsSpecs } from '../types';

function serializeFeature(feature: Feature<any, PropsSpecs<any, any>>) {
  return `{source:${feature.script},identifier:${JSON.stringify(
    feature.identifier
  )},options:${JSON.stringify(feature.options || {})}}`;
}

function registerFeature(feat: Feature<any, any>) {
  return `try {
    window.ReactNativeWebshell.registerFeature(${serializeFeature(feat)});
  } catch (e) {
    window.ReactNativeWebshell.sendErrorMessage(${JSON.stringify(
      feat.identifier
    )},e);
  };`;
}

function assembleScript(feats: Feature<any, any>[]) {
  return `${featuresLoaderScript}(function(){${feats
    .map(registerFeature)
    .join('\n')};})();`;
}

export class WebFeaturesLoader<F extends Feature<any, any>[]> {
  readonly features: F;
  readonly assembledFeaturesScript: string;
  constructor(features: F) {
    this.features = features;
    this.assembledFeaturesScript = assembleScript(features);
  }
}
