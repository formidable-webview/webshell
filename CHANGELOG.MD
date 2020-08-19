# [1.0.0](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-19)



## [0.10.1-alpha.6](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-17)


### Code Refactoring

* cleaner Typescript typings for return type of makeWebshell ([8f2bbe8](https://github.com/formidable-webview/webshell/commit/8f2bbe870f9bb26f8c8f0c8988eb7f6433ef3ed5))
* rename handler props with onDOM prefix ([596b23d](https://github.com/formidable-webview/webshell/commit/596b23d0698473f67e94e6f57ff27094fe2fb149))
* WebShellProps now inherit WebViewProps ([d685b2d](https://github.com/formidable-webview/webshell/commit/d685b2db457d47584ce7494f500b39b8a54cabb3))


### Features

* forward WebView refs ([4b06eb5](https://github.com/formidable-webview/webshell/commit/4b06eb517717ad706c35dc501ad258c8a588c0d4))


### BREAKING CHANGES

* for Typescript users, exported types have changed.
You now only require 2 generic type params for makeWebshell and
WebshellComponentOf.
* the type signature of the returned component has
slightly changed.
* the webViewProps has disappeared. You should now use
those props as WebShell props.
* handlers props have been renamed.



## [0.10.1-alpha.5](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-09)


### Code Refactoring

* rename a few typescript interfaces ([784f523](https://github.com/formidable-webview/webshell/commit/784f5235fc4887627033e0cf42275ad898941bfb))


### BREAKING CHANGES

* for typescript users:

- WebshellStaticProps renamed to WebshellInvariantProps
- WebshellComponentProps renamed to WebshellProps



## [0.10.1-alpha.4](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-07)



## [0.10.1-alpha.3](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-07)



## [0.10.1-alpha.2](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-07)



## [0.10.1-alpha.1](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-07)



## [0.10.1-alpha.0](https://github.com/formidable-webview/webshell/compare/v0.10.1-alpha.6...v1.0.0) (2020-08-07)

