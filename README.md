CKEditor 5 ESLint Plugins
=========================

[![Build Status](https://app.travis-ci.com/ckeditor/eslint-plugin-ckeditor5-rules.svg?branch=master)](https://app.travis-ci.com/ckeditor/eslint-plugin-ckeditor5-rules)

A set of plugins used by the [CKEditor 5](https://ckeditor.com) team for [Eslint](https://eslint.org/) 

By default this plugin is added to our [`eslint-config-ckeditor5`](https://www.npmjs.com/package/eslint-config-ckeditor5) preset. 

## Usage

```
npm i --save-dev eslint-plugin-ckeditor5-rules
```

Configure ESLint with a `.eslintrc` file using the following contents:

```js
{
	// ...
	plugins: [
		// ...
		'ckeditor5-rules' // Add the plugin to the linter.
	],
	rules: {
		'ckeditor5-rules/no-relative-imports': 'error'
		// ...
	}
	// ...
}
```

## Rules

### no-relative-imports

A rule that inspects for relative imports to other [CKEditor 5](https://ckeditor.com)'s packages:

```js
// Incorrect import:
import Position from '../../ckeditor5-engine/src/model/position';

// Will be fix to: 
import Position from '@ckeditor/ckeditor5-engine/src/model/position';
```

## Changelog

See the [`CHANGELOG.md`](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/blob/master/CHANGELOG.md) file.

## Releasing package

Note: Be sure that version of dependencies in [`package.json`](https://github.com/ckeditor/eslint-plugin-ckeditor5-rules/blob/master/package.json) are defined correctly.

### Changelog

Before starting the release process, you need to generate the changelog:

```bash
npm run changelog
```

### Publishing

After generating the changelog, you are able to release the package.

First, you need to bump the version:

```bash
npm run release:bump-version
```

You can also use the `--dry-run` option in order to see what this task does.

After bumping the version, you can publish the changes:

```bash
npm run release:publish
```

As in the previous task, the `--dry-run` option is also available.

