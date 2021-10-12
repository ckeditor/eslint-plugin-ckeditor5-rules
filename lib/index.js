/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	rules: {
		'no-relative-imports': require( './rules/no-relative-imports' ),
		'ckeditor-error-message': require( './rules/ckeditor-error-message' ),
		'ckeditor-imports': require( './rules/ckeditor-imports' ),
		'no-cross-package-imports': require('./rules/no-cross-package-imports')
	}
};
