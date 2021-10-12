/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const RuleTester = require( 'eslint' ).RuleTester;
const ruleTester = new RuleTester( { parserOptions: { sourceType: 'module', ecmaVersion: 2018 } } );

const importError = { message: 'Adding cross-package imports in this package is disabled.' };
const context = { settings: { disallowedCrossImportsPackages: [ 'ckeditor5-watchdog' ] } };

ruleTester.run( 'eslint-plugin-ckeditor5-rules/no-cross-package-imports', require( '../lib/rules/no-cross-package-imports' ), {
    valid: [/*
        'import Watchdog from \'./watchdog\';',
        'import EditorWatchdog from \'./editorwatchdog\';',
        'import areConnectedThroughProperties from \'./utils/areconnectedthroughproperties\';',
        'import getSubNodes from \'./utils/getsubnodes\';'
    */],
    invalid: []
} );
