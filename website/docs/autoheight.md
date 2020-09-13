---
id: autoheight
sidebar_label: Autoheight WebView
title: Autoheight WebView
---
import { Subtitle } from './Subtitle.jsx';

<Subtitle>
Craft a Full-Featured, Dynamic Autoheight WebView-based component with <em>webshell</em>
</Subtitle>

:::tip

Read [Overcoming the Autoheight WebView
Challenge](/blog/2020/09/15/overcoming-the-autoheight-webview-challenge) to demystify all the magic behind this hook.

:::


<!-- <div data-snack-id="@jsamr/rnrhtml-font" data-snack-platform="web" data-snack-preview="true" data-snack-theme="light" style="overflow:hidden;background:#fafafa;border:1px solid rgba(0,0,0,.08);border-radius:4px;height:505px;width:100%"></div><script async src="https://snack.expo.io/embed.js"></script> -->

### Understanding the chain of constraints

This component height automatically and dynamically adapts to the page height,
even after DOM is mounted.

// TODO develop

Layout Width → Content Width → Content Height → Layout height

### Example

```ts file="../../integration/autoheight.tsx" title="integration/autoheight.tsx"
const tata = 1;
```

```ts
// integration/autoheight.tsx

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
  forceElementSizeFeature.assemble({ target: 'body' })
);

export type WebshellProps = ComponentProps<typeof Webshell>;

export default function AutoheightWebView(webshellProps: WebshellProps) {
  const { autoheightWebshellProps } = useAutoheight({ webshellProps });
  return <Webshell {...autoheightWebshellProps} />;
}

```

<a name="implementing-features"></a>

