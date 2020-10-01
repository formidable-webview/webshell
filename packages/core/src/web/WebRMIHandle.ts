import { RefObject } from 'react';
import { Feature } from '../Feature';
import { FeatureRegistry } from '../FeatureRegistry';
import { WebRMIController } from './WebRMIController';
import {
  WebHandle,
  WebHandlerDefinition,
  ExtractWebHandlerSpecFromDef
} from '../types';
import { Reporter } from '../Reporter';

export class WebRMIHandle extends WebRMIController implements WebHandle {
  private registry: FeatureRegistry<any>;
  constructor(
    webViewRef: RefObject<any>,
    registry: FeatureRegistry<any>,
    reporter: Reporter
  ) {
    super(webViewRef, reporter);
    this.registry = registry;
  }

  postMessageToWeb<
    D extends WebHandlerDefinition<any, any>,
    S extends ExtractWebHandlerSpecFromDef<D>
  >(
    feat: Feature<any, any, S>,
    handlerId: D['handlerId'],
    message: D['payload']
  ) {
    if (!feat.hasWebHandler(handlerId)) {
      this.reporter.dispatchError(
        'WEBSH_FEAT_MISSING_WEB_HANDLER',
        feat.identifier,
        handlerId
      );
      return;
    }
    if (!this.registry.hasFeature(feat)) {
      this.reporter.dispatchError(
        'WEBSH_FEAT_MISSING_IN_SHELL',
        feat.identifier
      );
      return;
    }
    this
      .injectJavaScript`window.ReactNativeWebshell.postMessageToWeb(${feat.identifier},${handlerId},${message});`;
  }

  setDebug(debug: boolean) {
    this.injectJavaScript`window.ReactNativeWebshell.debug=${debug};`;
  }
}
