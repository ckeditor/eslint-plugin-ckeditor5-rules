/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const path = require( 'path' );

// A regular expression for determining the short name of a package from a full package name.
const SHORT_PACKAGE_NAME_IMPORT_REGEXP = /@ckeditor\/ckeditor5?-([^/]+)/;

// A regular expression for determining the short name of a package from its name without the scope.
const SHORT_PACKAGE_NAME_PATH_REGEXP = /ckeditor5?-([^/\\]+)/;

// A regular expression for determining whether an imported path uses the `src/` directory.
const CKEDITOR5_PACKAGE_IMPORT_REGEXP = /ckeditor5\/(?!src)/;

// A regular expression for determining the short package name when importing using the `ckeditor5` package.
const CKEDITOR5_SHORT_PACKAGE_NAME_REGEXP = /ckeditor5\/src\/(.*)/;

const DLL_IMPORT_ERROR = 'Imports from DLL packages must be done using the "ckeditor5" package.';
const CKEDITOR5_INVALID_IMPORT = 'Imports from the `ckeditor5` package must use the `src/` directory.';
const DLL_USE_FULL_NAME_IMPORT = 'Imports between DLL packages must use full package name.';

// Short names of the packages that are marked as DLL packages.
// They are located inside the `src/` directory in the CKEditor 5 repository.
const DLL_PACKAGES = [
	'clipboard',
	'core',
	'engine',
	'enter',
	'paragraph',
	'select-all',
	'typing',
	'ui',
	'undo',
	'upload',
	'utils',
	'widget'
];

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
		const matchResult = context.getFilename().replace( context.getCwd(), '' ).match( SHORT_PACKAGE_NAME_PATH_REGEXP );
		const currentFileShortPackageName = matchResult ? matchResult[ 1 ] : null;

		return {
			ImportDeclaration: node => {
				const importPath = node.source.value;
				const matchResult = importPath.match( SHORT_PACKAGE_NAME_IMPORT_REGEXP );

				// Do not allow importing from the `ckeditor5` package from other directories than `src/`.
				// See: https://github.com/ckeditor/ckeditor5/issues/10030.
				if ( importPath.match( CKEDITOR5_PACKAGE_IMPORT_REGEXP ) ) {
					context.report( {
						node,
						message: CKEDITOR5_INVALID_IMPORT
					} );

					return;
				}

				const isCurrentFileInDllPackage = isPartOfDllPackages( currentFileShortPackageName );

				// If the current processed file belongs to one of the DLL packages...
				if ( isCurrentFileInDllPackage ) {
					// ...and importing other DLL package, it must use the full path of the package instead of the `ckeditor5` package.
					// See: https://github.com/ckeditor/ckeditor5/issues/10375.

					const shortNameImportedPackage = importPath.match( CKEDITOR5_SHORT_PACKAGE_NAME_REGEXP );

					if ( shortNameImportedPackage ) {
						context.report( {
							node,
							message: DLL_USE_FULL_NAME_IMPORT
						} );
					}

					// Otherwise, do not check anything as DLL packages can import dependencies without limitations.
					return;
				}

				// Importing a file within the same package or 3rd party package. It's fine.
				if ( !matchResult ) {
					return;
				}

				const shortPackageName = matchResult[ 1 ];

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

			return DLL_PACKAGES.includes( packageToCheck );
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
