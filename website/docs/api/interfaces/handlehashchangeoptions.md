---
id: "handlehashchangeoptions"
title: "Interface: HandleHashChangeOptions"
sidebar_label: "HandleHashChangeOptions"
hide_title: "true"
---

# Interface: HandleHashChangeOptions

An object describing customization for the hash change feature.

## Hierarchy

* **HandleHashChangeOptions**

## Index

### Properties

* [shouldResetHashOnEvent](handlehashchangeoptions.md#optional-shouldresethashonevent)

## Properties

### `Optional` shouldResetHashOnEvent

• **shouldResetHashOnEvent**? : *boolean*

Reset the hash to the empty string after triggering the event.
This is recommended if you want to make sure any upcoming link press on
an anchor with a local hash `href` will trigger the `hashchange` event.

**`defaultvalue`** false
