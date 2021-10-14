/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );
const RuleTester = require( 'eslint' ).RuleTester;

const ruleTester = new RuleTester( {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2018
	}, settings: {
		disallowedCrossImportsPackages: [
			'ckeditor5-watchdog'
		]
	}
} );

const importError = { message: 'This package cannot import CKEditor 5 packages.' };

ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-cross-package-imports', require( '../lib/rules/no-cross-package-imports' ), {
	valid: [
		/**
		 * Windows style path
		 */

		// Non-cross package imports in disallowed package
		{
			code: 'import Watchdog from \'./watchdog\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		{
			code: 'import EditorWatchdog from \'./editorwatchdog\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		{
			code: 'import areConnectedThroughProperties from \'./utils/areconnectedthroughproperties\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		{
			code: 'import getSubNodes from \'./utils/getsubnodes\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		// Cross package imports in allowed package
		{
			code: 'import { toArray } from \'ckeditor5/src/utils\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},
		// Other file formats
		{
			code: 'import { rule } from \'@ckeditor/ckeditor5-utils/theme/example/component.css\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},
		{
			code: 'import { pattern } from \'@ckeditor/ckeditor5-utils/theme/example/component.svg\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},

		/**
		 * Unix style path
		 */

		// Non-cross package imports in disallowed package
		{
			code: 'import Watchdog from \'./watchdog\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		{
			code: 'import EditorWatchdog from \'./editorwatchdog\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		{
			code: 'import areConnectedThroughProperties from \'./utils/areconnectedthroughproperties\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		{
			code: 'import getSubNodes from \'./utils/getsubnodes\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' )
		},
		// Cross package imports in allowed package
		{
			code: 'import { toArray } from \'ckeditor5/src/utils\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},
		// Other file formats
		{
			code: 'import { rule } from \'@ckeditor/ckeditor5-utils/theme/example/component.css\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		},
		{
			code: 'import { pattern } from \'@ckeditor/ckeditor5-utils/theme/example/component.svg\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-core', 'src', 'plugin.js' )
		}
	],
	invalid: [
		/**
		 * Windows style path
		 */

		{
			code: 'import { toArray } from \'ckeditor5/src/utils\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},
		{
			code: 'import toArray from \'ckeditor5/src/utils\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},
		{
			code: 'import { toArray } from \'@ckeditor/ckeditor5-utils\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},
		{
			code: 'import toArray from \'@ckeditor/ckeditor5-utils/src/toarray\';',
			filename: path.win32.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},

		/**
		 * Unix style path
		 */

		{
			code: 'import { toArray } from \'ckeditor5/src/utils\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},
		{
			code: 'import toArray from \'ckeditor5/src/utils\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},
		{
			code: 'import { toArray } from \'@ckeditor/ckeditor5-utils\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		},
		{
			code: 'import toArray from \'@ckeditor/ckeditor5-utils/src/toarray\';',
			filename: path.posix.join( 'C:', 'Workspace', 'ckeditor', 'ckeditor5', 'packages', 'ckeditor5-watchdog', 'src', 'plugin.js' ),
			errors: [ importError ]
		}
	]
} );
