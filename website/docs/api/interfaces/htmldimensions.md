---
id: "htmldimensions"
title: "Interface: HTMLDimensions"
sidebar_label: "HTMLDimensions"
hide_title: "true"
---

# Interface: HTMLDimensions

An object describing various dimensions of the HTML layout.

**`remarks`** 
This object units are in CSS pixels. CSS pixels match device pixels when the
web page has a `‹meta name="viewport" content="width=device-width" /›` tag.

## Hierarchy

* **HTMLDimensions**

## Index

### Properties

* [content](htmldimensions.md#content)
* [implementation](htmldimensions.md#implementation)
* [layoutViewport](htmldimensions.md#layoutviewport)

## Properties

###  content

• **content**: *[RectSize](rectsize.md)*

The content size, e.g. the size of the body element in CSS pixels.

___

###  implementation

• **implementation**: *[HTMLDimensionsImplementation](../index.md#htmldimensionsimplementation)*

Which implementation has been used to generate this event?
See [HTMLDimensionsImplementation](../index.md#htmldimensionsimplementation).

___

###  layoutViewport

• **layoutViewport**: *[RectSize](rectsize.md)*

The layout viewport size, e.g. the size of the WebView in device pixels.
