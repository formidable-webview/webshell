---
id: "elementcssboxdimensions"
title: "Interface: ElementCSSBoxDimensions"
sidebar_label: "ElementCSSBoxDimensions"
hide_title: "true"
---

# Interface: ElementCSSBoxDimensions

An object describing an element CSS Box dimensions, see
[CSS 2 (Box model)](https://drafts.csswg.org/css2/#box-model).

**`remarks`** 

This object scalar units are CSS pixels.

## Hierarchy

* **ElementCSSBoxDimensions**

## Index

### Properties

* [borderBox](elementcssboxdimensions.md#borderbox)
* [computedStyle](elementcssboxdimensions.md#computedstyle)
* [horizontalScrollbarWidth](elementcssboxdimensions.md#horizontalscrollbarwidth)
* [scrollBox](elementcssboxdimensions.md#scrollbox)
* [verticalScrollbarWidth](elementcssboxdimensions.md#verticalscrollbarwidth)

## Properties

###  borderBox

• **borderBox**: *[CSSBox](cssbox.md)*

The border box as specified in the
[CSS Box Model](https://drafts.csswg.org/css-box-3/#valdef-box-border-box).

**`remarks`** 
Margin, padding and content boxes can be derived from
[ElementCSSBoxDimensions.computedStyle](elementcssboxdimensions.md#computedstyle).

___

###  computedStyle

• **computedStyle**: *[CSSBoxDimensionsComputedStyle](cssboxdimensionscomputedstyle.md)*

The computed box style. See
[window.getComputedStyle()](https://developer.mozilla.org/docs/Web/API/Window/getComputedStyle).

**`remarks`** 
Be aware that the computed vertical margins might collapse in the
viewport. See
[CSS 2 (collapsing margins)](https://drafts.csswg.org/css2/#collapsing-margins)

___

###  horizontalScrollbarWidth

• **horizontalScrollbarWidth**: *number*

The width of the horizontal scrollbar.

**`remarks`** 
In the CSS Box model, scrollbars are part of the content box.

___

###  scrollBox

• **scrollBox**: *[CSSBox](cssbox.md)*

A box formed by `scrollWidth` and `scrollHeight` element properties.

**`remarks`** 
The box is formed with all the space occupied by element's children, even
when overflowing. The element padding, border and scrollbar are not
counted. See
[https://drafts.csswg.org/cssom-view/#dom-element-scrollwidth](https://drafts.csswg.org/cssom-view/#dom-element-scrollwidth),
`scrollWidth` and `scrollHeight` for a reference.

___

###  verticalScrollbarWidth

• **verticalScrollbarWidth**: *number*

The width of the vertical scrollbar.

**`remarks`** 
In the CSS Box model, scrollbars are part of the content box.
