/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const CROSS_PACKAGE_IMPORT = /import.+from 'ckeditor5.+';/g;
const WATCHDOG_FILE = /ckeditor5-watchdog/;

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Disallow cross-package imports from CKEditor5 packages in the ckeditor5-watchdog package.',
            category: 'CKEditor5'
        },
        schema: []
    },
    create( context ) {
        return {
            ImportDeclaration: node => {
                const importPath = node.source.value;
                const isCrossImport = CROSS_PACKAGE_IMPORT.test( importPath )
                const isWatchdogFile = context.getFilename().replace( context.getCwd(), '' ).match( WATCHDOG_FILE );

                if ( isCrossImport && isWatchdogFile ) {
                    context.report( {
                        node,
                        message: 'Adding cross-package imports in the ckeditor5-watchdog is not allowed.'
                    } );
                }
            }
        };
    }
};
