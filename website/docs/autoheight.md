---
id: autoheight
sidebar_label: useAutoheight
title: useAutoheight
---
import { Subtitle } from './Subtitle.jsx';

<Subtitle>
Craft a Full-Featured, Dynamic Autoheight WebView-based component.
</Subtitle>

:::tip

Read [Overcoming the Autoheight WebView
Challenge](/blog/2020/09/15/overcoming-the-autoheight-webview-challenge) to demystify all the magic behind this hook.

:::

This component height automatically and dynamically adapts to the page height,
even after DOM is mounted.


## Basic Usage

<!-- embedme ../../integration/autoheight.tsx -->

```ts title="autoheight.tsx"
import React, { ComponentProps } from 'react';
import makeWebshell, {
  handleHTMLDimensionsFeature,
  forceResponsiveViewportFeature,
  forceElementSizeFeature,
  useAutoheight
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleHTMLDimensionsFeature.assemble(),
  forceResponsiveViewportFeature.assemble({ maxScale: 2 }),
  forceElementSizeFeature.assemble({
    target: 'body',
    heightValue: 'auto',
    widthValue: 'auto'
  })
);

export type WebshellProps = ComponentProps<typeof Webshell>;

export default function AutoheightWebView(webshellProps: WebshellProps) {
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  return <Webshell {...autoheightWebshellProps} />;
}

```

## Recommended Features

## Understanding the chain of constraints

// TODO develop

Layout Width → Content Width → Content Height → Layout height

