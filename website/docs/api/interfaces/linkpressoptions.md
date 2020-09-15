---
id: "linkpressoptions"
title: "Interface: LinkPressOptions"
sidebar_label: "LinkPressOptions"
hide_title: "true"
---

# Interface: LinkPressOptions

An object describing customization for the linkPress feature.

## Hierarchy

* **LinkPressOptions**

## Index

### Properties

* [ignoreHashChange](linkpressoptions.md#optional-ignorehashchange)
* [preventDefault](linkpressoptions.md#optional-preventdefault)

## Properties

### `Optional` ignoreHashChange

• **ignoreHashChange**? : *boolean*

Don't trigger an event when the target `href` is inside the page, e.g.
`#top`. See also [handleHashChangeFeature](../index.md#const-handlehashchangefeature).

**`defaultvalue`** true

___

### `Optional` preventDefault

• **preventDefault**? : *boolean*

Prevent click events on anchors to propagate.

**`defaultvalue`** true
