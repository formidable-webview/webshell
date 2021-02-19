import injectStyleScript from './InjectStyleFeature.webjs';
import FeatureBuilder from '../FeatureBuilder';
import type { FeatureClass } from '../Feature';

/**
 * An object describing options for the inject style feature.
 *
 * @public
 */
export interface InjectStyleFeatureOptions {
  /**
   * CSS markup to inject in a `<style>` element.
   */
  css: string;
}

/**
 * This feature injects a `<style>` element in the header of the page.
 *
 * @public
 */
export const InjectStyleFeature: FeatureClass<InjectStyleFeatureOptions> = new FeatureBuilder<InjectStyleFeatureOptions>(
  {
    defaultOptions: { css: '' },
    identifier: '@native-html/iframe-strip-body-spacing',
    script: injectStyleScript
  }
).build();
