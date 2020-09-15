---
id: basic-concepts
title: Basic Concepts
---

import {Webshell} from './Webshell';
import {Term} from './Term';

## What is a Feature?

In the context of <Webshell />, a feature is like a plugin. It encapsulates
behaviors injectable into `WebViews`. More precisely, a feature can do the
following things:

- Alter the content of the <Term id="DOM" />;
- Inject behaviors through scripts in the <Term id="DOM" />;
- Add handler props to the `WebView` component in order to react to specific events.

## What is a Shell?

This library exposes one landmark function, `makeWebshell`, a <Term id="HOC"/>
which **augments** a `WebView` passed as first argument with features passed
as remaining arguments.

Because these features are customizable, the API requires you to assemble those
features by invoking the `assemble` method for each of these features, passing
optionally an object of options. In the bellow snippet, we are creating a
component which augments `WebView` with two features, but in reality any number
of features could be passed!

```js
const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble()
);
```

:::note
We will use the word *shell* as an alias to the `Webshell` component produced
by `makeWebshell` function.
:::

The injected features will add two props to the shell, which already supports all `WebView` props:

- `onDOMLinkPress`
- `onDOMHTMLDimensions`

We will discuss those two features in details in the bellow example.

## Example

:::tip
This example is shown for didactic purposes. If you need an autoheight `WebView`, [read the dedicated guide](./autoheight.md).
:::

<!-- embedme ../../integration/basic.tsx -->

```tsx title="NaiveAutoheightWebView.tsx"
import React, { useCallback, useState } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  handleLinkPressFeature,
  handleHTMLDimensionsFeature,
  HTMLDimensions,
  LinkPressTarget,
  RectSize
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble()
);

export default function NaiveAutoheightWebView(webViewProps: WebViewProps) {
  const [size, setSize] = useState<RectSize | null>(null);
  const onLinkPress = useCallback((target: LinkPressTarget) => {
    Linking.canOpenURL(target.uri) && Linking.openURL(target.uri);
  }, []);
  const onHTMLDimensions = useCallback(
    ({ content: { height, width } }: HTMLDimensions) =>
      setSize({ width, height }),
    []
  );
  return (
    <Webshell
      onDOMLinkPress={onLinkPress}
      onDOMHTMLDimensions={onHTMLDimensions}
      {...webViewProps}
      style={[webViewProps.style, size]}
    />
  );
}

```
