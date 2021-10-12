/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const CROSS_PACKAGE_IMPORT = /^ckeditor5/;

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow cross-package imports from CKEditor5 in specified packages.',
            category: 'CKEditor5'
        },
        schema: []
    },
    create( context ) {
        return {
            ImportDeclaration: node => {
                const targetPackages = context.settings.disallowedCrossImportsPackages;
                const packagePath = context.getFilename().replace( context.getCwd(), '');

                const isPackageTargeted = targetPackages.some((pack)=>{
                    return packagePath.includes(pack)
                })

                if (!isPackageTargeted) {
                    return
                }

                const importPath = node.source.value;
                const isCrossImport = CROSS_PACKAGE_IMPORT.test( importPath )

                if ( isCrossImport  ) {
                    context.report( {
                        node,
                        message: 'Adding cross-package imports in this package is disabled.'
                    } );
                }
            }
        };
    }
};
