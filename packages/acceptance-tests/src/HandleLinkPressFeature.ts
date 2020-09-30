// This file is imported as a string thanks to babel-plugin-inline-import
import linkPressScript from './HandleLinkPressFeature.webjs';
import { FeatureBuilder } from '@formidable-webview/webshell';

export interface LinkPressOptions {
  preventDefault?: boolean;
}

export interface LinkPressTarget {
  uri: string;
}

const defaultOptions = {
  preventDefault: true
};

export const HandleLinkPressFeature = new FeatureBuilder({
  defaultOptions,
  script: linkPressScript,
  identifier: 'org.myorg/webshell.link-press'
})
  .withandlerProp<LinkPressTarget, 'onDOMLinkPress'>(
    'onDOMLinkPress'
  )
  .build();
