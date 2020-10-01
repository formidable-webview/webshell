import { RefObject } from 'react';
import { Feature } from '../Feature';
import { FeatureRegistry } from '../FeatureRegistry';
import { WebRMIController } from './WebRMIController';
import {
  WebHandle,
  WebHandlerDefinition,
  ExtractWebHandlerSpecFromDef
} from '../types';

export class WebRMIHandle extends WebRMIController implements WebHandle {
  private registry: FeatureRegistry<any>;
  constructor(webViewRef: RefObject<any>, registry: FeatureRegistry<any>) {
    super(webViewRef);
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
    if (__DEV__ && !feat.hasWebHandler(handlerId)) {
      throw new Error(
        `Feature ${feat.identifier} has no Web handler with ID "${handlerId}".`
      );
    }
    if (__DEV__ && !this.registry.hasFeature(feat)) {
      throw new Error(
        `Feature ${feat.identifier} has not be instantiated in this shell.`
      );
    }
    this
      .injectJavaScript`window.ReactNativeWebshell.postMessageToWeb(${feat.identifier},${handlerId},${message});`;
  }

  setDebug(debug: boolean) {
    this.injectJavaScript`window.ReactNativeWebshell.debug=${debug};`;
  }
}
