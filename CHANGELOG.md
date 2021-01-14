Changelog
=========

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
