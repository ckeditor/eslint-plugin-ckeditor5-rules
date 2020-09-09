#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

/**
 * Scripts for generating the changelog before starting the release process.
 */

require( '@ckeditor/ckeditor5-dev-env' ).generateChangelogForSinglePackage( {
	// TODO: Remove this line after the next release.
	from: '32285d765b42eeefd8a8f07ff6d77953ebb8533a'
} );
