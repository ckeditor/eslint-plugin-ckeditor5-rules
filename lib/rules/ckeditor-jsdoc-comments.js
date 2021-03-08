/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const JSDOC_COMMENT_START_REGEXP = /^\*\n/g;

const JSDOC_COMMENT_MULTIPLE_EMPTY_LINES_REGEXP = /^$/g;
const JSDOC_COMMENT_TOO_FEW_TABS_REGEXP = /^\t[^\t]/g;
const JSDOC_COMMENT_MIXED_INDENT_REGEXP = /(\t \t| \t )/g;

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce JSDoc formatting practices in CKEditor 5 project.',
			category: 'CKEditor5'
		},
		messages: {
			noMultipleEmptyLines: 'Two empty comment line should not be next to each other.',
			codeExampleTooFewTabs: 'Code example content should be indented by at least two tabs.',
			codeExampleMixedIndent: 'Tabs and spaces should not be mixed in the code example indentation.'
		}
	},
	create( context ) {
		return {
			Program() {
				const sourceCode = context.getSourceCode();
				const commentCheckers = {
					'code-example-too-few-tabs': ( comment, parsedComment ) => {
						getMatchingLines( parsedComment, JSDOC_COMMENT_TOO_FEW_TABS_REGEXP ).forEach( line => {
							// Does not apply to the last line.
							if ( line.index === parsedComment.length - 1 ) {
								return;
							}

							const relativePos = lineMatchToRelativePositionInComment( comment, line );

							context.report( {
								loc: movePostitionByRelative( comment.loc, relativePos ),
								messageId: 'codeExampleTooFewTabs'
							} );
						} );
					},

					'code-example-no-mixed-white-space': ( comment, parsedComment ) => {
						getMatchingLines( parsedComment, JSDOC_COMMENT_MIXED_INDENT_REGEXP ).forEach( line => {
							const relativePos = lineMatchToRelativePositionInComment( comment, line );

							context.report( {
								loc: movePostitionByRelative( comment.loc, relativePos ),
								messageId: 'codeExampleMixedIndent'
							} );
						} );
					},

					'no-multiple-empty-lines': ( comment, parsedComment ) => {
						let previousEmptyLineIndex;

						getMatchingLines( parsedComment, JSDOC_COMMENT_MULTIPLE_EMPTY_LINES_REGEXP ).forEach( line => {
							if ( previousEmptyLineIndex !== undefined && line.index === previousEmptyLineIndex + 1 ) {
								const relativePos = lineMatchToRelativePositionInComment( comment, line );

								context.report( {
									loc: movePostitionByRelative( comment.loc, relativePos ),
									messageId: 'noMultipleEmptyLines'
								} );
							}

							previousEmptyLineIndex = line.index;
						} );
					}
				};

				return sourceCode.getAllComments()
					// Filter inline "// foo" and "# foo" comments out.
					.filter( comment => comment.type !== 'Shebang' && comment.type !== 'Line' )

					// Filter comments that don't start with "/**" out.
					.filter( comment => comment.value.match( JSDOC_COMMENT_START_REGEXP ) )

					// Filter one-liners out.
					.filter( comment => comment.loc.start.line !== comment.loc.end.line )

					.forEach( comment => {
						const parsedComment = parseComment( comment );

						for ( const checkerName in commentCheckers ) {
							commentCheckers[ checkerName ]( comment, parsedComment );
						}
					} );
			}
		};
	}
};

function getMatchingLines( parsedComment, regexp ) {
	return parsedComment
		.map( line => {
			const match = regexp.exec( line.value );

			if ( match ) {
				return { ...line, match };
			}

			return line;
		} )
		.filter( line => line.match );
}

function movePostitionByRelative( pos, relativePos ) {
	return {
		start: { line: pos.start.line + relativePos.line, column: pos.start.column + relativePos.column },
		end: { line: pos.start.line + relativePos.line, column: pos.start.column + relativePos.column + 1 }
	};
}

function parseComment( comment ) {
	return parseCommentLines( comment )
		.map( ( { value, startOffset }, index ) => {
			return {
				value: value.replace( /^\s*\*/g, '' ),
				startOffset,
				index
			};
		} );
}

function parseCommentLines( comment ) {
	const commentLines = comment.value.split( '\n' );
	const parsedLines = [];

	let startOffset = 0;

	for ( const line of commentLines ) {
		parsedLines.push( {
			startOffset,
			value: line
		} );

		startOffset += line.length + 1; // Mind the \n
	}

	return parsedLines;
}

function lineMatchToRelativePositionInComment( comment, line ) {
	const lineMatch = line.match;

	return { line: line.index, column: lineMatch.index + 2 }; // 2 compensates " *"
}
