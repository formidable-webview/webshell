---
id: "handlehtmldimensionsoptions"
title: "Interface: HandleHTMLDimensionsOptions"
sidebar_label: "HandleHTMLDimensionsOptions"
hide_title: "true"
---

# Interface: HandleHTMLDimensionsOptions

## Hierarchy

* **HandleHTMLDimensionsOptions**

## Index

### Properties

* [deltaMin](handlehtmldimensionsoptions.md#optional-deltamin)
* [forceImplementation](handlehtmldimensionsoptions.md#optional-forceimplementation)
* [pollingInterval](handlehtmldimensionsoptions.md#optional-pollinginterval)

## Properties

### `Optional` deltaMin

• **deltaMin**? : *number*

The minimum difference between two updates' dimensions to trigger a change
event.

**`defaultvalue`** 0

___

### `Optional` forceImplementation

• **forceImplementation**? : *[HTMLDimensionsImplementation](../index.md#htmldimensionsimplementation) | false*

Force a specific implementation, if the underlying API is available.

**`remarks`** 

This option is useful in development to force one implementation to mock older browsers.

**`defaultvalue`** false

___

### `Optional` pollingInterval

• **pollingInterval**? : *number*

In polling mode, at which interval should the dimensions be retrieved?

**`remarks`** 
A value of 0 will disable polling.

**`defaultvalue`** 200
