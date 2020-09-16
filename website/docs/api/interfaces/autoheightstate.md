---
id: "autoheightstate"
title: "Interface: AutoheightState <S>"
sidebar_label: "AutoheightState"
hide_title: "true"
---

# Interface: AutoheightState &lt;S&gt;

The state returned by [useAutoheight](../index.md#useautoheight) hook.

## Type parameters

▪ **S**: *[WebshellProps](../index.md#webshellprops)&lt;[MinimalWebViewProps](minimalwebviewprops.md), [[AssembledFeatureOf](../index.md#assembledfeatureof)&lt;typeof handleHTMLDimensionsFeature&gt;]&gt;*

## Hierarchy

* **AutoheightState**

## Index

### Properties

* [autoheightWebshellProps](autoheightstate.md#autoheightwebshellprops)
* [contentSize](autoheightstate.md#contentsize)
* [resizeImplementation](autoheightstate.md#resizeimplementation)
* [syncState](autoheightstate.md#syncstate)

## Properties

###  autoheightWebshellProps

• **autoheightWebshellProps**: *Pick&lt;S, "onDOMHTMLDimensions" | "style" | "scalesPageToFit" | "showsVerticalScrollIndicator" | "disableScrollViewPanResponder"&gt; & Partial&lt;S&gt;*

The props to inject into webshell in order to support "autoheight"
behavior.

___

###  contentSize

• **contentSize**: *Partial&lt;[RectSize](rectsize.md)&gt;*

An object describing the content size. When the size is not yet known,
this object fields will be undefined.

___

###  resizeImplementation

• **resizeImplementation**: *[HTMLDimensionsImplementation](../index.md#htmldimensionsimplementation) | null*

The implementation used to generate resize events.

___

###  syncState

• **syncState**: *[AutoheightSyncState](../index.md#autoheightsyncstate)*

The state of synchronization between viewport and content size:

- init: the initial, "onMount" state;
- syncing: the content size is being determined;
- synced: the viewport size has been adjusted to content size.
