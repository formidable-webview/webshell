import React from 'react';
import { FeatureRegistry } from '../FeatureRegistry';
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
    registry: FeatureRegistry<any>
  ) {
    this.handle = new WebRMIHandle(webViewRef, registry);
    this.postMessageToWeb = this.proxify('postMessageToWeb');
    this.setDebug = this.proxify('setDebug');
  }

  private proxify<M extends keyof WebRMIHandle>(methodName: M) {
    return (...args: any) => {
      if (this.isLoaded) {
        this.handle[methodName as any].apply(this.handle, args as any);
      } else {
        this.buffer.push({ methodName, args: [args as any] });
      }
    };
  }

  /**
   * Flush all pending invocations.
   */
  load() {
    this.isLoaded = true;
    let pack: DelayedInvocation<any> | undefined;
    while ((pack = this.buffer.pop()) !== undefined) {
      this.handle[pack.methodName](...pack.args);
    }
  }
}
