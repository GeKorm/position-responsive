# position-responsive
Position-aware responsive web design

Web designers have a plethora of tools to control how their applications look in multiple sizes.
But what about in multiple *positions*?

This library aims to provide these tools.
For now it deals with position-aware positioning, more specifically: viewport, window and screen-relative.

A CSS polyfill is planned but the spec is still undetermined.


* Performance: It uses GPU optimized methods and tries to minimize repainting. Tests show it can handle a lot of elements moving at once at 60 and 144 FPS. Please conduct your own testing for your specific use case. Please report [performance issues](https://github.com/GeKorm/position-responsive/labels/performance).
* Compatibility: Fallback to supported methods for older browsers.
* [**Demo**](http://www.gekorm.com/position-responsive/)
* Documentation: Very easy to use, docs will be added as soon as possible.
