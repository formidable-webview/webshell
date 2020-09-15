---
id: "linkpresstarget"
title: "Interface: LinkPressTarget"
sidebar_label: "LinkPressTarget"
hide_title: "true"
---

# Interface: LinkPressTarget

The target of a link press event.

## Hierarchy

* **LinkPressTarget**

## Index

### Properties

* [clickedAnchorBoundingRect](linkpresstarget.md#clickedanchorboundingrect)
* [hrefAttribute](linkpresstarget.md#hrefattribute)
* [page](linkpresstarget.md#page)
* [scheme](linkpresstarget.md#scheme)
* [uri](linkpresstarget.md#uri)

## Properties

###  clickedAnchorBoundingRect

• **clickedAnchorBoundingRect**: *[DOMRect](domrect.md)*

The bounding rectangle of the anchor which has been clicked.
See [Element.getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

___

###  hrefAttribute

• **hrefAttribute**: *string*

The exact content of the `href` attribute.

___

###  page

• **page**: *object*

An object describing the page location from which the click originated.

#### Type declaration:

* **href**: *string*

* **origin**: *string | null*

___

###  scheme

• **scheme**: *string*

The URI scheme.

___

###  uri

• **uri**: *string*

The full URI of the target.
