import script from './fix-viewport.webjs';
import { makeFeature } from '../make-feature';
import { Feature } from 'src/types';

/**
 * An object describing customization for the fix viewport feature.
 *
 * @public
 */
export interface FixViewportOptions {
  /**
   * Maximum pinch-zoom scale.
   *
   * @defaultvalue 1
   */
  maxScale?: number;
}

/**
 * This feature inserts or replace a `<meta name="viewport" />` tag in the head
 * to guarantee that the viewport will not exceed device-width.
 */
export const fixViewportFeature: Feature<FixViewportOptions> = makeFeature({
  script,
  featureIdentifier: 'org.formidable-webview/webshell.fix-viewport'
});
