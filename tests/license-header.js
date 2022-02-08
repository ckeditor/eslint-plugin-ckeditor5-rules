/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;

const extraLineBeforeError = { message: 'There is an extra new line before the license header.' };
const newLineAfterMissingError = { message: 'There is a new line missing after the license header.' };
const incorrectHeaderError = { message: 'The license header is incorrect.' };
const missingHeaderError = { message: 'The license header is missing.' };

const options = [ {
	headerLines: [
		'/**',
		' * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.',
		' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license',
		' */'
	]
} ];

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
	}
} );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/license-header', require( '../lib/rules/license-header' ), {
	valid: [
		{
			code:
`/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

foo()`,
			options
		}
	],
	invalid: [
		{
			code:
`
/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

foo()`,
			options,
			errors: [ extraLineBeforeError ]
		},
		{
			code:
`
/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
foo()`,
			options,
			errors: [ extraLineBeforeError, newLineAfterMissingError ]
		},
		{
			code:
`/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
foo()`,
			options,
			errors: [ newLineAfterMissingError ]
		},
		{
			code:
`
/**
 * @license TODO
 */`,
			options,
			errors: [ extraLineBeforeError, incorrectHeaderError, newLineAfterMissingError ]
		},
		{
			code:
`/**
 * @LICENSE COPYRIGHT (C) 2003-2022, CKSOURCE HOLDING SP. Z O.O. ALL RIGHTS RESERVED.
 * FOR LICENSING, SEE LICENSE.MD OR HTTPS://CKEDITOR.COM/LEGAL/CKEDITOR-OSS-LICENSE
 */

foo()`,
			options,
			errors: [ incorrectHeaderError ]
		},
		{
			code:
`/**
 * ------------------------ Same length but different content -----------------------
 * ----------------------- Same length but different content ----------------------
 */
foo()`,
			options,
			errors: [ missingHeaderError ]
		},
		{
			code:
`// @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
// For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license

foo()`,
			options,
			errors: [ missingHeaderError ]
		},
		{
			code:
`/** foo */
/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

foo()`,
			options,
			errors: [ missingHeaderError ] // Not the best, not the worst.
		},
		{
			code: 'foo()',
			options,
			errors: [ missingHeaderError ]
		},
		{
			code: '',
			options,
			errors: [ missingHeaderError ]
		}
	]
} );
