// This file is imported as a string thanks to babel-plugin-inline-import
import linkPressScript from './handle-link-press.webjs';
import { makeFeature, EventFeatureOf } from '@formidable-webview/webshell';

export interface LinkPressOptions {
  preventDefault?: boolean;
}

export interface LinkPressTarget {
  uri: string;
}

export const handleLinkPressFeature: EventFeatureOf<
  LinkPressOptions,
  'onDOMLinkPress',
  LinkPressTarget
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onDOMLinkPress',
  featureIdentifier: 'org.myorg/webshell.link-press'
});
