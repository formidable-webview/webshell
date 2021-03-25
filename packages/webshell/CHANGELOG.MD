# [2.5.0](https://github.com/formidable-webview/webshell/compare/v2.4.0...v2.5.0) (2021-03-25)


### Features

* better `useAutoheight` debugging experience regarding incompatible WebView props ([29d251a](https://github.com/formidable-webview/webshell/commit/29d251a40e5126e38d96d29a2a1c215064a99e69))

# [2.4.0](https://github.com/formidable-webview/webshell/compare/v2.3.0...v2.4.0) (2021-02-19)


### Bug Fixes

* only warn only when `forceImplementation` isn't set to polling ([949fffb](https://github.com/formidable-webview/webshell/commit/949fffb95af84af814df5b65c9d6dd16a2b3d2b5))
* set WebView `contentMode` prop to `"mobile"` ([3f57d62](https://github.com/formidable-webview/webshell/commit/3f57d6277f24ce63dee8ca8490bc6fafb0de9975)), closes [/github.com/formidable-webview/webshell/issues/5#issuecomment-782358464](https://github.com//github.com/formidable-webview/webshell/issues/5/issues/issuecomment-782358464) [#5](https://github.com/formidable-webview/webshell/issues/5)


### Features

* new `InjectStyleFeature` feature to inject style elements ([23138b8](https://github.com/formidable-webview/webshell/commit/23138b85be7debd4a97613f6744ca6953453539a))
* new `listenToWindowResizeEvent` option for html dimensions feature ([5e7cba7](https://github.com/formidable-webview/webshell/commit/5e7cba73c48e7d69943401edfb31bd7793fe528d))

# [2.3.0](https://github.com/formidable-webview/webshell/compare/v2.2.0...v2.3.0) (2021-02-06)


### Bug Fixes

* unecessary re-renders caused by misusage of hooks deps ([9b1d579](https://github.com/formidable-webview/webshell/commit/9b1d579fe82d2df03a658beaff14a6e5c02d6686)), closes [#5](https://github.com/formidable-webview/webshell/issues/5)


### Features

* add anchor attributes to payload in HandleLinkPressFeature ([e2ff35e](https://github.com/formidable-webview/webshell/commit/e2ff35e325b44fd5ae9b417fa914741a77271590)), closes [#8](https://github.com/formidable-webview/webshell/issues/8)

# [2.2.0](https://github.com/formidable-webview/webshell/compare/v2.1.1...v2.2.0) (2020-12-04)


### Features

* new options for ForceResponsiveViewportFeature ([6141e8a](https://github.com/formidable-webview/webshell/commit/6141e8a574fa66b3d5eecf6837a84ce6ac175c3b))

## [2.1.1](https://github.com/formidable-webview/webshell/compare/v2.1.0...v2.1.1) (2020-12-04)

# [2.1.0](https://github.com/formidable-webview/webshell/compare/v2.0.2...v2.1.0) (2020-12-04)


### Features

* new `useWebshell` hook, which extracts the logic of `makeWebshell` HOC ([1325968](https://github.com/formidable-webview/webshell/commit/1325968c5c24a9fd589c34f6194bf5e1180f03eb))

## [2.0.2](https://github.com/formidable-webview/webshell/compare/v2.0.1...v2.0.2) (2020-11-25)


### Bug Fixes

* crash on iOS 9 (attempting to change configurable...) ([177e96b](https://github.com/formidable-webview/webshell/commit/177e96bee3f6ff67811abeb890991665ef01e6be)), closes [#3](https://github.com/formidable-webview/webshell/issues/3)

## [2.0.1](https://github.com/formidable-webview/webshell/compare/v2.0.0...v2.0.1) (2020-10-09)

### Misc

- Add README to bundle

# [2.0.0](https://github.com/formidable-webview/webshell/compare/v1.0.2...v2.0.0) (2020-10-08)

This is a major release with a good amount of breaking changes, but also many exciting new features. We commit to having much less breaking releases in the future. [We also have a brand new website](https://formidable-webview.github.io/webshell/).

### Code Refactoring

* features are now classes and must be built with `FeatureBuilder` ([d028853](https://github.com/formidable-webview/webshell/commit/d028853b964d55d4b0fa83d59fecb7591c6f7f48))
* `makeWebshell` now takes feature instances ([ed28385](https://github.com/formidable-webview/webshell/commit/ed28385a21f14b735a335a9b6141064e7d3ebc64))

### Features

* support sending messages from shell to Web ([a76d3b4](https://github.com/formidable-webview/webshell/commit/a76d3b4daaa39f1bc726f9bf566d700527d21cb4))
* support for multiple handlers in a single feature ([9313f07](https://github.com/formidable-webview/webshell/commit/9313f07a038ec1029721ea10cf473723f7f5687a))
* new methods for `WebjsContext` interface ([bfdc409](https://github.com/formidable-webview/webshell/commit/bfdc40990e1d35a9029d2c8f5ec249786d6372fc))
* new `webshellStrictMode` prop to raise errors on inconsistencies ([81273be](https://github.com/formidable-webview/webshell/commit/81273be0cd5129ca34a069ffff7d146e892658a0))
* new `useAutoheight` hook ([dc9842d](https://github.com/formidable-webview/webshell/commit/dc9842dd9107d1c292cd65337d42f23672432943))
* new Web feature `ForceElementSizeFeature` ([f715b5f](https://github.com/formidable-webview/webshell/commit/f715b5f17cd2b318849dd73fa18c9078f2991414))
* new Web feature `ForceResponsiveViewportFeature` ([25ed358](https://github.com/formidable-webview/webshell/commit/25ed358e9370effc01575b34a54f2ad7498b7452))
* new Web feature `HandleElementCSSBoxFeature` ([873d646](https://github.com/formidable-webview/webshell/commit/873d6468fb5e5a9e1fbf807acd52ecb307d5c07f))
* new Web feature `HandleHashChangeFeature` ([9b7c47a](https://github.com/formidable-webview/webshell/commit/9b7c47a94fcb5c1f3fc751786f7d8f863ceeab39))
* new Web feature `HandleHTMLDimensionsFeature` ([7a158d9](https://github.com/formidable-webview/webshell/commit/7a158d9453d623757dc4daa436e14e9ef7ce8c1e))
* new Web feature `HandleLinkPressFeature` ([6da2358](https://github.com/formidable-webview/webshell/commit/6da23584481d0c93d53febaab0c75a53c9659da5))
* new Web `HandleVisualViewportFeature` ([0577cbf](https://github.com/formidable-webview/webshell/commit/0577cbf304b57d0be75bc3cc7fde758d230fda31))

### BREAKING CHANGES

* `handleLinkPressFeature` has been replaced with
`HandleLinkPressFeature`, its instanciable counterpart. Also, the shape of
the sent message has changed, and is now an object with a variety of
useful information. Finally, this implementation uses the element
instance `href` field instead of the `href` attribute, which could contain
relative paths. It is thus more accurate.
* `elementSizeFeature` has been replaced with its
instanciable counterpart, `HandleElementCSSBoxFeature`. If you need the
whole document size, consider HandleHTMLDimensionsFeature.
* `makeWebshell` now requires to provide a list of Feature
instances instead of the result of feature `assemble` members.
* `makeFeature` has been dropped in favor of
`FeatureBuilder`. Also, feature bust now be instantiated instead of
calling `assemble` member. All imports must be upper-cased.
Implementing feature is documented here:
https://formidable-webview.github.io/webshell/docs/implementing-features
* rename `WebjsContext.postMessage` to `postMessageToShell`
* replace `onDOMError` with `onWebFeatureError` ([2dacca5](https://github.com/formidable-webview/webshell/commit/2dacca5ed57b75e9ffada208de3871be08288f9a))

## [1.0.2](https://github.com/formidable-webview/webshell/compare/v1.0.1...v1.0.2) (2020-08-20)

## [1.0.1](https://github.com/formidable-webview/webshell/compare/v1.0.0...v1.0.1) (2020-08-19)

# [1.0.0](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.0...v1.0.0) (2020-08-19)

Initial release.
