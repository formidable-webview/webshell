---
id: "index"
title: "@formidable-webview/webshell"
sidebar_label: "Globals"
hide_title: "true"
---

# @formidable-webview/webshell

## Index

### Interfaces

* [AutoheightParams](interfaces/autoheightparams.md)
* [AutoheightState](interfaces/autoheightstate.md)
* [CSSBox](interfaces/cssbox.md)
* [CSSBoxDimensionsComputedStyle](interfaces/cssboxdimensionscomputedstyle.md)
* [DOMRect](interfaces/domrect.md)
* [ElementCSSBoxDimensions](interfaces/elementcssboxdimensions.md)
* [ElementClassNameRequest](interfaces/elementclassnamerequest.md)
* [ElementIdRequest](interfaces/elementidrequest.md)
* [ElementQueryRequest](interfaces/elementqueryrequest.md)
* [ElementTagNameRequest](interfaces/elementtagnamerequest.md)
* [EventHandlerDefinition](interfaces/eventhandlerdefinition.md)
* [ForceElementSizeOptions](interfaces/forceelementsizeoptions.md)
* [ForceResponsiveViewportOptions](interfaces/forceresponsiveviewportoptions.md)
* [HTMLDimensions](interfaces/htmldimensions.md)
* [HandleElementCSSBoxDimensionsOptions](interfaces/handleelementcssboxdimensionsoptions.md)
* [HandleHTMLDimensionsOptions](interfaces/handlehtmldimensionsoptions.md)
* [HandleHashChangeOptions](interfaces/handlehashchangeoptions.md)
* [HashChangeEvent](interfaces/hashchangeevent.md)
* [LinkPressOptions](interfaces/linkpressoptions.md)
* [LinkPressTarget](interfaces/linkpresstarget.md)
* [MinimalWebViewProps](interfaces/minimalwebviewprops.md)
* [RectSize](interfaces/rectsize.md)
* [VisualViewportDimensions](interfaces/visualviewportdimensions.md)
* [WebjsContext](interfaces/webjscontext.md)
* [WebshellInvariantProps](interfaces/webshellinvariantprops.md)

### Type aliases

* [AssembledEventFeature](index.md#assembledeventfeature)
* [AssembledFeature](index.md#assembledfeature)
* [AssembledFeatureOf](index.md#assembledfeatureof)
* [AutoheightSyncState](index.md#autoheightsyncstate)
* [DOMCollectionRequest](index.md#domcollectionrequest)
* [DOMElementRequest](index.md#domelementrequest)
* [EventFeature](index.md#eventfeature)
* [EventFeatureOf](index.md#eventfeatureof)
* [EventHandlerProps](index.md#eventhandlerprops)
* [EventNameOf](index.md#eventnameof)
* [Feature](index.md#feature)
* [HTMLCollection](index.md#htmlcollection)
* [HTMLDimensionsImplementation](index.md#htmldimensionsimplementation)
* [OptionalUnlessRequiredField](index.md#optionalunlessrequiredfield)
* [PayloadOf](index.md#payloadof)
* [WebshellAssembledProps](index.md#webshellassembledprops)
* [WebshellComponent](index.md#webshellcomponent)
* [WebshellComponentOf](index.md#webshellcomponentof)
* [WebshellProps](index.md#webshellprops)

### Variables

* [forceElementSizeFeature](index.md#const-forceelementsizefeature)
* [forceResponsiveViewportFeature](index.md#const-forceresponsiveviewportfeature)
* [handleElementCSSBoxFeature](index.md#const-handleelementcssboxfeature)
* [handleHTMLDimensionsFeature](index.md#const-handlehtmldimensionsfeature)
* [handleHashChangeFeature](index.md#const-handlehashchangefeature)
* [handleLinkPressFeature](index.md#const-handlelinkpressfeature)
* [handleVisualViewportFeature](index.md#const-handlevisualviewportfeature)

### Functions

* [makeFeature](index.md#makefeature)
* [makeWebshell](index.md#makewebshell)
* [useAutoheight](index.md#useautoheight)

## Type aliases

###  AssembledEventFeature

Ƭ **AssembledEventFeature**: *S extends EventHandlerDefinition&lt;infer H, infer Payload&gt; ? AssembledFeature&lt;O, S, EventHandlerProps&lt;H, Payload&gt; & P&gt; : never*

A specific assembled feature which provides an event handler prop.

___

###  AssembledFeature

Ƭ **AssembledFeature**: *object & S*

A feature adds new behaviors to the `WebView` DOM and offers new props.

___

###  AssembledFeatureOf

Ƭ **AssembledFeatureOf**: *F extends Feature&lt;infer O, infer S, infer P&gt; ? AssembledFeature&lt;O, S, P&gt; : never*

A lookup type to infer the assembled feature from a feature.

___

###  AutoheightSyncState

Ƭ **AutoheightSyncState**: *"init" | "syncing" | "synced"*

The state of synchronization between viewport and content size:

- init: the initial, "onMount" state;
- syncing: the content size is being determined;
- synced: the viewport size has been adjusted to content size.

___

###  DOMCollectionRequest

Ƭ **DOMCollectionRequest**: *[ElementQueryRequest](interfaces/elementqueryrequest.md) | [ElementClassNameRequest](interfaces/elementclassnamerequest.md) | [ElementIdRequest](interfaces/elementidrequest.md) | [ElementTagNameRequest](interfaces/elementtagnamerequest.md) | string*

A request to select a collection of elements in the DOM.

**`remarks`** 
A string will be interpreted as a query.
See [Document.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

___

###  DOMElementRequest

Ƭ **DOMElementRequest**: *[ElementQueryRequest](interfaces/elementqueryrequest.md) | [ElementClassNameRequest](interfaces/elementclassnamerequest.md) | [ElementTagNameRequest](interfaces/elementtagnamerequest.md) | string*

A request to select one element in the DOM.

**`remarks`** 
A string will be interpreted as a query.
See [Document.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)

___

###  EventFeature

Ƭ **EventFeature**: *S extends EventHandlerDefinition&lt;infer Event, infer Payload&gt; ? Feature&lt;O, S, EventHandlerProps&lt;Event, Payload&gt; & P&gt; : never*

A special feature which adds an event handler property.

___

###  EventFeatureOf

Ƭ **EventFeatureOf**: *[EventFeature](index.md#eventfeature)&lt;O, [EventHandlerDefinition](interfaces/eventhandlerdefinition.md)&lt;H, Payload&gt;, [EventHandlerProps](index.md#eventhandlerprops)&lt;H, Payload&gt; & OtherProps&gt;*

A lookup type to infer an [EventFeature](index.md#eventfeature) from options, handler and
payload types.

___

###  EventHandlerProps

Ƭ **EventHandlerProps**: *object*

An object which keys are event handler names, and values are event handler
functions.

#### Type declaration:

___

###  EventNameOf

Ƭ **EventNameOf**: *T extends AssembledEventFeature&lt;object, infer S, object&gt; ? S extends EventHandlerDefinition&lt;infer H, unknown&gt; ? H : never : never*

A lookup type to find the event name from an assembled feature.

___

###  Feature

Ƭ **Feature**: *object & S*

A feature adds new behaviors to the `WebView` DOM and offers handlers on React
Native's side.

___

###  HTMLCollection

Ƭ **HTMLCollection**: *object*

#### Type declaration:

___

###  HTMLDimensionsImplementation

Ƭ **HTMLDimensionsImplementation**: *"resize" | "mutation" | "polling"*

The script will check for different APIs in order to
implement the notification of HTML dimensions changes. By order of preference:
[ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) (resize),
[MutationObserver](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver)
(mutation) and polling.

___

###  OptionalUnlessRequiredField

Ƭ **OptionalUnlessRequiredField**: *O extends Partial&lt;O&gt; ? O | undefined : O*

Utility type which returns a partial optional of parameter type unless at
least one field is required.

___

###  PayloadOf

Ƭ **PayloadOf**: *T extends AssembledEventFeature&lt;object, string, infer P&gt; ? P : never*

A lookup type to find the payload type from an assembled event feature.

___

###  WebshellAssembledProps

Ƭ **WebshellAssembledProps**: *F extends AssembledFeature&lt;object, object, infer P&gt; ? P : never*

A lookup type to find the prop assembled with a feature.

___

###  WebshellComponent

Ƭ **WebshellComponent**: *ForwardRefExoticComponent&lt;[WebshellProps](index.md#webshellprops)&lt;ComponentPropsWithoutRef&lt;C&gt;, F&gt; & RefAttributes&lt;ElementRef&lt;C&gt;&gt;&gt;*

A `Webshell` component type derived from its features.

___

###  WebshellComponentOf

Ƭ **WebshellComponentOf**: *[WebshellComponent](index.md#webshellcomponent)&lt;C, [AssembledFeatureOf](index.md#assembledfeatureof)&lt;F[number]&gt;[]&gt;*

A lookup type to find Webshell Component type from a list of features.

**`example`** 
```ts
const Webshell: WebshellComponentOf&lt;
 WebViewProps,
 [typeof featureA, typeof featureB]
&gt;;
```

___

###  WebshellProps

Ƭ **WebshellProps**: *[WebshellInvariantProps](interfaces/webshellinvariantprops.md) & W & F[number] extends never ? object : WebshellAssembledProps&lt;F[number]&gt;*

Props of the Webshell produced by [makeWebshell](index.md#makewebshell).

## Variables

### `Const` forceElementSizeFeature

• **forceElementSizeFeature**: *object*

This feature sets element size programmatically and only once, when
[DOMContentLoaded](https://developer.mozilla.org/fr/docs/Web/Events/DOMContentLoaded)
has been fired.

#### Type declaration:

* **assemble**(): *function*

  * (...`args`: [] | [[ForceElementSizeOptions](interfaces/forceelementsizeoptions.md)]): *object*

    * **featureIdentifier**: *string*

    * **options**: *[ForceElementSizeOptions](interfaces/forceelementsizeoptions.md) | undefined*

    * **props**? : *object | undefined*

    * **script**: *string*

* **featureIdentifier**: *string*

* **script**: *string*

___

### `Const` forceResponsiveViewportFeature

• **forceResponsiveViewportFeature**: *[Feature](index.md#feature)&lt;[ForceResponsiveViewportOptions](interfaces/forceresponsiveviewportoptions.md)&gt;*

This feature inserts or replace a `&lt;meta name="viewport" content="width=device-width" /&gt;`
tag in the head to guarantee that the layout viewport will match
device-width (hence, “responsive”). Minimum scale is locked to 1, but you
can customize maximum scale to allow pinch-zoom gestures.
See [MDN—Using the viewport meta tag ...](https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag)

___

### `Const` handleElementCSSBoxFeature

• **handleElementCSSBoxFeature**: *[EventFeatureOf](index.md#eventfeatureof)&lt;[HandleElementCSSBoxDimensionsOptions](interfaces/handleelementcssboxdimensionsoptions.md), "onDOMElementCSSBoxDimensions", [ElementCSSBoxDimensions](interfaces/elementcssboxdimensions.md)&gt;*

This feature enables receiving the CSS Box dimensions of an element
identified by `tagName` in the `WebView` pixels unit. The first element
matching the provided tagName is retained. A new event will be triggered on
every resize.

___

### `Const` handleHTMLDimensionsFeature

• **handleHTMLDimensionsFeature**: *[EventFeatureOf](index.md#eventfeatureof)&lt;[HandleHTMLDimensionsOptions](interfaces/handlehtmldimensionsoptions.md), "onDOMHTMLDimensions", [HTMLDimensions](interfaces/htmldimensions.md)&gt;*

This feature enables receiving various dimensions relative to the layout. The events
will only be fired when a change is observed to either the layout or the content size.

**`remarks`** 
If you need to guarantee that 1 CSS pixel = 1 Device pixel, you should use this
feature with a meta tag viewport setting width to device width. See
[forceResponsiveViewportFeature](index.md#const-forceresponsiveviewportfeature).

___

### `Const` handleHashChangeFeature

• **handleHashChangeFeature**: *[EventFeatureOf](index.md#eventfeatureof)&lt;[HandleHashChangeOptions](interfaces/handlehashchangeoptions.md), "onDOMHashChange", [HashChangeEvent](interfaces/hashchangeevent.md)&gt;*

This feature allows to intercept clicks on anchors (`&lt;a&gt;`). By default, it
will prevent the click from propagating. But you can disable this option.

___

### `Const` handleLinkPressFeature

• **handleLinkPressFeature**: *[EventFeatureOf](index.md#eventfeatureof)&lt;[LinkPressOptions](interfaces/linkpressoptions.md), "onDOMLinkPress", [LinkPressTarget](interfaces/linkpresstarget.md)&gt;*

This feature allows to intercept clicks on anchors (`&lt;a&gt;`). By default, it
will prevent the click from propagating. But you can disable this option.

___

### `Const` handleVisualViewportFeature

• **handleVisualViewportFeature**: *[EventFeatureOf](index.md#eventfeatureof)&lt;object, "onDOMVisualViewport", [VisualViewportDimensions](interfaces/visualviewportdimensions.md)&gt;*

This feature adds a handler triggered when the visual viewport changes. It
requires VisualViewport API support on browsers (iOS Safari 13 and Android
WebView 62).
See [VisualViewport API](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport).

**`beta`** 

## Functions

###  makeFeature

▸ **makeFeature**&lt;**O**, **S**, **P**&gt;(`params`: Pick&lt;[Feature](index.md#feature)&lt;O, S, P&gt;, keyof S | "script" | "featureIdentifier"&gt;): *[Feature](index.md#feature)&lt;O, S, P&gt;*

Create a feature.

**Type parameters:**

▪ **O**: *object*

The shape of the JSON-serializable object that will be passed to the DOM script.

▪ **S**: *object*

Static attributes of this feature.

▪ **P**: *object*

The type of the new properties added to webshell.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | Pick&lt;[Feature](index.md#feature)&lt;O, S, P&gt;, keyof S &#124; "script" &#124; "featureIdentifier"&gt; | An object to specify attributes of the feature.  |

**Returns:** *[Feature](index.md#feature)&lt;O, S, P&gt;*

___

###  makeWebshell

▸ **makeWebshell**&lt;**C**, **F**&gt;(`WebView`: C, ...`assembledFeatures`: F): *React_2.ForwardRefExoticComponent&lt;[WebshellProps](index.md#webshellprops)&lt;React_2.ComponentPropsWithoutRef&lt;C&gt;, F&gt; & React_2.RefAttributes&lt;ElementRef&lt;C&gt;&gt;&gt;*

Creates a React component which decorates WebView component with additional
props to handle events from the DOM.

**Type parameters:**

▪ **C**: *ComponentType&lt;any&gt;*

▪ **F**: *[AssembledFeature](index.md#assembledfeature)[]*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`WebView` | C | A WebView component, typically exported from `react-native-webview`. |
`...assembledFeatures` | F | Assembled features ready to be loaded in the WebView DOM.  |

**Returns:** *React_2.ForwardRefExoticComponent&lt;[WebshellProps](index.md#webshellprops)&lt;React_2.ComponentPropsWithoutRef&lt;C&gt;, F&gt; & React_2.RefAttributes&lt;ElementRef&lt;C&gt;&gt;&gt;*

___

###  useAutoheight

▸ **useAutoheight**&lt;**S**&gt;(`params`: [AutoheightParams](interfaces/autoheightparams.md)&lt;S&gt;): *[AutoheightState](interfaces/autoheightstate.md)&lt;S&gt;*

Requires [handleHTMLDimensionsFeature](index.md#const-handlehtmldimensionsfeature) and recommends
[forceResponsiveViewportFeature](index.md#const-forceresponsiveviewportfeature).

**`remarks`** 
This hook has caveats you must understand:

- Because the viewport height is now bound to the content heigh, you cannot
  and must not have an element which height depends on viewport, such as
  when using `vh` unit or `height: 100%;` on body. That will either create
  an infinite loop, or a zero-height page (this happens for Wikipedia).
  Hence, it is strongly advised that you use autoheight only with content
  you have been able to test. This can be worked around by forcing body
  height to 'auto', see [forceElementSizeFeature](index.md#const-forceelementsizefeature).
- When the user clicks to fragment links within the same page (e.g,
  “`#help`”), there will be no scrolling, because this is handled by WebView
  on overflow, and there is no such overflow when in autoheight mode.

**`beta`** 

**Type parameters:**

▪ **S**: *[WebshellProps](index.md#webshellprops)&lt;[MinimalWebViewProps](interfaces/minimalwebviewprops.md), [[AssembledFeatureOf](index.md#assembledfeatureof)&lt;typeof handleHTMLDimensionsFeature&gt;]&gt;*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`params` | [AutoheightParams](interfaces/autoheightparams.md)&lt;S&gt; | The parameters to specify autoheight behavior. |

**Returns:** *[AutoheightState](interfaces/autoheightstate.md)&lt;S&gt;*

- An object to implement autoheight behavior.
