/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

module.exports = {
	meta: {
		type: 'layout',
		docs: {
			description: 'Enforce the presence of a @license header.',
			category: 'CKEditor5'
		},
		schema: [
			{
				type: 'object',
				properties: {
					headerLines: {
						type: 'array'
					}
				},
				additionalProperties: false
			}
		]
	},

	create( context ) {
		const [ { headerLines } = {} ] = context.options;

		if ( !headerLines ) {
			console.error( 'The license-header rule is missing the "headerLines" configuration.' );
		}

		const headerHeight = headerLines.length;
		const headerText = headerLines.join( '\n' );
		const sourceCode = context.getSourceCode();

		return {
			Program( node ) {
				const leadingComments = sourceCode.getComments( node.body[ 0 ] || node ).leading;
				const leadingShebang = leadingComments.find( comment => comment.type === 'Shebang' );
				const leadingComment = leadingComments.find( comment => comment.type === 'Block' );
				const isLeadingCommentALicenseComment = leadingComment &&
					sourceCode.getText( leadingComment ).toLowerCase().includes( '@license' );

				if ( isLeadingCommentALicenseComment ) {
					const leadingCommentText = sourceCode.getText( leadingComment );

					if ( leadingCommentText !== headerText ) {
						context.report( {
							node: leadingComment,
							message: 'The license header is incorrect.'
						} );
					}

					if ( !leadingShebang && leadingComment.loc.start.line > 1 ) {
						context.report( {
							loc: {
								start: {
									line: 0,
									column: 0
								},
								end: {
									line: 0,
									column: 1
								}
							},
							message: 'There is an extra new line before the license header.'
						} );
					}

					if ( sourceCode.lines[ leadingComment.loc.end.line ] != '' ) {
						context.report( {
							loc: {
								start: {
									line: headerHeight,
									column: 0
								},
								end: {
									line: headerHeight,
									column: 0
								}
							},
							message: 'There is a new line missing after the license header.'
						} );
					}
				} else {
					context.report( {
						loc: {
							start: {
								line: 0,
								column: 0
							},
							end: {
								line: 0,
								column: 0
							}
						},
						message: 'The license header is missing.'
					} );
				}
			}
		};
	}
};
