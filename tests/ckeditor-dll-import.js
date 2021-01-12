/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const ckeditorDllImport = require( '../lib/rules/ckeditor-dll-import' );

const importError = {
	message: 'Imports of packages that belong to CKEditor 5 DLL should be done using the "ckeditor5" package.'
};

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
	},
	settings: {
		dllPackages: [
			'core',
			'engine',
			'ui',
			'utils',
			'widget'
		]
	}
} );

ruleTester.run( 'eslint-plugin-ckeditor5-rules/ckeditor-dll-import', ckeditorDllImport, {
	valid: [
		// Expected imports.
		'import { Plugin } from \'ckeditor5/src/core\';',
		'import { first, last } from \'ckeditor5/src/utils\';',

		// Unnecessary ".js" extension should not trigger an error.
		'import { Plugin } from \'ckeditor5/src/core.js\';',

		// CSS and SVG imports should not be checked.
		'import \'@ckeditor/ckeditor5-basic-styles/theme/bold.css\';',
		'import okIcon from \'@ckeditor/ckeditor5-core/theme/icons/ok.svg\';',
	],
	invalid: [
		{
			code: 'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin } from \'ckeditor5/src/core\';',
			errors: [ importError ]
		},
		{
			code: 'import { Plugin } from \'@ckeditor/ckeditor5-core/src/index\';',
			output: 'import { Plugin } from \'ckeditor5/src/core\';',
			errors: [ importError ]
		},
		{
			code: 'import Plugin, { FooBar } from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin, FooBar } from \'ckeditor5/src/core\';',
			errors: [ importError ]
		},
		{
			code: 'import Plugin, { FooBar, Bar } from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin, FooBar, Bar } from \'ckeditor5/src/core\';',
			errors: [ importError ]
		}
	]
} );

// The code below checks whether an error was reported if the configuration for the plugin is missing.
try {
	const invalidRuleTester = new RuleTester( {
		parserOptions: {
			sourceType: 'module',
			ecmaVersion: 2018
		}
	} );

	invalidRuleTester.run( 'eslint-plugin-ckeditor5-rules/ckeditor-dll-import', ckeditorDllImport, {
		valid: [
			'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';'
		],
		// An empty test case must be specified.
		invalid: [ {} ]
	} );
} catch ( err ) {
	const errorMessage = 'Error while loading rule \'eslint-plugin-ckeditor5-rules/ckeditor-dll-import\': ' +
		'The "ckeditor5-rules/ckeditor-dll-import" rule requires additional configuration passed as "settings.dllPackages" ' +
		'in the config file.\nOccurred while linting <input>';

	if ( errorMessage !== err.message ) {
		throw err;
	}
}
