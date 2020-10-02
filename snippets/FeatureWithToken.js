import { FeatureBuilder } from '@formidable-webview/webshell';
import script from './FeatureWithToken.webjs';
export const FeatureWithToken = new FeatureBuilder({
  script,
  defaultOptions: {},
  identifier: 'org.myorg/webshell.feature1'
})
  .withWebHandler('apiTokenChange')
  .build();
