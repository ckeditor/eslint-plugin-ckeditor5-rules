Changelog
=========

## [1.2.5](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.2.4...v1.2.5) (2021-09-13)

### Other changes

* [CKEditor 5 core DLL packages](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/development/dll-builds.html) are now specified in the `ckeditor-imports` rule instead of obtained from the configuration file. ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/9f59a1f69d365a6822a76e6b2b49cfaf7a711e28))


## [1.2.4](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.2.3...v1.2.4) (2021-09-06)

### Other changes

* An import between DLL packages must use the full name of the imported package. Closes [ckeditor/ckeditor5#10375](https://github.com/ckeditor/ckeditor5/issues/10375). ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/85bcfd7ae095b5755eb5061c6d63b4fdc6d7d398))


## [1.2.3](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.2.2...v1.2.3) (2021-07-05)

### Bug fixes

* Disallow importing from other directories than "src/" when importing from the "ckeditor5" package. Closes [ckeditor/ckeditor5#10030](https://github.com/ckeditor/ckeditor5/issues/10030). ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/d12074249190619d1af94bc80844bd74f32865d2))


## [1.2.2](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.2.1...v1.2.2) (2021-01-28)

### Other changes

* Allow importing non-DLL packages. Closes [ckeditor/ckeditor5#8896](https://github.com/ckeditor/ckeditor5/issues/8896). ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/facb8edd86596844d736bfd7605d2ac8f3c4ccb6))


## [1.2.1](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.2.0...v1.2.1) (2021-01-14)

### Bug fixes

* Extended the `ckeditor5-rules/ckeditor-imports` rule. Now the imports listed below are allowed:. ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/d17a849db1bef7992770f9e698a4cba0a9266322))

  - from 3rd party things,
  - directly from within the same package,
  - via `@ckeditor/ckeditor5-*` format from DLL package,
  - via `ckeditor5/src/*` format for non-DLL package.

  Imports non-DLL packages are not allowed. Those rules apply to JS, CSS, and SVG files.
* Renamed the rule from `ckeditor5-rules/ckeditor-dll-import` to `ckeditor5-rules/ckeditor-imports`. Closes [ckeditor/ckeditor5#8824](https://github.com/ckeditor/ckeditor5/issues/8824). ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/d17a849db1bef7992770f9e698a4cba0a9266322))


## [1.2.0](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.1.0...v1.2.0) (2021-01-12)

### Features

* Added a rule that disallows direct imports of packages that belong to CKEditor 5 DLL. Closes [ckeditor/ckeditor5#8581](https://github.com/ckeditor/ckeditor5/issues/8581). ([commit](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/commit/7fe7d661b85b8e46e182dad084a5a69294510837))


## [1.1.0](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/compare/v1.0.0...v1.1.0) (2020-09-09)

### Features

* Introduced the rule for checking `CKEditorError`. Closes [ckeditor/ckeditor5#7822](https://github.com/ckeditor/ckeditor5/issues/7822).


## [0.0.5](https://github.com/ckeditor/ckeditor5-dev/compare/eslint-plugin-ckeditor5-rules@0.0.4...eslint-plugin-ckeditor5-rules@0.0.5) (2020-02-26)

Internal changes only (updated dependencies, documentation, etc.).


## [0.0.4](https://github.com/ckeditor/ckeditor5-dev/compare/eslint-plugin-ckeditor5-rules@0.0.3...eslint-plugin-ckeditor5-rules@0.0.4) (2020-01-09)

Internal changes only (updated dependencies, documentation, etc.).


## [0.0.3](https://github.com/ckeditor/ckeditor5-dev/compare/eslint-plugin-ckeditor5-rules@0.0.1...eslint-plugin-ckeditor5-rules@0.0.3) (2019-03-28)

Internal changes only (updated dependencies, documentation, etc.).


## [0.0.1](https://github.com/ckeditor/ckeditor5-dev/tree/eslint-plugin-ckeditor5-rules@0.0.1) (2018-12-19)

Initial version.
