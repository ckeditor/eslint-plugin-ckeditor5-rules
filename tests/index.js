/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const fs = require( 'fs' );

const tests = fs.readdirSync( __dirname ).filter( test => {
    return test !== 'index.js';
} );

for ( const test of tests ) {
    require( `./${ test }` );
}
