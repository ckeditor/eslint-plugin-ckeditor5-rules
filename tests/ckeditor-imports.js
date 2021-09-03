/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const RuleTester = require( 'eslint' ).RuleTester;
const ckeditorImports = require( '../lib/rules/ckeditor-imports' );

const DLL_IMPORT_ERROR = {
	message: 'Imports from DLL packages must be done using the "ckeditor5" package.'
};

const CKEDITOR5_INVALID_IMPORT = {
	message: 'Imports from the `ckeditor5` package must use the `src/` directory.'
};

const DLL_USE_FULL_NAME_IMPORT = {
	message: 'Imports between DLL packages must use full package name.'
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

ruleTester.run( 'eslint-plugin-ckeditor5-rules/ckeditor-imports', ckeditorImports, {
	valid: [
		// Expected imports.
		'import { Plugin } from \'ckeditor5/src/core\';',
		'import { first, last } from \'ckeditor5/src/utils\';',

		// Unnecessary ".js" extension the import itself is correct.
		'import { Plugin } from \'ckeditor5/src/core.js\';',

		// Cross imports between DLL packages (Unix).
		{
			code: 'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-engine/src/position.js'
		},

		// Cross imports between DLL packages (Windows).
		{
			code: 'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-engine', 'src', 'position.js' )
		},

		// Imports between non-DLL packages (Unix).
		{
			code: 'import Bold from \'@ckeditor/ckeditor5-basic-styles/src/bold\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-image/src/image.js'
		},

		// Imports between non-DLL packages (Windows).
		{
			code: 'import Bold from \'@ckeditor/ckeditor5-basic-styles/src/bold\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-image', 'src', 'image.js' )
		},

		// Imports non-DLL package from DLL package (Unix).
		{
			code: 'import Bold from \'@ckeditor/ckeditor5-basic-styles/src/bold\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-core/src/plugin.js'
		},

		// Imports non-DLL package from DLL package (Windows).
		{
			code: 'import Bold from \'@ckeditor/ckeditor5-basic-styles/src/bold\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},

		// CSS & SVG imports between DLL and non-DLL packages aren't allowed (Unix).
		{
			code: 'import \'@ckeditor/ckeditor5-basic-styles/theme/bold.css\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-core/src/plugin.js'
		},

		{
			code: 'import okIcon from \'@ckeditor/ckeditor5-basic-styles/theme/icons/ok.svg\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-core/src/plugin.js'
		},

		// CSS & SVG imports between DLL and non-DLL packages aren't allowed (Windows).
		{
			code: 'import \'@ckeditor/ckeditor5-basic-styles/theme/bold.css\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},

		{
			code: 'import okIcon from \'@ckeditor/ckeditor5-basic-styles/theme/icons/ok.svg\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		}
	],
	invalid: [
		// Invalid imports and corrected code.
		{
			code: 'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin } from \'ckeditor5/src/core\';',
			errors: [ DLL_IMPORT_ERROR ]
		},
		{
			code: 'import { Plugin } from \'@ckeditor/ckeditor5-core/src/index\';',
			output: 'import { Plugin } from \'ckeditor5/src/core\';',
			errors: [ DLL_IMPORT_ERROR ]
		},

		// Import the default export and named variables should be merged into single object.
		{
			code: 'import Plugin, { FooBar } from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin, FooBar } from \'ckeditor5/src/core\';',
			errors: [ DLL_IMPORT_ERROR ]
		},
		{
			code: 'import Plugin, { FooBar, Bar } from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin, FooBar, Bar } from \'ckeditor5/src/core\';',
			errors: [ DLL_IMPORT_ERROR ]
		},

		// Imports DLL package from non-DLL package (Unix).
		{
			code: 'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin } from \'ckeditor5/src/core\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-basic-styles/src/bold.js',
			errors: [ DLL_IMPORT_ERROR ]
		},

		// Imports DLL package from non-DLL package (Windows).
		{
			code: 'import Plugin from \'@ckeditor/ckeditor5-core/src/plugin\';',
			output: 'import { Plugin } from \'ckeditor5/src/core\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-basic-styles', 'src', 'bold.js' ),
			errors: [ DLL_IMPORT_ERROR ]
		},

		// Fixer tries to fix JS imports only.
		{
			code: 'import \'@ckeditor/ckeditor5-core/theme/editor.css\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-basic-styles/src/bold.js',
			errors: [ DLL_IMPORT_ERROR ]
		},
		{
			code: 'import okIcon from \'@ckeditor/ckeditor5-core/theme/icons/ok.svg\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-basic-styles/src/bold.js',
			errors: [ DLL_IMPORT_ERROR ]
		},

		// Fixer tries to fix JS imports only.
		{
			code: 'import \'@ckeditor/ckeditor5-core/theme/editor.css\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-basic-styles', 'src', 'bold.js' ),
			errors: [ DLL_IMPORT_ERROR ]
		},
		{
			code: 'import okIcon from \'@ckeditor/ckeditor5-core/theme/icons/ok.svg\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-basic-styles', 'src', 'bold.js' ),
			errors: [ DLL_IMPORT_ERROR ]
		},

		// Importing from other directories than `src/` from the `ckeditor5` package.
		{
			code: 'import \'ckeditor5/packages/ckeditor5-ui/theme/components/responsive-form/responsiveform.css\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-basic-styles/src/bold.js',
			errors: [ CKEDITOR5_INVALID_IMPORT ]
		},
		{
			code: 'import \'ckeditor5/packages/ckeditor5-ui/theme/components/responsive-form/responsiveform.css\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-basic-styles', 'src', 'bold.js' ),
			errors: [ CKEDITOR5_INVALID_IMPORT ]
		},

		// Importing DLL package by DLL package without using its full names.
		{
			code: 'import { Plugin } from \'ckeditor5/src/core\';',
			filename: '/Users/Workspace/ckeditor/ckeditor5/packages/ckeditor5-widget/src/plugin.js',
			errors: [ DLL_USE_FULL_NAME_IMPORT ]
		},
		{
			code: 'import { Plugin } from \'ckeditor5/src/core\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-widget', 'src', 'plugin.js' ),
			errors: [ DLL_USE_FULL_NAME_IMPORT ]
		}
	]
} );

// The code below checks whether an error was reported if the configuration for the plugin is missing.
( ruleTester => {
	try {
		ruleTester.run( 'eslint-plugin-ckeditor5-rules/ckeditor-imports', ckeditorImports, {
			valid: [
				'import { Plugin } from \'ckeditor5/src/core\';'
			],
			// An empty test case must be specified.
			invalid: [ {} ]
		} );
	} catch ( err ) {
		const errorMessage = 'Error while loading rule \'eslint-plugin-ckeditor5-rules/ckeditor-imports\': ' +
			'The "ckeditor5-rules/ckeditor-imports" rule requires additional configuration passed as "settings.dllPackages" ' +
			'in the config file.\nOccurred while linting <input>';

		if ( errorMessage !== err.message ) {
			throw err;
		}
	}
} )( new RuleTester( { parserOptions: { sourceType: 'module', ecmaVersion: 2018 } } ) );
