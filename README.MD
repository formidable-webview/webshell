[![npm](https://img.shields.io/npm/v/@formidable-webview/webshell)](https://www.npmjs.com/package/@formidable-webview/webshell)
[![semver](https://img.shields.io/badge/semver-2.0.0-e10079.svg)](https://semver.org/spec/v2.0.0.html)
[![codecov](https://codecov.io/gh/formidable-webview/webshell/branch/master/graph/badge.svg)](https://codecov.io/gh/formidable-webview/webshell)
[![CI](https://github.com/formidable-webview/webshell/workflows/CI/badge.svg?branch=master)](https://github.com/formidable-webview/webshell/actions?query=branch%3Amaster+workflow%3ACI)

> :warning: *This library is in early development.*

# @formidable-webview/webshell

*Webshell is:*

- A Higher-order component to handle `WebView` DOM events in `react-native`. It
provides an abstraction layer over the [message
  system](https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native)
  embedded in
[`react-native-webview`](https://github.com/react-native-community/react-native-webview).
- A set of utilities and good practices to implement well-tested, reliable
scripts to run on the (`WebView`) DOM.

Here are examples of features shipped with this library:

- Intercept click events on anchors and prevent navigation (`linkPressFeature`);
- Get notified when an element size changes in the view (`dimensionsFeature`);

And you can, of course, implement any feature you'd like.

## How does it work?

It uses `WebView#injectedJavascript` prop to inject javascript “features” (snippets) responsible
for communicating information to the `Webshell` controller.

## Install

```sh
npm install @formidable-webview/webshell
```

## Basic usage

This library is fairly easy to use. Just create a shell by invoking `makeShell`
function with a `WebView` component and the assembled features you wish the
shell to implement. Each feature can be assembled with options, which alter
their behavior. For example, the `linkPressFeature` default behavior prevents
click events on anchors to propagate, effectively disallowing redirects. You
can, however, change this behavior to let redirects happen while still being
notified by setting `preventDefault` option to `false`.

```ts
// integration/basic.tsx

import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  linkPressFeature,
  dimensionsFeature,
  DimensionsObject
} from '@formidable-webview/webshell';
import WebView from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  linkPressFeature.assemble({ preventDefault: true }),
  dimensionsFeature.assemble({ tagName: 'table' })
);

export default function EnhancedWebView(webViewProps) {
  const onLinkPress = useCallback((url: string) => Linking.openURL(url), []);
  const onDimensions = useCallback(
    ({ width, height }: DimensionsObject) => console.info(width, height),
    []
  );
  const onShellError = useCallback(
    // featureIdentifier == linkPressFeature.identifier
    (featureIdentifier, errorMessage) => {
      if (featureIdentifier === linkPressFeature.identifier) {
        // Handle linkPress error
        console.error(errorMessage);
      } else if (featureIdentifier === dimensionsFeature.identifier) {
        // Handle dimensions error
        console.error(errorMessage);
      }
    },
    []
  );
  return (
    <Webshell
      onLinkPress={onLinkPress}
      onDimensions={onDimensions}
      onShellError={onShellError}
      webViewProps={webViewProps}
    />
  );
}

```

## Implementing features

To have a good sense on how to implement features, we will take a look at the
`linkPressFeature` implementation. The implementation is in typescript, which
is convenient to communicate the different types implied in a feature. There
are four important areas to specify in a feature:

1. How does it behave in the DOM? → See the content of `linkPressScript`.
2. What options can it be assembled with? → `LinkPressOptions`
3. What is the name of the event handler prop which will be available in the
   `Webshell`? → `onLinkPress`
4. What type of payload does it ship with events? → `string`

```ts
// src/features/link-press.ts

import linkPressScript from './link-press.webjs';
import { makeFeature } from '../make-feature';
import type { Feature } from '../types';

/**
 * An object describing customization for the linkPress feature.
 *
 * @public
 */
export interface LinkPressOptions {
  /**
   * Prevent click events on anchors to propagate.
   *
   * @defaultValue true
   */
  preventDefault?: boolean;
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const linkPressFeature: Feature<
  LinkPressOptions,
  'onLinkPress',
  string
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onLinkPress',
  identifier: 'org.webshell.linkPress'
});

```

> :warning: Please note that you will need to replace `import ... from`.

The behavior in the DOM is implemented in the following file (please note that
the extension is arbitrary, see the [tooling section](#tooling)):

```js
// src/features/link-press.webjs

function linkPressFeature(arg) {
  var postMessage = arg.postMessage;
  var options = arg.options || {};
  var preventDefault = options.preventDefault !== false;

  function findParent(tagname, el) {
    while (el) {
      if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  function interceptClickEvent(e) {
    var href;
    var target = e.target || e.srcElement;
    var anchor = findParent('a', target);
    if (anchor) {
      href = anchor.getAttribute('href');
      preventDefault && e.preventDefault();
      postMessage(href);
    }
  }
  document.addEventListener('click', interceptClickEvent);
}

```

**Every DOM script top declaration must be a function** taking one argument.
The shape of this argument is depicted in
[WebjsContext](doc/webshell.webjscontext.md) definition. For wide
compatibility purposes, it is recommended to

- enforce ECMAScript 5 syntax;
- lint the script with the eslint compat plugin to enforce backward compatibility with
  old engines;
- unit-test with jest jsdom environment;

See the [tooling section](#tooling) for more details on how to achieve this.

## API Reference

The API reference is build with the amazing [@microsoft/api-extractor](https://api-extractor.com/) utility.
Read the API here: [**doc/webshell.md**](./doc/webshell.md).

<a name="tooling"></a>

## Tooling

The original idea behind this project was to perform code quality control over
scripts injected into `WebViews`, because they are parts of the codebase. To
achieve that purpose, we are using babel and eslint original plugins.

### babel

The most important thing is to use [Babel Inline
Import](https://www.npmjs.com/package/babel-plugin-inline-import) with `webjs`
or whichever extension you are using for your `WebView` scripts, see
[babel.config.js](babel.config.js) file. This plugin will allow you to import
scripts as strings instead of compiling the module!

### eslint

We are using the `overrides` feature to target `webjs` files with specific
options:

- Enforce ECMAScript 5 to make sure it runs on reasonably old `WebView`
  backends.
- Enforce a list of supported browsers with the outstanding
  [compat plugin](https://www.npmjs.com/package/eslint-plugin-compat). We make
  sure we don't use recent web APIs without a fallback or polyfill.

See our [.eslintrc.js](.eslintrc.js) file.

### Jest

Jest will use our babel config file if `babel-jest` is installed. The most
important aspect of our jest setup is that it has two configurations:

- One to test our React Native code, which will use the `react-native` preset,
  [core.jest.config.js](core.jest.config.js);
- One to test our DOM scripts, which will use the `jsdom` testing environment,
  [web.jest.config.js](core.jest.config.js).

To run jest with multiple configurations, you just need to [set the projects
attribute as an array of config
files](https://stackoverflow.com/a/47209803/2779871).

### Editor

The last thing you need to do is associate Javascript syntax with the custom
extension you have chosen in your text editor. From now-on, you will have a full
featured QC in those scripts!
