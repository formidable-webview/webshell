---
id: "webjscontext"
title: "Interface: WebjsContext ‹**O, P**›"
sidebar_label: "WebjsContext"
hide_title: "true"
---

# Interface: WebjsContext ‹**O, P**›

This type specifies the shape of the object passed to DOM features scripts.

## Type parameters

▪ **O**: *object*

The shape of the JSON-serializable object that will be passed to the DOM script.

▪ **P**

The type of the argument which will be passed to the event handler prop.

## Hierarchy

* **WebjsContext**

## Index

### Properties

* [options](webjscontext.md#readonly-options)

### Methods

* [error](webjscontext.md#error)
* [extractNumericValueFromPixelString](webjscontext.md#extractnumericvaluefrompixelstring)
* [getDOMSelection](webjscontext.md#getdomselection)
* [makeCallbackSafe](webjscontext.md#makecallbacksafe)
* [postMessage](webjscontext.md#postmessage)
* [warn](webjscontext.md#warn)

## Properties

### `Readonly` options

• **options**: *O*

The options to customize the script behavior.

## Methods

###  error

▸ **error**(`message`: string): *void*

Safely post an error message to the console.

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *void*

___

###  extractNumericValueFromPixelString

▸ **extractNumericValueFromPixelString**(`style`: string): *number*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`style` | string | The style to parse, e.g. `'18px'` |

**Returns:** *number*

Numeric value in CSS pixels.

___

###  getDOMSelection

▸ **getDOMSelection**(`selector`: [DOMElementRequest](../index.md#domelementrequest), `isCollection`: false): *HTMLElement*

A utility to select one or many elements in the DOM.

**Parameters:**

Name | Type |
------ | ------ |
`selector` | [DOMElementRequest](../index.md#domelementrequest) |
`isCollection` | false |

**Returns:** *HTMLElement*

▸ **getDOMSelection**(`selector`: [DOMCollectionRequest](../index.md#domcollectionrequest), `isCollection`: true): *[HTMLCollection](../index.md#htmlcollection)*

**Parameters:**

Name | Type |
------ | ------ |
`selector` | [DOMCollectionRequest](../index.md#domcollectionrequest) |
`isCollection` | true |

**Returns:** *[HTMLCollection](../index.md#htmlcollection)*

___

###  makeCallbackSafe

▸ **makeCallbackSafe**‹**T**›(`callback`: T): *T*

Create a function which execute a callback in a try-catch block that will
grab errors en send them to the `Webshell` component.

**Type parameters:**

▪ **T**: *Function*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`callback` | T | The callback to try-catch.  |

**Returns:** *T*

___

###  postMessage

▸ **postMessage**(`payload`: P): *void*

When invoked, the webshell will call the handler associated with this script.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`payload` | P | The value which will be passed to the handler.  |

**Returns:** *void*

___

###  warn

▸ **warn**(`message`: string): *void*

Safely post a warn message to the console.

**Parameters:**

Name | Type |
------ | ------ |
`message` | string |

**Returns:** *void*
