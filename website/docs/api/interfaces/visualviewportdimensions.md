---
id: "visualviewportdimensions"
title: "Interface: VisualViewportDimensions"
sidebar_label: "VisualViewportDimensions"
hide_title: "true"
---

# Interface: VisualViewportDimensions

An object describing the visual viewport of the `WebView`.

## Hierarchy

* **VisualViewportDimensions**

## Index

### Properties

* [isLegacy](visualviewportdimensions.md#islegacy)
* [scale](visualviewportdimensions.md#scale)
* [visualViewport](visualviewportdimensions.md#visualviewport)

## Properties

###  isLegacy

• **isLegacy**: *boolean*

`false` when these values are coming from the VisualViewport API and
`true` when they are "best guess". In legacy mode, be warned that you will
not receive frequent updates when the user pinch-zoom.

___

###  scale

• **scale**: *number*

The visual viewport scale. Because this API is quite recent, we have a
fallback strategy to compute scale.

**`remarks`** 
The other values in this object are already in React Native dpi units.

___

###  visualViewport

• **visualViewport**: *[RectSize](rectsize.md)*

window.visualViewport.width and window.visualViewport.height
