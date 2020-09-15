---
id: introduction
title: Introduction
slug: /
---

import {Webshell} from './Webshell';
import {Term} from './Term';

## Motivations

With React Native becoming an incredibly popular framework to build mobile
applications, the `WebView` component has become a central piece for many
applications relying on web contents. This has lead a great deal of packages to
be published built on the `WebView` component; each being incompatible with one
another.

:::note Design Goal
The ultimate goal of <Webshell /> is to reconcile all those scattered features
by providing a universal tool to craft WebView-based components.
:::

## Prerequisites

To have a good understanding of this library capabilities, you are highly encouraged, if not already, to familiarize with the following:

- React <Term id="hoc" title="Higher Order Components"/> (HOC);
- React <Term id="hooks"/>;
- <Term id="dom" title="Document Object Model"/> (DOM).

## Compatibility

The <Webshell /> requires React Native 0.59+ and strongly recommends the most up to date version of [react-native-webview](https://github.com/react-native-community/react-native-webview).
