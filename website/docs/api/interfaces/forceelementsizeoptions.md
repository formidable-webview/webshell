---
id: "forceelementsizeoptions"
title: "Interface: ForceElementSizeOptions"
sidebar_label: "ForceElementSizeOptions"
hide_title: "true"
---

# Interface: ForceElementSizeOptions

An object describing customization for the force body feature.

## Hierarchy

* **ForceElementSizeOptions**

## Index

### Properties

* [forceHeight](forceelementsizeoptions.md#optional-forceheight)
* [forceWidth](forceelementsizeoptions.md#optional-forcewidth)
* [heightValue](forceelementsizeoptions.md#optional-heightvalue)
* [shouldThrowWhenNotFound](forceelementsizeoptions.md#optional-shouldthrowwhennotfound)
* [target](forceelementsizeoptions.md#target)
* [widthValue](forceelementsizeoptions.md#optional-widthvalue)

## Properties

### `Optional` forceHeight

• **forceHeight**? : *boolean*

Force body width to `heightValue`.

**`defaultvalue`** true

___

### `Optional` forceWidth

• **forceWidth**? : *boolean*

Force body width to `widthValue`.

**`defaultvalue`** true

___

### `Optional` heightValue

• **heightValue**? : *number | string*

The height to override.

**`defaultvalue`** 'auto'

___

### `Optional` shouldThrowWhenNotFound

• **shouldThrowWhenNotFound**? : *boolean*

When no element is found matching the target, should the script raise an
error?

**`defaultvalue`** false

___

###  target

• **target**: *[DOMElementRequest](../index.md#domelementrequest)*

The element to target.

___

### `Optional` widthValue

• **widthValue**? : *number | string*

The width to override.

**`defaultvalue`** 'auto'
