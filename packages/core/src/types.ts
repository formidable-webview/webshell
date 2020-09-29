import type {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
  ElementRef,
  ComponentPropsWithoutRef
} from 'react';
import type {
  Feature,
  FeatureConstructor,
  FeatureInstanceOf,
  PropsFromFeature
} from './Feature';

// CONCRETE TYPES

/**
 * A `Webshell` component type derived from its features.
 *
 * @public
 */
export type WebshellComponent<
  C extends ComponentType<any>,
  F extends Feature<any, any>[]
> = ForwardRefExoticComponent<
  WebshellProps<ComponentPropsWithoutRef<C>, F> & RefAttributes<ElementRef<C>>
>;

/**
 * A lookup type to get the webshell component from WebView and feature classes.
 *
 * @public
 */
export type WebshellComponentOf<
  C extends ComponentType<any>,
  F extends FeatureConstructor<any, any>[]
> = WebshellComponent<C, FeatureInstanceOf<F[number]>[]>;

/**
 * A minimal set of attributes to define a feature.
 *
 * @public
 */
export type FeatureDefinition<O extends {}> = {
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
   * These options will be shallow-merged with the options provided to the {@link FeatureConstructor}.
   */
  readonly defaultOptions: O;
};

/**
 * @public
 */
export type PropDefinition<P extends Partial<Record<string, any>>> = {
  handlerId: string;
  type: 'handler' | 'inert';
  featureIdentifier: string;
  name: string;
  signature?: P;
};

/**
 * @public
 */
export type PropsFromSpecs<S> = S extends PropsSpecs<any>
  ? S[number]['signature']
  : never;

/**
 * @public
 */
export type PropsSpecs<P = {}> = PropDefinition<P>[];

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
   * Report Web error messages from features in the console.
   *
   * @defaultvalue `__DEV__`
   */
  webshellDebug?: boolean;
}

/**
 * Props of the Webshell produced by {@link makeWebshell}.
 *
 * @public
 */
export type WebshellProps<
  W extends MinimalWebViewProps,
  F extends Feature<any, any>[]
> = WebshellInvariantProps &
  W &
  (F[number] extends never ? {} : PropsFromFeature<F[number]>);

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
  readonly source?: Record<string, any>;
  readonly style?: unknown;
  readonly onNavigationStateChange?: unknown;
  readonly scalesPageToFit?: unknown;
  readonly showsVerticalScrollIndicator?: unknown;
  readonly disableScrollViewPanResponder?: unknown;
}

// Web TYPES

/**
 * This type specifies the shape of the object passed to Web features scripts.
 *
 * @typeparam O - The shape of the JSON-serializable options that will be passed to the Web script.
 * @typeparam P - The type of the argument which will be passed to the event handler prop.
 *
 * @public
 */
export interface WebjsContext<O extends {}, P> {
  /**
   * The options to customize the script behavior.
   */
  readonly options: O;
  /**
   * Instruct the shell to call **the default handler** associated with
   * this feature, if any.
   *
   * @param payload - The value which will be passed to the handler.
   */
  postMessageToShell(payload: P): void;
  /**
   * Instruct the shell to call the handler associated with this
   * feature and `eventId`, if any.
   *
   * @param handlerId - A unique string to disambiguate between different handlers.
   * You can omit this param if you are sending to `"default"` handler.
   * @param payload - The value which will be passed to the handler.
   */
  postMessageToShell(handlerId: string, payload: P): void;
  /**
   * Create a function which execute a callback in a try-catch block that will
   * grab errors en send them to the `Webshell` component.
   *
   * @param callback - The callback to try-catch.
   */
  makeCallbackSafe<T extends Function>(callback: T): T;
  /**
   * Safely post a warn message to the console. The message will be routed to
   * shell and printed in the React Native console during development.
   */
  warn(message: string): void;
  /**
   * Safely post an info message to the console. The message will be routed to
   * shell and printed in the React Native console during development.
   */
  info(message: string): void;
  /**
   * Get one element in the DOM from a request. See {@link DOMElementRequest}.
   *
   * @returns An {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement | HTMLElement} or `null`.
   */
  getDOMSelection(selector: DOMElementRequest): HTMLElement | null;
  /**
   * Get a collection of live elements in the DOM from a query request.
   *
   * @param selector - Which elements should be returned?
   * @returns A live {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection | HTMLCollection}.
   */
  getDOMSelectionAll(selector: DOMElementQueryRequest | string): any;
  /**
   * Get a collection of static elements in the DOM from a class or tag-name request.
   *
   * @param selector - Which elements should be returned?
   * @returns A static {@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList | NodeList}.
   */
  getDOMSelectionAll(
    selector: DOMElementClassNameRequest | DOMElementTagNameRequest
  ): any;
  /**
   * @param style - The style to parse, e.g. `'18px'`
   *
   * @returns Numeric value in CSS pixels.
   */
  numericFromPxString(style: string): number;
}

/**
 * @public
 */
export interface DOMRectSize {
  width: number;
  height: number;
}

/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect | DOMRect}.
 *
 * @public
 */
export interface DOMRect extends DOMRectSize {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

/**
 * A request to select one element in the DOM.
 *
 * @remarks
 * A string will be interpreted as a “query” request.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | Document.querySelector() } and {@link DOMElementQueryRequest}.
 *
 * @public
 */
export type DOMElementRequest =
  | DOMElementQueryRequest
  | DOMElementClassNameRequest
  | DOMElementIdRequest
  | DOMElementTagNameRequest
  | string;

/**
 * A request to select a collection of elements in the DOM.
 *
 * @remarks
 * A string will be interpreted as a “query” request.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll() } and {@link DOMElementQueryRequest}.
 *
 * @public
 */
export type DOMCollectionRequest =
  | DOMElementQueryRequest
  | DOMElementClassNameRequest
  | DOMElementTagNameRequest
  | string;

/**
 * A request by query string.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll() }
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | Document.querySelector() }
 *
 * @public
 */
export type DOMElementQueryRequest = {
  query: string;
};

/**
 * A request by id (case-insensitive);
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById | Document.getElementById() }
 *
 * @public
 */
export type DOMElementIdRequest = {
  id: string;
};

/**
 * A request by one or many case-sensitive class names, separated by spaces.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName | Document.getElementsByClassName() }
 *
 * @public
 */
export type DOMElementClassNameRequest = {
  className: string;
};

/**
 * A query by tag name.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName | Document.getElementsByTagName() }
 *
 * @remarks
 * `'html'` will select `document.documentElement`.
 *
 * @public
 */
export type DOMElementTagNameRequest = {
  tagName: string;
};
