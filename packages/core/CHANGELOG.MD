# [2.0.0-alpha.0](https://github.com/formidable-webview/webshell/compare/v1.0.2...v2.0.0-alpha.0) (2020-09-26)


### Code Refactoring

* features are now classes and must be built with FeatureBuilder ([d028853](https://github.com/formidable-webview/webshell/commit/d028853b964d55d4b0fa83d59fecb7591c6f7f48))
* makeWebshell now takes feature instances ([ed28385](https://github.com/formidable-webview/webshell/commit/ed28385a21f14b735a335a9b6141064e7d3ebc64))


### Features

* add new methods for WebjsContext interface ([bfdc409](https://github.com/formidable-webview/webshell/commit/bfdc40990e1d35a9029d2c8f5ec249786d6372fc))
* add new useAutoheight hook ([dc9842d](https://github.com/formidable-webview/webshell/commit/dc9842dd9107d1c292cd65337d42f23672432943))
* features API v2 (WIP) ([73d56c7](https://github.com/formidable-webview/webshell/commit/73d56c7af4f12b349702e34574665c56f120b7f2))
* new DOM feature ForceElementSizeFeature ([f715b5f](https://github.com/formidable-webview/webshell/commit/f715b5f17cd2b318849dd73fa18c9078f2991414))
* new DOM feature ForceResponsiveViewportFeature ([25ed358](https://github.com/formidable-webview/webshell/commit/25ed358e9370effc01575b34a54f2ad7498b7452))
* new DOM feature HandleElementCSSBoxFeature ([873d646](https://github.com/formidable-webview/webshell/commit/873d6468fb5e5a9e1fbf807acd52ecb307d5c07f))
* new DOM feature HandleHashChangeFeature ([9b7c47a](https://github.com/formidable-webview/webshell/commit/9b7c47a94fcb5c1f3fc751786f7d8f863ceeab39))
* new DOM feature HandleHTMLDimensionsFeature ([7a158d9](https://github.com/formidable-webview/webshell/commit/7a158d9453d623757dc4daa436e14e9ef7ce8c1e))
* new DOM feature HandleLinkPressFeature ([6da2358](https://github.com/formidable-webview/webshell/commit/6da23584481d0c93d53febaab0c75a53c9659da5))
* new DOM HandleVisualViewportFeature ([0577cbf](https://github.com/formidable-webview/webshell/commit/0577cbf304b57d0be75bc3cc7fde758d230fda31))


### BREAKING CHANGES

* handleLinkPressFeature has been replaced with
HandleLinkPressFeature, its instanciable counterpart. Also, the shape of
the sent message has changed, and is now an object with a variety of
useful information. Finally, this implementation uses the element
instance `href` field instead of the `href` attribute, which could contain
relative paths. It is thus more accurate.
* elementSizeFeature has been replaced with its
instanciable counterpart, HandleElementCSSBoxFeature. If you need the
whole document size, consider HandleHTMLDimensionsFeature.
* makeWebshell now requires to provide a list of Feature
instances instead of the result of feature `assemble` members.
* `makeFeature` has been dropped in favor of
FeatureBuilder. Also, feature bust now be instantiated instead of
calling `assemble` member. All imports must be upper-cased.
Implementing feature is documented here:
https://formidable-webview.github.io/webshell/docs/implementing-features

## [1.0.2](https://github.com/formidable-webview/webshell/compare/v1.0.1...v1.0.2) (2020-08-20)

## [1.0.1](https://github.com/formidable-webview/webshell/compare/v1.0.0...v1.0.1) (2020-08-19)

# [1.0.0](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.0...v1.0.0) (2020-08-19)

Initial release.
