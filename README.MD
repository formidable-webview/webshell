[![npm](https://img.shields.io/npm/v/@formidable-webview/webshell)](https://www.npmjs.com/package/@formidable-webview/webshell)
[![semver](https://img.shields.io/badge/semver-2.0.0-e10079.svg)](https://semver.org/spec/v2.0.0.html)
[![codecov](https://codecov.io/gh/formidable-webview/webshell/branch/master/graph/badge.svg)](https://codecov.io/gh/formidable-webview/webshell)
[![CI](https://github.com/formidable-webview/webshell/workflows/CI/badge.svg?branch=master)](https://github.com/formidable-webview/webshell/actions?query=branch%3Amaster+workflow%3ACI)

# @formidable-webview/webshell

:fire: Augment React Native WebViews with DOM features (written in Typescript
:blue_heart:)

## Wait, what?

`@formidable-webview/webshell` exports a simple builder-function (HOC) which
creates an augmented `WebView` with additional DOM-based features. The returned
component behaves exactly like a `WebView`, and given a `ref` prop, you'll get
the underlying [`WebView`](https://github.com/react-native-community/react-native-webview) instance and be able to access its imperative methods.

The DOM features form an abstraction layer over [`WebView`'s messaging
system](https://github.com/react-native-community/react-native-webview/blob/master/docs/Guide.md#communicating-between-js-and-native),
hence the “shell” in `Webshell`. Each DOM feature augments the `WebView` with a
DOM message handler prop, for example `omDOMLinkPress`. Here are examples of
features you can assemble in the shell:

- Intercept click events on anchors and prevent navigation (`linkPressFeature`);
- Get notified when an element size changes in the view (`elementDimensionsFeature`);

And you can, of course, [implement any DOM feature you'd
like](#implementing-features). This library also presents a set of good
practices to test features in isolation and, by extension, test any injected
scripts. See [the tooling section](#tooling).

## How does it work?

It uses `WebView.injectedJavascript` prop to inject JavaScript “features”
(snippets) responsible for communicating information to the `Webshell`
controller through DOM handlers. Each DOM feature is try-caught in siloed
error-flows. You can still use `injectedJavascript`, `Webshell` will pass it to
`Webview`. More details on how to implement features in the [dedicated
section](#implementing-features).

## Install

```sh
# With npm
npm add --save @formidable-webview/webshell
# With yarn
yarn add @formidable-webview/webshell
```

## Basic usage

This library is fairly easy to use. Just create a shell by invoking
`makeWebshell` function with a `WebView` component and the assembled features
you wish the shell to implement. Each DOM feature can be assembled with
options, which alter their behavior. For example, the `linkPressFeature`
default behavior prevents click events on anchors to propagate, effectively
disallowing redirects. You can, however, change this behavior to let redirects
happen while still being notified by setting `preventDefault` option to
`false`.

```ts
// integration/basic.tsx

import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import makeWebshell, {
  handleLinkPressFeature,
  handleHTMLDimensionsFeature,
  HTMLDimensions,
  LinkPressTarget
} from '@formidable-webview/webshell';
import WebView, { WebViewProps } from 'react-native-webview';

const Webshell = makeWebshell(
  WebView,
  handleLinkPressFeature.assemble({ preventDefault: true }),
  handleHTMLDimensionsFeature.assemble()
);

export default function EnhancedWebView(webViewProps: WebViewProps) {
  const onLinkPress = useCallback((target: LinkPressTarget) => {
    Linking.canOpenURL(target.uri) && Linking.openURL(target.uri);
  }, []);
  const onBodyDimensions = useCallback(
    ({ content: { height } }: HTMLDimensions) =>
      console.info('Content has height of', height),
    []
  );
  return (
    <Webshell
      onDOMLinkPress={onLinkPress}
      onDOMHTMLDimensions={onBodyDimensions}
      {...webViewProps}
    />
  );
}

```

## Craft a Full-Featured, Dynamic AutoheightWebView

### Understanding the chain of constraints

This component height automatically and dynamically adapts to the page height,
even after DOM is mounted.

// TODO develop

Layout Width → Content Width → Content Height → Layout height

### Example

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

## Implementing features

To have a good sense on how to make new features, we will take a look at the
`linkPressFeature` implementation. The implementation is in typescript, which
is convenient to communicate the different types implied in a DOM feature. There
are four important areas to specify in such feature:

1. How does it behave in the DOM? → See the content of `linkPressScript`.
2. What options can it be assembled with? → `LinkPressOptions`
3. What is the name of the DOM message handler prop which will be available in the
   `Webshell`? → `onDOMLinkPress`
4. What type of payload does it ship with events? → `string`

> :warning: Note that you will need to replace relative imports with direct
> imports from the library,
>
> `import {...} from "@formidable-webview/webshell";`

```ts
// src/features/handle-link-press.ts

import linkPressScript from './handle-link-press.webjs';
import { makeFeature } from '../make-feature';
import type { EventFeatureOf, DOMRect } from '../types';

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

  /**
   * Don't trigger an event when the target `href` is inside the page, e.g.
   * `#top`. See also {@link handleHashChangeFeature}.
   *
   * @defaultValue true
   */
  ignoreHashChange?: boolean;
}

/**
 * The target of a link press event.
 *
 * @public
 */
export interface LinkPressTarget {
  /**
   * The full URI of the target.
   */
  uri: string;
  /**
   * The URI scheme.
   */
  scheme: string;
  /**
   * The exact content of the `href` attribute.
   */
  hrefAttribute: string;
  /**
   * The bounding rectangle of the anchor which has been clicked.
   * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect | Element.getBoundingClientRect()}
   */
  clickedAnchorBoundingRect: DOMRect;
  /**
   * An object describing the page location from which the click originated.
   */
  page: {
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/origin}.
     *
     * @remarks
     * Has the special value `null` when not bound to a URL (`{ html }` source).
     */
    origin: string | null;
    /**
     * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Location/href}.
     *
     * @remarks
     * Has the special value `about:blank` when not bound to a URL (`{ html }` source).
     */
    href: string;
  };
}

/**
 * This feature allows to intercept clicks on anchors (`<a>`). By default, it
 * will prevent the click from propagating. But you can disable this option.
 *
 * @public
 */
export const handleLinkPressFeature: EventFeatureOf<
  LinkPressOptions,
  'onDOMLinkPress',
  LinkPressTarget
> = makeFeature({
  script: linkPressScript,
  eventHandlerName: 'onDOMLinkPress',
  featureIdentifier: 'org.formidable-webview/webshell.link-press'
});

```

The behavior in the DOM is implemented in the following file (please note that
the extension is arbitrary, see the [tooling section](#tooling)):

```js
// src/features/handle-link-press.webjs

function handleLinkPressFeature(context) {
  var postMessage = context.postMessage;
  var options = context.options || {};
  var preventDefault = options.preventDefault !== false;
  var ignoreHashChange =
    typeof options.ignoreHashChange === 'boolean'
      ? options.ignoreHashChange
      : true;

  function findParent(tagname, el) {
    while (el) {
      if ((el.nodeName || el.tagName).toLowerCase() === tagname.toLowerCase()) {
        return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  function extractScheme(uri) {
    var groups = uri.match(/(\w+):\/\//);
    return (groups && groups.length > 1 && groups[1]) || '';
  }

  var interceptClickEvent = context.makeCallbackSafe(function (e) {
    var target = e.target || e.srcElement;
    var anchor = findParent('a', target);
    if (anchor) {
      var href = anchor.href;
      if (
        ignoreHashChange &&
        anchor.origin === window.location.origin &&
        anchor.pathname === window.location.pathname
      ) {
        return;
      }
      var rect = anchor.getBoundingClientRect();
      var clickedAnchorBoundingRect = {
        top: rect.top,
        left: rect.left,
        bottom: rect.bottom,
        right: rect.right,
        width: rect.width,
        height: rect.height
      };
      preventDefault && e.preventDefault();
      postMessage({
        uri: href,
        scheme: extractScheme(href),
        hrefAttribute: anchor.getAttribute('href'),
        clickedAnchorBoundingRect: clickedAnchorBoundingRect,
        page: {
          href: window.location.href,
          origin: window.location.origin
        }
      });
    }
  });
  document.addEventListener('click', interceptClickEvent);
}

```

**Every DOM script top declaration must be a function** taking one argument.
The shape of this argument is depicted in
[WebjsContext](docs/webshell.webjscontext.md) definition. For wide
compatibility purposes, it is recommended to

- enforce ECMAScript 5 syntax with ESlint;
- lint the script with the
  [eslint-plugin-compat](https://www.npmjs.com/package/eslint-plugin-compat) to
  enforce backward compatibility with old engines;
- unit-test with jest jsdom environment;

See the [tooling section](#tooling) for more details on how to achieve this.

## API Reference

The API reference is build with the amazing [@microsoft/api-extractor](https://api-extractor.com/) utility.
Read the API here: [**docs/webshell.md**](./docs/webshell.md).

Landmark exports:

- [`makeWebshell`](docs/webshell.makewebshell.md)
- [`makeFeature`](docs/webshell.makefeature.md)
- [`elementDimensionsFeature`](docs/webshell.dimensionsfeature.md)
- [`linkPressFeature`](docs/webshell.linkpressfeature.md)

<a name="tooling"></a>

## Tooling

The objectives of the setup are:

- Import DOM scripts (`.webjs`) as strings;
- Statically check DOM scripts for syntax errors;
- Statically check DOM scripts compatibility given targeted WebViews versions;
- Test the DOM scripts behaviors.

### Babel

To import `.webjs` files as strings, we will use
[`babel-plugin-inline-import`](https://www.npmjs.com/package/babel-plugin-inline-import)
with `webjs` or whichever extension you are using for your `WebView` scripts,
see [babel.config.js](babel.config.js) file. This plugin will allow you to
import scripts as strings instead of compiling the module!

### ESLint

You can use
[@formidable-webview/eslint-config-webjs](https://github.com/formidable-webview/eslint-config-webjs)
to target `.webjs` files with specific config:

- Enforce ECMAScript 5 to make sure it runs on reasonably old `WebView`
  backends.
- Enforce a list of supported web engines with the outstanding
  [eslint-plugin-compat](https://www.npmjs.com/package/eslint-plugin-compat).
  We make sure we don't use recent web APIs without a fallback or polyfill.

### Jest

To test injected scripts, the easiest way is to use
[`@formidable-webview/ersatz`](https://github.com/formidable-webview/ersatz).
Best to show with an example of our link-press DOM feature testing:

> :warning: Note that you will need to replace relative imports with direct
> imports from the library,
>
> `import {...} from "@formidable-webview/webshell";`

```ts
// src/features/__tests__/handle-link-press.test.tsx

import * as React from 'react';
import Ersatz from '@formidable-webview/ersatz';
import makeErsatzTesting from '@formidable-webview/ersatz-testing';
import { render } from '@testing-library/react-native';
import { makeWebshell } from '../../make-webshell';
import { handleLinkPressFeature, LinkPressTarget } from '../handle-link-press';

const { waitForDocument } = makeErsatzTesting(Ersatz);

describe('Webshell with handleLinkPressFeature', () => {
  it('should invoke onDOMLinkPress prop when a link is pressed', async () => {
    const onDOMLinkPress = jest.fn();
    const Webshell = makeWebshell(Ersatz, handleLinkPressFeature.assemble());
    const document = await waitForDocument(
      render(
        <Webshell
          onDOMLinkPress={onDOMLinkPress}
          source={{ html: '<a id="anchor0" href="https://foo.org">bar</a>' }}
        />
      )
    );
    document.getElementById('anchor0').click();
    expect(onDOMLinkPress).toHaveBeenCalledWith({
      uri: 'https://foo.org/',
      scheme: expect.any(String),
      hrefAttribute: expect.any(String),
      clickedAnchorBoundingRect: {
        top: expect.any(Number),
        left: expect.any(Number),
        right: expect.any(Number),
        bottom: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number)
      },
      page: expect.any(Object)
    } as Record<keyof LinkPressTarget, any>);
  });
});

```

### Editor

The last thing you need to do is associate JavaScript syntax with the custom
extension you have chosen in your text editor. From now-on, you will have a full
featured QC in those scripts!

Finally, if you want Github to provide syntax highlight to you webjs files, see
our [.gitattributes](.gitattributes) file.
