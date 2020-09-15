---
id: "autoheightparams"
title: "Interface: AutoheightParams ‹**S**›"
sidebar_label: "AutoheightParams"
hide_title: "true"
---

# Interface: AutoheightParams ‹**S**›

Named parameters for autoheight hook.

## Type parameters

▪ **S**: *[WebshellProps](../index.md#webshellprops)‹[MinimalWebViewProps](minimalwebviewprops.md), []›*

## Hierarchy

* **AutoheightParams**

## Index

### Properties

* [initialHeight](autoheightparams.md#optional-initialheight)
* [reinitHeightOnViewportWidthChange](autoheightparams.md#optional-reinitheightonviewportwidthchange)
* [webshellProps](autoheightparams.md#webshellprops)
* [width](autoheightparams.md#optional-width)

## Properties

### `Optional` initialHeight

• **initialHeight**? : *number*

The height occupied by the `WebView` prior to knowing its content height.
It will be reused each time the source changes.

**`defaultvalue`** 0

___

### `Optional` reinitHeightOnViewportWidthChange

• **reinitHeightOnViewportWidthChange**? : *boolean*

When a width change is detected on viewport, the height of the `WebView`
will be set to `undefined` for a few milliseconds. This will allow the
best handling of height constraint in edge-cases with, for example,
content expanding vertically (display: flex), at the cost of a small flash.

**`defaultvalue`** true

___

###  webshellProps

• **webshellProps**: *S*

It's best to pass all props directed to `Webshell` here. This is
advised because the hook might react to specific props and warn you of
some incompatibilities.

___

### `Optional` width

• **width**? : *number*

By default, the width of `Webshell` will grow to the horizontal space available.
This is realized with `width: '100%'` and `alignSelf: 'stretch'`.
If you need to set explicit width, do it here.
