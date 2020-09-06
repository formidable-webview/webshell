import {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
  ElementRef,
  ComponentPropsWithoutRef
} from 'react';

// UTILITY TYPES

/**
 * Utility type which returns a partial optional of parameter type unless at
 * least one field is required.
 *
 * @public
 */
export type RequiredIfObjectHasRequiredField<O> = O extends Partial<O>
  ? O | undefined
  : O;

// LOOKUP TYPES

/**
 * A lookup type to find the event name from an assembled feature.
 *
 * @public
 */
export type EventNameOf<T> = T extends AssembledEventFeature<{}, infer S, {}>
  ? S extends EventHandlerDefinition<infer H, unknown>
    ? H
    : never
  : never;

/**
 * A lookup type to find the payload type from an assembled event feature.
 *
 * @public
 */
export type PayloadOf<T> = T extends AssembledEventFeature<{}, string, infer P>
  ? P
  : never;

/**
 * A lookup type to infer the assembled feature from a feature.
 *
 * @public
 */
export type AssembledFeatureOf<F> = F extends Feature<infer O, infer S, infer P>
  ? AssembledFeature<O, S, P>
  : never;

/**
 * A lookup type to find the prop assembled with a feature.
 *
 * @public
 */
export type WebshellAssembledProps<F> = F extends AssembledFeature<
  {},
  {},
  infer P
>
  ? P
  : never;

/**
 * A lookup type to find Webshell Component type from a list of features.
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
  C extends ComponentType<any>,
  F extends Feature<any, any, any>[]
> = WebshellComponent<C, AssembledFeatureOf<F[number]>[]>;

// CONCRETE TYPES

/**
 * A `Webshell` component type derived from its features.
 *
 * @public
 */
export type WebshellComponent<
  C extends ComponentType<any>,
  F extends AssembledFeature[]
> = ForwardRefExoticComponent<
  WebshellProps<ComponentPropsWithoutRef<C>, F> & RefAttributes<ElementRef<C>>
>;

/**
 * A specific assembled feature which provides an event handler prop.
 *
 * @public
 */
export type AssembledEventFeature<
  O = {},
  S = EventHandlerDefinition<string, any>,
  P = {}
> = S extends EventHandlerDefinition<infer H, infer Payload>
  ? AssembledFeature<O, S, EventHandlerProps<H, Payload> & P>
  : never;

/**
 * A feature adds new behaviors to the `WebView` DOM and offers new props.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Supplementary static attributes of this feature.
 * @typeparam P - The type of the assembled React Props added to webshell.
 *
 * @public
 */
export type AssembledFeature<
  O extends {} = {},
  S extends {} = {},
  P extends {} = {}
> = {
  /**
   * {@inheritdoc Feature.featureIdentifier}
   */
  readonly featureIdentifier: string;
  /**
   * {@inheritdoc Feature.script}
   */
  readonly script: string;
  /**
   * Any value that can be serialized to JSON and deserialized back.
   * This value will be passed to the top level function declared in the DOM
   * script.
   */
  readonly options: RequiredIfObjectHasRequiredField<O>;
  /**
   * A placeholder type to keep track of the React Props added by this feature.
   */
  readonly props?: P;
} & S;

/**
 * Definitions for event handlers.
 *
 * @typeparam H - The event handler name.
 * @typeparam P - The shape of the payload received by the handler function.
 *
 * @public
 */
export interface EventHandlerDefinition<H extends string, P> {
  /**
   * The name of the event handler. A naming convention is `onDOM` +
   * PascalCase event name, to avoid any collision with WebView's own props.
   *
   * @example
   * onDOMLinkPress
   */
  readonly eventHandlerName: H;
  /**
   * Placeholder value to infer P.
   *
   * @remarks This is not required, but will help typescript keep track of
   * payload type.
   */
  readonly payloadType?: P;
}

/**
 * An object which keys are event handler names, and values are event handler
 * functions.
 *
 * @typeparam H - The event handler name.
 * @typeparam P - The shape of the payload received by the handler function.
 *
 * @public
 */
export type EventHandlerProps<H extends string, P> = {
  [k in H]?: (e: P) => void;
};

/**
 * A lookup type to infer an {@link EventFeature} from options, handler and
 * payload types.
 *
 * @public
 */
export type EventFeatureOf<
  O extends {},
  H extends string,
  Payload,
  OtherProps = {}
> = EventFeature<
  O,
  EventHandlerDefinition<H, Payload>,
  EventHandlerProps<H, Payload> & OtherProps
>;

/**
 * A special feature which adds an event handler property.
 *
 * @public
 */
export type EventFeature<
  O extends {},
  S,
  P = {}
> = S extends EventHandlerDefinition<infer Event, infer Payload>
  ? Feature<O, S, EventHandlerProps<Event, Payload> & P>
  : never;

/**
 * A feature adds new behaviors to the `WebView` DOM and offers handlers on React
 * Native's side.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Supplementary static attributes of this feature.
 * @typeparam P - The type of the assembled React Props added to webshell.
 *
 * @public
 */
export type Feature<O extends {}, S extends {} = {}, P extends {} = {}> = {
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
   * namespace domain ending with the feature name.
   *
   * @example
   * org.formidable-webview/webshell.link-press
   */
  readonly featureIdentifier: string;
  /**
   * Assemble the feature source from options. The feature source object can
   * thereafter be passed to {@link makeWebshell} utility.
   */
  readonly assemble: (
    ...args: O extends Partial<O> ? [] | [O] : [O]
  ) => AssembledFeature<O, S, P>;
} & S;

/**
 * Props any Webshell component will support.
 *
 * @public
 */
export interface WebshellInvariantProps {
  /**
   * Triggered when a feature script throws.
   */
  onDOMError?: (featureIdentifier: string, error: string) => void;
  /**
   * Report DOM error messages from features in the console.
   *
   * @defaultvalue `__DEV__`
   */
  debug?: boolean;
}

/**
 * Props of the Webshell produced by {@link makeWebshell}.
 *
 * @public
 */
export type WebshellProps<
  W,
  F extends AssembledFeature<{}, {}, {}>[]
> = WebshellInvariantProps &
  W &
  (F[number] extends never ? {} : WebshellAssembledProps<F[number]>);

/**
 * A high-compatibility type expressing minimal requirements for the
 * WebView Component's props.
 *
 * @public
 */
export interface MinimalWebViewProps {
  readonly onMessage?: unknown;
  readonly onError?: unknown;
  readonly injectedJavaScript?: unknown;
  readonly javaScriptEnabled?: unknown;
  readonly source?: unknown;
  readonly style?: unknown;
  readonly onNavigationStateChange?: unknown;
  readonly scalesPageToFit?: unknown;
}

// DOM TYPES

declare type HTMLCollection = {};

/**
 * This type specifies the shape of the object passed to DOM features scripts.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam P - The type of the argument which will be passed to the event handler prop.
 * @public
 */
export interface WebjsContext<O extends {}, P> {
  /**
   * The options to customize the script behavior.
   */
  readonly options: O;
  /**
   * When invoked, the webshell will call the handler associated with this script.
   *
   * @param payload - The value which will be passed to the handler.
   */
  postMessage(payload: P): void;
  /**
   * Safely post a warn message to the console.
   */
  warn(message: string): void;
  /**
   * Safely post an error message to the console.
   */
  error(message: string): void;
  /**
   * A utility to select one or many elements in the DOM.
   */
  getDOMSelection(
    selector: DOMElementRequest,
    isCollection: false
  ): HTMLElement;
  getDOMSelection(
    selector: DOMCollectionRequest,
    isCollection: true
  ): HTMLCollection;
  /**
   * @param style - The style to parse, e.g. `'18px'`
   * @returns Numeric value in CSS pixels.
   */
  extractNumericValueFromStyle(style: string): number;
}

/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect | DOMRect}.
 *
 * @public
 */
export interface DOMRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

/**
 * A request to select one element in the DOM.
 *
 * @remarks
 * A string will be interpreted as a query.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | Document.querySelector() }
 *
 * @public
 */
export type DOMElementRequest =
  | ElementQueryRequest
  | ElementClassNameRequest
  | ElementTagNameRequest
  | string;

/**
 * A request to select a collection of elements in the DOM.
 *
 * @remarks
 * A string will be interpreted as a query.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll() }
 * @public
 */
export type DOMCollectionRequest =
  | ElementQueryRequest
  | ElementClassNameRequest
  | ElementIdRequest
  | ElementTagNameRequest
  | string;

/**
 * @public
 */
export interface ElementQueryRequest {
  /**
   * A query string.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll() }
   */
  query: string;
}

/**
 * @public
 */
export interface ElementIdRequest {
  /**
   * An id (case-insensitive);
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById | Document.getElementById() }
   */
  id: string;
}

/**
 * @public
 */
export interface ElementClassNameRequest {
  /**
   * One or many case-sensitive class names, separated by spaces.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName | Document.getElementsByClassName() }
   */
  className: string;
}

/**
 * @public
 */
export interface ElementTagNameRequest {
  /**
   * A tag name.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName | Document.getElementsByTagName() }
   *
   * @remarks
   * `'html'` will select `document.documentElement`.
   */
  tagName: string;
}
