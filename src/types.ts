// HELPER TYPES

import { ComponentClass } from 'react';

/**
 * A lookup type to find the event name from an assembled feature.
 *
 * @public
 */
export type EventNameOf<T> = T extends AssembledFeature<{}, infer E, unknown>
  ? E
  : never;

/**
 * A lookup type to find the payload type from an assembled feature.
 *
 * @public
 */
export type PayloadOf<T, E extends string> = T extends AssembledFeature<
  {},
  E,
  infer P
>
  ? P
  : never;

/**
 * A lookup type to infer the assembled feature from a feature.
 *
 * @public
 */
export type AssembledFeatureOf<F> = F extends Feature<infer O, infer E, infer P>
  ? AssembledFeature<O, E, P>
  : never;

/**
 * A smart type which infers the prop type associated with a feature.
 *
 * @public
 */
export type WebshellHandlerProps<
  F extends AssembledFeature<{}, string, unknown>
> = {
  [E in EventNameOf<F>]?: (p: PayloadOf<F, E>) => void;
};

/**
 * A utility type to infer WebshellComponent type from a list of features.
 *
 * @example
 * ```
 * const Webshell: WebshellComponentOf<
 *  WebViewProps,
 *  [typeof featureA, typeof featureB]
 * >;
 * ```
 *
 * @public
 */
export type WebshellComponentOf<
  W extends MinimalWebViewProps,
  F extends Feature<any, any, any>[]
> = ComponentClass<
  W & WebshellComponentProps<W, AssembledFeatureOf<F[number]>[]>,
  unknown
>;

// USEFUL TYPES

/**
 * This type specifies the shape of the object passed to DOM features scripts.
 *
 * @public
 */
export interface WebjsContext<O extends {}, P> {
  /**
   * The options to customize the script behavior. See {@link AssembledFeature.options}.
   */
  readonly options: O;
  /**
   * When invoked, the webshell will call the handler associated with this script.
   *
   * @param payload - The value which will be passed to the handler.
   */
  readonly postMessage: (payload: P) => void;
  /**
   * Safely post a warn message to the console.
   */
  readonly warn: (message: string) => void;
  /**
   * Safely post an error message to the console.
   */
  readonly error: (message: string) => void;
}

/**
 * A feature with its options, ready to be consumed by {@link makeWebshell}.
 *
 * @public
 */
export interface AssembledFeature<
  O extends {} = {},
  E extends string = string,
  P = any
> {
  /**
   * The string containing valid ECMAScript 5 to be run in the WebView.
   *
   * @remarks
   * The script must define a single function which only argument is of the
   * type {@link WebjsContext}.
   *
   * It is recommended that you use eslint to validate this script syntax, and
   * event better, unit-test the script. See our repository home page for more
   * information.
   */
  readonly script: string;
  /**
   * A unique identifier of the feature. The convention is to use a reverse
   * namespace domain ending with the event name.
   *
   * @example
   * com.archriss.linkPress
   */
  readonly identifier: string;
  /**
   * The name of the event handler. The convention is to name it `on` +
   * PascalCase event name.
   *
   * @example
   * onLinkPress
   */
  readonly eventHandlerName: E;
  /**
   * Any value that can be serialized to JSON and deserialized back.
   * This value will be passed to the top level function declared in the DOM
   * script.
   */
  readonly options?: Partial<O>;
  /**
   * Placeholder value to infer P.
   *
   * @remarks This is not required, but can help with typescript so that it
   * infers payload type P.
   */
  readonly payloadType?: P;
}

/**
 * A feature adds new behaviors to the `WebView` DOM and offers handlers on React
 * Native's side.
 *
 * @public
 */
export interface Feature<O extends {}, E extends string, P> {
  /** {@inheritDoc AssembledFeature.identifier} */
  readonly identifier: string;
  /** {@inheritDoc AssembledFeature.eventHandlerName} */
  readonly eventHandlerName: E;
  /**
   * Assemble the feature source from options. The feature source object can
   * thereafter be passed to {@link makeWebshell} utility.
   */
  readonly assemble: (options?: O) => AssembledFeature<O, E, P>;
}

/**
 * @public
 */
export interface WebshellStaticProps<W> {
  onShellError?: (featureIdentifier: string, error: string) => void;
  webViewProps?: W;
}

/**
 * @public
 */
export type WebshellComponentProps<
  W,
  F extends AssembledFeature<{}, string, unknown>[]
> = WebshellHandlerProps<F[number]> & WebshellStaticProps<W>;

/**
 * @public
 */
export interface MinimalWebViewProps {
  onMessage?: unknown;
  onError?: unknown;
  injectedJavaScript?: unknown;
  javaScriptEnabled?: unknown;
  source?: unknown;
}
