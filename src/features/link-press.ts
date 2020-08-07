import linkPressScript from './link-press.webjs';
import { makeFeature } from '../make-feature';
import type { Feature } from '../types';

/**
 * An object describing customization for the linkPress feature.
 *
 * @public
 */
export interface LinkPressOptions {
  /**
   * Prevent click events on anchors to propagate.
   *
   * @defaultValue true
   */
  preventDefault?: boolean;
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const linkPressFeature: Feature<
  LinkPressOptions,
  'onLinkPress',
  string
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onLinkPress',
  identifier: 'org.webshell.linkPress'
});
