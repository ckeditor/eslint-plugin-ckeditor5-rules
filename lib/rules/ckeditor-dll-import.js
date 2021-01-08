/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

const SHORT_PACKAGE_NAME_IMPORT_REGEXP = /@ckeditor\/ckeditor5?-([^/]+)/;
const SHORT_PACKAGE_NAME_PATH_REGEXP = /ckeditor5?-([^/\\]+)/;

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Disallow direct imports of packages that belong to CKEditor 5 DLL.',
			category: 'CKEditor5'
		},
		fixable: 'code',
		schema: []
	},
	create( context ) {
		// Short names of the packages that are included as DLL core packages.
		// They are located inside the `src/` directory in the CKEditor 5 repository.
		const dllPackages = context.settings.dllPackages;

		if ( !dllPackages ) {
			throw new Error(
				'The "ckeditor5-rules/ckeditor-dll-import" rule requires additional configuration ' +
				'passed as "settings.dllPackages" in the config file.'
			);
		}

		const matchResult = context.getFilename().replace( context.getCwd(), '' ).match( SHORT_PACKAGE_NAME_PATH_REGEXP );
		const currentFileShortPackageName = matchResult ? matchResult[ 1 ] : null;

		return {
			ImportDeclaration: node => {
				// If the parsed package belongs to the DLL core packages, the direct import is allowed.
				if ( dllPackages.includes( currentFileShortPackageName ) ) {
					return;
				}

				const importPath = node.source.value;

				// While importing a JS file, the extension does not have to be specified.
				// If it is missing, Node assumes that it is '.js'.
				const importExtension = path.extname( importPath ) || '.js';

				// The rule should check only JS imports.
				if ( importExtension !== '.js' ) {
					return;
				}

				const matchResult = importPath.match( SHORT_PACKAGE_NAME_IMPORT_REGEXP );

				if ( !matchResult ) {
					return;
				}

				// The short package name that is being imported.
				const shortPackageName = matchResult[ 1 ];

				// If the imported package does not belong to DLL packages, let's continue.
				if ( !dllPackages.includes( shortPackageName ) ) {
					return;
				}

				// Otherwise, the direct import is disallowed.
				context.report( {
					node,
					message: 'Imports of packages that belong to CKEditor 5 DLL should be done using the "ckeditor5" package.',
					fix: fixer => {
						const importFixes = [
							// Replace "@ckeditor/ckeditor5-dll/src/file" with "ckeditor5/src/dll".
							fixer.replaceTextRange( node.source.range, `'ckeditor5/src/${ shortPackageName }'` )
						];

						const importSpecifier = node.specifiers[ 0 ];

						// The default import must be changed to the named import.
						if ( importSpecifier.type === 'ImportDefaultSpecifier' ) {
							importFixes.push( fixer.replaceTextRange( importSpecifier.range, `{ ${ importSpecifier.local.name } }` ) );
						}

						return importFixes;
					}
				} );
			}
		};
	}
};
