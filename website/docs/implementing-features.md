---
id: implementing-features
title: Implementing Features
---


To have a good sense on how to make new features, we will take a look at the
`linkPressFeature` implementation. The implementation is in typescript, which
is convenient to communicate the different types implied in a DOM feature. There
are four important areas to specify in such feature:

1. How does it behave in the DOM? → See the content of `linkPressScript`.
2. What options can it be assembled with? → `LinkPressOptions`
3. What is the name of the DOM message handler prop which will be available in the
   `Webshell`? → `onDOMLinkPress`
4. What type of payload does it ship with events? → `string`

:::caution
Note that you will need to replace relative imports with direct imports from the library:

`import {...} from "@formidable-webview/webshell";`
:::

```tsx
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
