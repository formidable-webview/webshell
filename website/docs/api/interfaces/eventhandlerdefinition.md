---
id: "eventhandlerdefinition"
title: "Interface: EventHandlerDefinition ‹**H, P**›"
sidebar_label: "EventHandlerDefinition"
hide_title: "true"
---

# Interface: EventHandlerDefinition ‹**H, P**›

Definitions for event handlers.

## Type parameters

▪ **H**: *string*

The event handler name.

▪ **P**

The shape of the payload received by the handler function.

## Hierarchy

* **EventHandlerDefinition**

## Index

### Properties

* [eventHandlerName](eventhandlerdefinition.md#readonly-eventhandlername)
* [payloadType](eventhandlerdefinition.md#optional-readonly-payloadtype)

## Properties

### `Readonly` eventHandlerName

• **eventHandlerName**: *H*

The name of the event handler. A naming convention is `onDOM` +
PascalCase event name, to avoid any collision with WebView's own props.

**`example`** 
onDOMLinkPress

___

### `Optional` `Readonly` payloadType

• **payloadType**? : *P*

Placeholder value to infer P.

**`remarks`** This is not required, but will help typescript keep track of
payload type.
