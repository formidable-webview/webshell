import type { ComponentPropsWithoutRef } from 'react';
import type { ComponentType } from 'react';
import type { ElementRef } from 'react';
import type { ForwardRefExoticComponent } from 'react';
import * as React_2 from 'react';
import type { RefAttributes } from 'react';

/**
 * Named parameters for autoheight hook.
 *
 * @public
 */
export declare interface AutoheightParams<S extends WebshellProps<MinimalWebViewProps, Feature<any, any>[]>> {
    /**
     * It's best to pass all props directed to `Webshell` here. This is
     * advised because the hook might react to specific props and warn you of
     * some incompatibilities.
     */
    webshellProps: S;
    /**
     * By default, the width of `Webshell` will grow to the horizontal space available.
     * This is realized with `width: '100%'` and `alignSelf: 'stretch'`.
     * If you need to set explicit width, do it here.
     */
    width?: number;
    /**
     * The height occupied by the `WebView` prior to knowing its content height.
     * It will be reused each time the source changes.
     *
     * @defaultValue 0
     */
    initialHeight?: number;
    /**
     * When a width change is detected on viewport, the height of the `WebView`
     * will be set to `undefined` for a few milliseconds. This will allow the
     * best handling of height constraint in edge-cases with, for example,
     * content expanding vertically (display: flex), at the cost of a small flash.
     *
     * @defaultValue true
     */
    reinitHeightOnViewportWidthChange?: boolean;
}

/**
 * The state returned by {@link useAutoheight} hook.
 *
 * @public
 */
export declare interface AutoheightState<S extends WebshellProps<MinimalWebViewProps, [FeatureInstanceOf<typeof HandleHTMLDimensionsFeature>]>> {
    /**
     * The props to inject into webshell in order to support "autoheight"
     * behavior.
     */
    autoheightWebshellProps: Pick<S, 'webshellDebug' | 'onDOMHTMLDimensions' | 'style' | 'scalesPageToFit' | 'showsVerticalScrollIndicator' | 'disableScrollViewPanResponder'> & Partial<S>;
    /**
     * The implementation used to generate resize events.
     */
    resizeImplementation: HTMLDimensionsImplementation | null;
    /**
     * An object describing the content size. When the size is not yet known,
     * this object fields will be undefined.
     */
    contentSize: Partial<RectSize>;
    /**
     * The state of synchronization between viewport and content size:
     *
     * - init: the initial, "onMount" state;
     * - syncing: the content size is being determined;
     * - synced: the viewport size has been adjusted to content size.
     *
     */
    syncState: AutoheightSyncState;
}

/**
 * The state of synchronization between viewport and content size:
 *
 * - init: the initial, "onMount" state;
 * - syncing: the content size is being determined;
 * - synced: the viewport size has been adjusted to content size.
 *
 * @public
 */
export declare type AutoheightSyncState = 'init' | 'syncing' | 'synced';

/**
 * @public
 */
export declare interface CSSBox {
    width: number;
    height: number;
}

/**
 * Computed styles which affect the CSS Box dimensions.
 * See {@link https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle | window.getComputedStyle()}.
 *
 * @public
 */
export declare interface CSSBoxDimensionsComputedStyle {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    borderTopWidth: number;
    borderBottomWidth: number;
    borderLeftWidth: number;
    borderRightWidth: number;
    marginTop: number;
    marginBottom: number;
    marginLeft: number;
    marginRight: number;
}

/**
 * A request to select a collection of elements in the DOM.
 *
 * @remarks
 * A string will be interpreted as a “query” request.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll() } and {@link DOMElementQueryRequest}.
 *
 * @public
 */
export declare type DOMCollectionRequest = DOMElementQueryRequest | DOMElementClassNameRequest | DOMElementTagNameRequest | string;

/**
 * A request by one or many case-sensitive class names, separated by spaces.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName | Document.getElementsByClassName() }
 *
 * @public
 */
export declare type DOMElementClassNameRequest = {
    className: string;
};

/**
 * A request by id (case-insensitive);
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById | Document.getElementById() }
 *
 * @public
 */
export declare type DOMElementIdRequest = {
    id: string;
};

/**
 * A request by query string.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll | Document.querySelectorAll() }
 * and {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | Document.querySelector() }
 *
 * @public
 */
export declare type DOMElementQueryRequest = {
    query: string;
};

/**
 * A request to select one element in the DOM.
 *
 * @remarks
 * A string will be interpreted as a “query” request.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector | Document.querySelector() } and {@link DOMElementQueryRequest}.
 *
 * @public
 */
export declare type DOMElementRequest = DOMElementQueryRequest | DOMElementClassNameRequest | DOMElementIdRequest | DOMElementTagNameRequest | string;

/**
 * A query by tag name.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementsByClassName | Document.getElementsByTagName() }
 *
 * @remarks
 * `'html'` will select `document.documentElement`.
 *
 * @public
 */
export declare type DOMElementTagNameRequest = {
    tagName: string;
};

/**
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect | DOMRect}.
 *
 * @public
 */
export declare interface DOMRect {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}

/**
 * An object describing an element CSS Box dimensions, see
 * {@link https://drafts.csswg.org/css2/#box-model | CSS 2 (Box model)}.
 *
 * @remarks
 *
 * This object scalar units are CSS pixels.
 *
 * @public
 */
export declare interface ElementCSSBoxDimensions {
    /**
     * A box formed by `scrollWidth` and `scrollHeight` element properties.
     *
     * @remarks
     * The box is formed with all the space occupied by element's children, even
     * when overflowing. The element padding, border and scrollbar are not
     * counted. See
     * {@link https://drafts.csswg.org/cssom-view/#dom-element-scrollwidth},
     * `scrollWidth` and `scrollHeight` for a reference.
     */
    scrollBox: CSSBox;
    /**
     * The border box as specified in the
     * {@link https://drafts.csswg.org/css-box-3/#valdef-box-border-box | CSS Box Model}.
     *
     * @remarks
     * Margin, padding and content boxes can be derived from
     * {@link ElementCSSBoxDimensions.computedStyle}.
     */
    borderBox: CSSBox;
    /**
     * The computed box style. See
     * {@link https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle | window.getComputedStyle()}.
     *
     * @remarks
     * Be aware that the computed vertical margins might collapse in the
     * viewport. See
     * {@link https://drafts.csswg.org/css2/#collapsing-margins | CSS 2 (collapsing margins)}
     */
    computedStyle: CSSBoxDimensionsComputedStyle;
    /**
     * The width of the horizontal scrollbar.
     *
     * @remarks
     * In the CSS Box model, scrollbars are part of the content box.
     */
    horizontalScrollbarWidth: number;
    /**
     * The width of the vertical scrollbar.
     *
     * @remarks
     * In the CSS Box model, scrollbars are part of the content box.
     */
    verticalScrollbarWidth: number;
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
export declare type EventHandlerProps<H extends string, P> = {
    [k in H]?: (e: P) => void;
};

/**
 * A feature encapsulates injectable behaviors in a WebView.
 *
 * @remarks
 * You should never instantiate that class directly. Use {@link FeatureBuilder} instead.
 *
 * @param params - An object to specify attributes of the feature.
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Specifications for the new properties added to webshell.
 * @public
 */
export declare abstract class Feature<O extends {}, S extends PropsSpecs<any> = []> implements FeatureBase<O> {
    /**
     * {@inheritdoc FeatureDefinition.script}
     */
    readonly script: string;
    readonly featureIdentifier: string;
    readonly propSpecs: S;
    readonly defaultOptions: O;
    readonly options: O;
    constructor(params: FeatureBase<O> & {
        propSpecs: S;
    }, options: O);
}

/**
 * A minimal set of attributes to define a feature.
 *
 * @public
 */
export declare type FeatureBase<O extends {}> = {
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
 * A utility to create feature classes.
 *
 * @param config - An object to specify attributes of the feature.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam S - Specifications for the new properties added by the built feature.
 * @public
 */
export declare class FeatureBuilder<O extends {}, S extends PropsSpecs<any> = []> {
    private config;
    constructor(config: FeatureBuilderConfig<O, S>);
    /**
     * Signal that the feature will receive events from the DOM, and the shell
     * will provide a new handler prop.
     *
     * @param eventHandlerName - The name of the handler prop added to the shell.
     * It is advised to follow the convention of prefixing all these handlers
     * with `onDom` to avoid collisions with `WebView` own props.
     */
    withEventHandlerProp<P, H extends string>(eventHandlerName: H): FeatureBuilder<O, S[number] extends never ? [PropDefinition<{ [k in H]?: ((p: P) => void) | undefined; }>] : [PropDefinition<{ [k_1 in H]?: ((p: P) => void) | undefined; }>, ...S[number][]]>;
    /**
     * Assemble this configuration into a feature class.
     */
    build(): FeatureConstructor<O, S>;
}

/**
 * See {@link FeatureBuilder}.
 *
 * @public
 */
export declare interface FeatureBuilderConfig<O extends {}, S extends PropsSpecs<any> = []> extends FeatureBase<O> {
    /**
     * @internal
     */
    __propSpecs?: S;
    /**
     * When present, the returned constructor will be given this name.
     * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name | Function.name}
     */
    className?: string;
}

/**
 * A feature constructor function, aka class.
 *
 * @public
 */
export declare interface FeatureConstructor<O extends {}, S extends PropsSpecs<any> = []> {
    new (...args: O extends Partial<O> ? [] | [O] : [O]): Feature<O, S>;
    name: string;
    identifier: string;
}

/**
 * A lookup type to extract the instance from a {@link FeatureConstructor}.
 *
 * @public
 */
export declare type FeatureInstanceOf<F> = F extends FeatureConstructor<infer O, infer S> ? Feature<O, S> : never;

/**
 * This feature sets element size programmatically and only once, when
 * {@link https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded | DOMContentLoaded}
 * has been fired.
 *
 * @public
 */
export declare const ForceElementSizeFeature: FeatureConstructor<ForceElementSizeOptions>;

/**
 * An object describing customization for the force body feature.
 *
 * @public
 */
export declare interface ForceElementSizeOptions {
    /**
     * The element to target.
     */
    target: DOMElementRequest;
    /**
     * The width to override.
     *
     * @defaultvalue 'auto'
     */
    widthValue?: number | string;
    /**
     * The height to override.
     *
     * @defaultvalue 'auto'
     */
    heightValue?: number | string;
    /**
     * Force body width to `widthValue`.
     *
     * @defaultvalue true
     */
    forceWidth?: boolean;
    /**
     * Force body width to `heightValue`.
     *
     * @defaultvalue true
     */
    forceHeight?: boolean;
    /**
     * When no element is found matching the target, should the script raise an
     * error?
     *
     * @defaultValue false
     */
    shouldThrowWhenNotFound?: boolean;
}

/**
 * This feature inserts or replace a `<meta name="viewport" content="width=device-width" />`
 * tag in the head to guarantee that the layout viewport will match
 * device-width (hence, “responsive”). Minimum scale is locked to 1, but you
 * can customize maximum scale to allow pinch-zoom gestures.
 * See {@link https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag | MDN—Using the viewport meta tag ...}
 *
 * @public
 */
export declare const ForceResponsiveViewportFeature: FeatureConstructor<ForceResponsiveViewportOptions>;

/**
 * An object describing customization for the fix viewport feature.
 *
 * @public
 */
export declare interface ForceResponsiveViewportOptions {
    /**
     * Maximum pinch-zoom scale.
     *
     * @defaultvalue 1
     */
    maxScale?: number;
}

/**
 * An object describing customization for the dimensions feature.
 *
 * @public
 */
export declare interface HandleElementCSSBoxDimensionsOptions {
    /**
     * The element to target. This argument is required.
     */
    target: DOMElementRequest;
    /**
     * When no elements are found matching the target, should the script
     * raise an error?
     *
     * @defaultValue false
     */
    shouldThrowWhenNotFound?: boolean;
}

/**
 * This feature enables receiving the CSS Box dimensions of an element
 * identified by `tagName` in the `WebView` pixels unit. The first element
 * matching the provided tagName is retained. A new event will be triggered on
 * every resize.
 *
 * @public
 */
export declare const HandleElementCSSBoxFeature: FeatureConstructor<HandleElementCSSBoxDimensionsOptions, [PropDefinition<{
    onDOMElementCSSBoxDimensions?: (e: ElementCSSBoxDimensions) => void;
}>]>;

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export declare const HandleHashChangeFeature: FeatureConstructor<HandleHashChangeOptions, [PropDefinition<{
    onDOMHashChange?: (e: HashChangeEvent) => void;
}>]>;

/**
 * An object describing customization for the hash change feature.
 *
 * @public
 */
export declare interface HandleHashChangeOptions {
    /**
     * Reset the hash to the empty string after triggering the event.
     * This is recommended if you want to make sure any upcoming link press on
     * an anchor with a local hash `href` will trigger the `hashchange` event.
     *
     * @defaultValue false
     */
    shouldResetHashOnEvent?: boolean;
}

/**
 * This feature enables receiving various dimensions relative to the layout. The events
 * will only be fired when a change is observed to either the layout or the content size.
 *
 * @remarks
 * If you need to guarantee that 1 CSS pixel = 1 Device pixel, you should use this
 * feature with a meta tag viewport setting width to device width.
 * {@link ForceResponsiveViewportFeature}
 *
 * @public
 */
export declare const HandleHTMLDimensionsFeature: FeatureConstructor<HandleHTMLDimensionsOptions, [PropDefinition<{
    onDOMHTMLDimensions?: (d: HTMLDimensions) => void;
}>]>;

/**
 * Options for {@link HandleHTMLDimensionsFeature}.
 *
 * @public
 */
export declare interface HandleHTMLDimensionsOptions {
    /**
     * Force a specific implementation, if the underlying API is available.
     *
     * @remarks
     *
     * This option is useful in development to force one implementation to mock older browsers.
     *
     * @defaultValue false
     */
    forceImplementation?: HTMLDimensionsImplementation | false;
    /**
     * In polling mode, at which interval should the dimensions be retrieved?
     *
     * @remarks
     * A value of 0 will disable polling.
     *
     * @defaultValue 200
     */
    pollingInterval?: number;
    /**
     * The minimum difference between two updates' dimensions to trigger a change
     * event.
     *
     *
     * @defaultValue 0
     */
    deltaMin?: number;
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export declare const HandleLinkPressFeature: FeatureConstructor<LinkPressOptions, [PropDefinition<{
    onDOMLinkPress?: (t: LinkPressTarget) => void;
}>]>;

/**
 * This feature adds a handler triggered when the visual viewport changes. It
 * requires VisualViewport API support on browsers (iOS Safari 13 and Android
 * WebView 62).
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport | VisualViewport API}.
 *
 * @beta
 */
export declare const HandleVisualViewportFeature: FeatureConstructor<{}, [PropDefinition<{
    onDOMVisualViewport?: (d: VisualViewportDimensions) => void;
}>]>;

/**
 * A hash change event.
 *
 * @public
 */
export declare interface HashChangeEvent {
    /**
     * The hash (“#” included).
     */
    hash: string;
    /**
     * The bounding rectangle of the element targeted by hash.
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | Element.getBoundingClientRect()}
     */
    targetElementBoundingRect: DOMRect;
}

/**
 * An object describing various dimensions of the HTML layout.
 *
 * @remarks
 * This object units are in CSS pixels. CSS pixels match device pixels when the
 * web page has a `<meta name="viewport" content="width=device-width" />` tag.
 *
 * @public
 */
export declare interface HTMLDimensions {
    /**
     * The layout viewport size, e.g. the size of the WebView in device pixels.
     */
    layoutViewport: RectSize;
    /**
     * The content size, e.g. the size of the body element in CSS pixels.
     */
    content: RectSize;
    /**
     * Which implementation has been used to generate this event?
     * See {@link HTMLDimensionsImplementation}.
     */
    implementation: HTMLDimensionsImplementation;
}

/**
 * The script will check for different APIs in order to
 * implement the notification of HTML dimensions changes. By order of preference:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver | ResizeObserver} (resize),
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver | MutationObserver}
 * (mutation) and polling.
 *
 * @public
 */
export declare type HTMLDimensionsImplementation = 'resize' | 'mutation' | 'polling';

/**
 * An object describing customization for the linkPress feature.
 *
 * @public
 */
export declare interface LinkPressOptions {
    /**
     * Prevent click events on anchors to propagate.
     *
     * @defaultValue true
     */
    preventDefault?: boolean;
    /**
     * Don't trigger an event when the target `href` is inside the page, e.g.
     * `#top`. See also {@link HandleHashChangeFeature}.
     *
     * @defaultValue true
     */
    ignoreHashChange?: boolean;
}

/**
 * The target of a link press event.
 *
 * @public
 */
export declare interface LinkPressTarget {
    /**
     * The full URI of the target.
     */
    uri: string;
    /**
     * The URI scheme.
     */
    scheme: string;
    /**
     * The exact content of the `href` attribute.
     */
    hrefAttribute: string;
    /**
     * The bounding rectangle of the anchor which has been clicked.
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | Element.getBoundingClientRect()}
     */
    clickedAnchorBoundingRect: DOMRect;
    /**
     * An object describing the page location from which the click originated.
     */
    page: {
        /**
         * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/origin}.
         *
         * @remarks
         * Has the special value `null` when not bound to a URL (`{ html }` source).
         */
        origin: string | null;
        /**
         * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/href}.
         *
         * @remarks
         * Has the special value `about:blank` when not bound to a URL (`{ html }` source).
         */
        href: string;
    };
}

/**
 * Creates a React component which decorates WebView component with additional
 * props to handle events from the DOM.
 *
 * @param WebView - A WebView component, typically exported from `react-native-webview`.
 * @param features - Features ready to be loaded in the WebView.
 *
 * @public
 */
declare function makeWebshell<C extends ComponentType<any>, F extends Feature<any, any>[]>(WebView: C, ...features: F): React_2.ForwardRefExoticComponent<WebshellProps<React_2.ComponentPropsWithoutRef<C>, F> & React_2.RefAttributes<ElementRef<C>>>;
export default makeWebshell;
export { makeWebshell }

/**
 * A high-compatibility type expressing minimal requirements for the
 * WebView Component's props.
 *
 * @public
 */
export declare interface MinimalWebViewProps {
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

/**
 * @public
 */
export declare type PropDefinition<P extends Partial<Record<string, any>>> = {
    type: 'handler' | 'inert';
    featureIdentifier: string;
    name: string;
    signature?: P;
};

/**
 * A lookup type to infer the additional props from a feature.
 *
 * @public
 */
export declare type PropsFromFeature<F> = F extends Feature<any, infer S> ? PropsFromSpecs<S> : never;

/**
 * @public
 */
export declare type PropsFromSpecs<S> = S extends PropsSpecs<any> ? S[number]['signature'] : never;

/**
 * @public
 */
export declare type PropsSpecs<P = {}> = PropDefinition<P>[];

/**
 * @public
 */
export declare interface RectSize {
    width: number;
    height: number;
}

/**
 * Requires {@link HandleHTMLDimensionsFeature} and recommends
 * {@link ForceResponsiveViewportFeature}.
 *
 * @remarks
 * This hook has caveats you must understand:
 *
 * - Because the viewport height is now bound to the content heigh, you cannot
 *   and must not have an element which height depends on viewport, such as
 *   when using `vh` unit or `height: 100%;` on body. That will either create
 *   an infinite loop, or a zero-height page (this happens for Wikipedia).
 *   Hence, it is strongly advised that you use autoheight only with content
 *   you have been able to test. This can be worked around by forcing body
 *   height to 'auto', see {@link ForceElementSizeFeature}.
 * - When the user clicks to fragment links within the same page (e.g,
 *   “`#help`”), there will be no scrolling, because this is handled by WebView
 *   on overflow, and there is no such overflow when in autoheight mode.
 *
 * @param params - The parameters to specify autoheight behavior.
 * @returns - An object to implement autoheight behavior.
 *
 * @beta
 */
export declare function useAutoheight<S extends WebshellProps<MinimalWebViewProps, [FeatureInstanceOf<typeof HandleHTMLDimensionsFeature>]>>(params: AutoheightParams<S>): AutoheightState<S>;

/**
 * An object describing the visual viewport of the `WebView`.
 *
 * @public
 */
export declare interface VisualViewportDimensions {
    /**
     * The visual viewport scale. Because this API is quite recent, we have a
     * fallback strategy to compute scale.
     *
     * @remarks
     * The other values in this object are already in React Native dpi units.
     */
    scale: number;
    /**
     * window.visualViewport.width and window.visualViewport.height
     */
    visualViewport: RectSize;
    /**
     * `false` when these values are coming from the VisualViewport API and
     * `true` when they are "best guess". In legacy mode, be warned that you will
     * not receive frequent updates when the user pinch-zoom.
     */
    isLegacy: boolean;
}

/**
 * This type specifies the shape of the object passed to DOM features scripts.
 *
 * @typeparam O - The shape of the JSON-serializable object that will be passed to the DOM script.
 * @typeparam P - The type of the argument which will be passed to the event handler prop.
 * @public
 */
export declare interface WebjsContext<O extends {}, P> {
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
     * Create a function which execute a callback in a try-catch block that will
     * grab errors en send them to the `Webshell` component.
     *
     * @param callback - The callback to try-catch.
     */
    makeCallbackSafe<T extends Function>(callback: T): T;
    /**
     * Safely post a warn message to the console.
     */
    warn(message: string): void;
    /**
     * Safely post an error message to the console.
     */
    error(message: string): void;
    /**
     * Get one element in the DOM from a request.
     *
     * @returns An {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement | HTMLElement} or `null`.
     */
    getDOMSelection(selector: DOMElementRequest, multiple: false): HTMLElement | null;
    /**
     * Get a collection of live elements in the DOM from a query request.
     *
     * @param selector - Which elements should be returned?
     * @returns A live {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLCollection | HTMLCollection}.
     */
    getDOMSelection(selector: DOMElementQueryRequest | string, multiple: true): any;
    /**
     * Get a collection of static elements in the DOM from a class or tag-name request.
     *
     * @param selector - Which elements should be returned?
     * @returns A static {@link https://developer.mozilla.org/en-US/docs/Web/API/NodeList | NodeList}.
     */
    getDOMSelection(selector: DOMElementClassNameRequest | DOMElementTagNameRequest, multiple: true): any;
    /**
     * @param style - The style to parse, e.g. `'18px'`
     *
     * @returns Numeric value in CSS pixels.
     */
    numericFromPxString(style: string): number;
}

/**
 * A `Webshell` component type derived from its features.
 *
 * @public
 */
export declare type WebshellComponent<C extends ComponentType<any>, F extends Feature<any, any>[]> = ForwardRefExoticComponent<WebshellProps<ComponentPropsWithoutRef<C>, F> & RefAttributes<ElementRef<C>>>;

/**
 * A lookup type to get the webshell component from WebView and feature classes.
 *
 * @public
 */
export declare type WebshellComponentOf<C extends ComponentType<any>, F extends FeatureConstructor<any, any>[]> = WebshellComponent<C, FeatureInstanceOf<F[number]>[]>;

/**
 * Props any Webshell component will support.
 *
 * @public
 */
export declare interface WebshellInvariantProps {
    /**
     * Triggered when a feature script throws.
     */
    onDOMError?: (featureIdentifier: string, error: string) => void;
    /**
     * Report DOM error messages from features in the console.
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
export declare type WebshellProps<W extends MinimalWebViewProps, F extends Feature<any, any>[]> = WebshellInvariantProps & W & (F[number] extends never ? {} : PropsFromFeature<F[number]>);

export { }
