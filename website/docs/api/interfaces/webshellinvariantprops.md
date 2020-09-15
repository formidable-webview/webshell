---
id: "webshellinvariantprops"
title: "Interface: WebshellInvariantProps"
sidebar_label: "WebshellInvariantProps"
hide_title: "true"
---

# Interface: WebshellInvariantProps

Props any Webshell component will support.

## Hierarchy

* **WebshellInvariantProps**

## Index

### Properties

* [onDOMError](webshellinvariantprops.md#optional-ondomerror)
* [webshellDebug](webshellinvariantprops.md#optional-webshelldebug)

## Properties

### `Optional` onDOMError

• **onDOMError**? : *function*

Triggered when a feature script throws.

#### Type declaration:

▸ (`featureIdentifier`: string, `error`: string): *void*

**Parameters:**

Name | Type |
------ | ------ |
`featureIdentifier` | string |
`error` | string |

___

### `Optional` webshellDebug

• **webshellDebug**? : *boolean*

Report DOM error messages from features in the console.

**`defaultvalue`** `__DEV__`
