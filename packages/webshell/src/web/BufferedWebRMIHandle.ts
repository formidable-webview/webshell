import React from 'react';
import FeatureRegistry from '../FeatureRegistry';
import Reporter from '../Reporter';
import { WebHandle } from '../types';
import { WebRMIHandle } from './WebRMIHandle';

interface DelayedInvocation<M extends keyof WebRMIHandle> {
  methodName: M;
  args: WebRMIHandle[M] extends Function ? Parameters<WebRMIHandle[M]> : never;
}

export class BufferedWebRMIHandle implements WebHandle {
  private buffer: Array<DelayedInvocation<keyof WebRMIHandle>> = [];
  private isLoaded: boolean = false;
  private handle: WebRMIHandle;
  postMessageToWeb: WebRMIHandle['postMessageToWeb'];
  setDebug: WebRMIHandle['setDebug'];

  constructor(
    webViewRef: React.RefObject<any>,
    registry: FeatureRegistry<any>,
    webshellDebug: Reporter
  ) {
    this.handle = new WebRMIHandle(webViewRef, registry, webshellDebug);
    this.postMessageToWeb = this.proxify('postMessageToWeb');
    this.setDebug = this.proxify('setDebug');
  }

  private proxify<M extends keyof WebRMIHandle>(methodName: M) {
    return (...args: any) => {
      if (this.isLoaded) {
        this.handle[methodName as any].apply(this.handle, args as any);
      } else {
        this.buffer.push({ methodName, args });
      }
    };
  }

  /**
   * Flush all pending invocations.
   */
  flushPendingMessages() {
    this.isLoaded = true;
    let pack: DelayedInvocation<any> | undefined;
    while ((pack = this.buffer.pop()) !== undefined) {
      this.handle[pack.methodName].apply(this.handle, pack.args);
    }
  }
}
