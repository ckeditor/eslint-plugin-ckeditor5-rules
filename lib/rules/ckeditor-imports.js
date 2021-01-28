/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

const SHORT_PACKAGE_NAME_IMPORT_REGEXP = /@ckeditor\/ckeditor5?-([^/]+)/;
const SHORT_PACKAGE_NAME_PATH_REGEXP = /ckeditor5?-([^/\\]+)/;

const DLL_IMPORT_ERROR = 'Imports from DLL packages must be done using the "ckeditor5" package.';

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
		// Short names of the packages that are marked as DLL packages.
		// They are located inside the `src/` directory in the CKEditor 5 repository.
		const dllPackages = context.settings.dllPackages;

		if ( !dllPackages ) {
			throw new Error(
				'The "ckeditor5-rules/ckeditor-imports" rule requires additional configuration ' +
				'passed as "settings.dllPackages" in the config file.'
			);
		}

		const matchResult = context.getFilename().replace( context.getCwd(), '' ).match( SHORT_PACKAGE_NAME_PATH_REGEXP );
		const currentFileShortPackageName = matchResult ? matchResult[ 1 ] : null;

		return {
			ImportDeclaration: node => {
				const importPath = node.source.value;
				const matchResult = importPath.match( SHORT_PACKAGE_NAME_IMPORT_REGEXP );

				// If the short package name was not found, it means that 3rd party package or local file is being imported. It is fine.
				if ( !matchResult ) {
					return;
				}

				const shortPackageName = matchResult[ 1 ];

				// If the current parsed package belongs to DLL, all (DLL and non-DLL) imports are allowed.
				if ( isPartOfDllPackages( currentFileShortPackageName ) ) {
					return;
				}

				// Allows importing non-DLL packages.
				if ( !isPartOfDllPackages( shortPackageName ) ) {
					return;
				}

				// If the imported source is a JS file, allow fixing the error by ESLint.
				const reportObject = {
					node,
					message: DLL_IMPORT_ERROR,
					fix: fixerFactory( node, shortPackageName )
				};

				// While importing the JS file, the extension does not have to be specified.
				// If it is missing, Node assumes that it is '.js'.
				const importExtension = path.extname( importPath ) || '.js';

				// The fixer should try to fix the JS file only.
				if ( importExtension !== '.js' ) {
					delete reportObject.fix;
				}

				context.report( reportObject );
			}
		};

		/**
		 * Returns the default import specifier.
		 *
		 * @param {Array.<Object>} specifiers
		 * @returns {Object|null}
		 */
		function findDefaultImportSpecifier( specifiers ) {
			return specifiers.find( item => {
				return item.type === 'ImportDefaultSpecifier';
			} );
		}

		/**
		 * Returns the import specifier.
		 *
		 * @param {Array.<Object>} specifiers
		 * @returns {Object|null}
		 */
		function findImportSpecifier( specifiers ) {
			return specifiers.find( item => {
				return item.type === 'ImportSpecifier';
			} );
		}

		/**
		 * Checks whether the specified package belongs to the DLL packages.
		 *
		 * @param {String|null} packageToCheck
		 * @returns {Boolean}
		 */
		function isPartOfDllPackages( packageToCheck ) {
			if ( !packageToCheck ) {
				return false;
			}

			return dllPackages.includes( packageToCheck );
		}

		/**
		 * Returns a callback that will be used by ESlint. It attempts to fix the problem that was reported.
		 *
		 * @param {Object} node
		 * @param {String} shortPackageName
		 * @returns {Function}
		 */
		function fixerFactory( node, shortPackageName ) {
			return fixer => {
				const importFixes = [
					// Replace "@ckeditor/ckeditor5-dll/src/file" with "ckeditor5/src/dll".
					fixer.replaceTextRange( node.source.range, `'ckeditor5/src/${ shortPackageName }'` )
				];

				// Import without a variable declaration.
				// import from '...';
				if ( !node.specifiers.length ) {
					return importFixes;
				}

				const importDefaultSpecifier = findDefaultImportSpecifier( node.specifiers );
				const importSpecifier = findImportSpecifier( node.specifiers );

				// import Foo from '...'
				if ( importDefaultSpecifier && !importSpecifier ) {
					const defaultImportName = importDefaultSpecifier.local.name;

					// import { Foo } from '...'
					importFixes.push( fixer.replaceTextRange( importDefaultSpecifier.range, `{ ${ defaultImportName } }` ) );
				}
				// import Foo, { Bar } from '...'
				else if ( importDefaultSpecifier && importSpecifier ) {
					const defaultImportName = importDefaultSpecifier.local.name;
					const localImportNames = importSpecifier.local.name;

					const defaultImportRange = [
						importDefaultSpecifier.range[ 0 ],
						importDefaultSpecifier.range[ 1 ] + 2
					];

					// Removes "Foo, "
					importFixes.push( fixer.removeRange( defaultImportRange ) );

					// Adds "Foo" to local imports: { Foo, Bar }
					importFixes.push( fixer.replaceTextRange( importSpecifier.range, `${ defaultImportName }, ${ localImportNames }` ) );
				}

				return importFixes;
			};
		}
	}
};
