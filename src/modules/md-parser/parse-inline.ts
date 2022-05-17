import { SymbolType, InlineTokenType } from "@modules/md-parser/enums";
import { createReader } from "@modules/md-parser/reader";
import { MdNode, MdSymbol } from "@modules/md-parser/types";
import { tail } from "@utils/array";

export const parseInline = (symbols: MdSymbol[], tree: MdNode) => {
	const reader = createReader(symbols);

	let symbol = reader.next();

	const forbiddenSymbols = [
		SymbolType.HASH,
		SymbolType.BACKTICK,
		SymbolType.BRACKET_OPEN,
		SymbolType.STAR,
		SymbolType.UNDERSCORE,
		SymbolType.TILDE,
	];

	while (symbol) {
		let ahead = reader.lookAhead();
		let back = reader.backTrack();

		if (
			symbol &&
			symbol.type === SymbolType.HASH &&
			ahead &&
			ahead.type !== SymbolType.WHITESPACE &&
			ahead.type !== SymbolType.TAB
		) {
			const symbols = [symbol];
			let raw = symbol.value;
			symbol = reader.next();

			while (symbol && symbol.type !== SymbolType.WHITESPACE) {
				symbols.push(symbol);
				raw += symbol.value;
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();
			}

			tree.children.push({
				type: InlineTokenType.TAG,
				data: { value: raw.slice(1) },
				depth: tree.depth + 1,
				position: {
					start: symbols[0].position.start,
					end: tail(symbols).position.end,
				},
				symbols,
				closingSymbols: [],
				children: [],
			});
		} else if (symbol && symbol.type === SymbolType.TILDE && ahead && ahead.type === SymbolType.TILDE) {
			const symbols = [symbol];
			symbol = reader.next();
			symbols.push(symbol!);
			symbol = reader.next();

			while (symbol && back && back.type !== SymbolType.TILDE) {
				symbols.push(symbol);
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();
			}

			if (symbol && symbol.type === SymbolType.TILDE) {
				symbols.push(symbol);
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();

				tree.children.push(
					parseInline(symbols.slice(2, -2), {
						type: InlineTokenType.STRIKETHROUGH,
						data: null,
						depth: tree.depth + 1,
						position: {
							start: symbols[0].position.start,
							end: tail(symbols).position.end,
						},
						symbols: symbols.slice(0, 2),
						children: [],
						closingSymbols: symbols.slice(-2),
					}),
				);
			} else {
				tree.children.push(
					parseInline(symbols.slice(2), {
						type: InlineTokenType.TEXT,
						data: null,
						depth: tree.depth + 1,
						position: {
							start: symbols[0].position.start,
							end: tail(symbols).position.end,
						},
						symbols: symbols.slice(0, 2),
						children: [],
						closingSymbols: [],
					}),
				);
			}
		} else if (symbol && symbol.type === SymbolType.STAR) {
			if (ahead && ahead.type === SymbolType.STAR) {
				const symbols = [symbol];
				symbol = reader.next();
				symbols.push(symbol!);
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();

				while (symbol) {
					if (!symbol || (symbol.type === SymbolType.STAR && back && back.type === SymbolType.STAR)) {
						break;
					}
					symbols.push(symbol);
					symbol = reader.next();
					ahead = reader.lookAhead();
					back = reader.backTrack();
				}

				if (symbol && symbol.type === SymbolType.STAR) {
					symbols.push(symbol);
					symbol = reader.next();
					ahead = reader.lookAhead();
					back = reader.backTrack();

					tree.children.push(
						parseInline(symbols.slice(2, -2), {
							type: InlineTokenType.BOLD,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							children: [],
							symbols: symbols.slice(0, 2),
							closingSymbols: symbols.slice(-2),
						}),
					);
				} else {
					tree.children.push(
						parseInline(symbols.slice(2), {
							type: InlineTokenType.TEXT,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 2),
							children: [],
							closingSymbols: [],
						}),
					);
				}
			} else {
				const symbols = [symbol];
				let raw = symbol.value;
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();

				while (symbol && symbol.type !== SymbolType.STAR) {
					symbols.push(symbol);
					raw += symbol.value;
					symbol = reader.next();
					ahead = reader.lookAhead();
					back = reader.backTrack();
				}

				if (symbol) {
					symbols.push(symbol);
					raw += symbol.value;
					symbol = reader.next();

					tree.children.push(
						parseInline(symbols.slice(1, -1), {
							type: InlineTokenType.ITALIC,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 1),
							children: [],
							closingSymbols: symbols.slice(-1),
						}),
					);
				} else {
					tree.children.push(
						parseInline(symbols.slice(1), {
							type: InlineTokenType.TEXT,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 1),
							children: [],
							closingSymbols: [],
						}),
					);
				}
			}
		} else if (symbol && symbol.type === SymbolType.UNDERSCORE) {
			if (ahead && ahead.type === SymbolType.UNDERSCORE) {
				const symbols = [symbol];
				symbol = reader.next();
				symbols.push(symbol!);
				symbol = reader.next();

				while (symbol) {
					if (!symbol || (symbol.type === SymbolType.UNDERSCORE && back && back.type === SymbolType.UNDERSCORE)) {
						break;
					}
					symbols.push(symbol);
					symbol = reader.next();
					ahead = reader.lookAhead();
					back = reader.backTrack();
				}

				if (symbol && symbol.type === SymbolType.UNDERSCORE) {
					symbols.push(symbol);
					symbol = reader.next();
					ahead = reader.lookAhead();
					back = reader.backTrack();

					tree.children.push(
						parseInline(symbols.slice(2, -2), {
							type: InlineTokenType.BOLD,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 2),
							children: [],
							closingSymbols: symbols.slice(-2),
						}),
					);
				} else {
					tree.children.push(
						parseInline(symbols.slice(2), {
							type: InlineTokenType.TEXT,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 2),
							children: [],
							closingSymbols: [],
						}),
					);
				}
			} else {
				const symbols = [symbol];
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();

				while (symbol && symbol.type !== SymbolType.UNDERSCORE) {
					symbols.push(symbol);
					symbol = reader.next();
					ahead = reader.lookAhead();
					back = reader.backTrack();
				}

				if (symbol) {
					symbols.push(symbol);
					symbol = reader.next();

					tree.children.push(
						parseInline(symbols.slice(1, -1), {
							type: InlineTokenType.ITALIC,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 1),
							children: [],
							closingSymbols: symbols.slice(-1),
						}),
					);
				} else {
					tree.children.push(
						parseInline(symbols.slice(1), {
							type: InlineTokenType.TEXT,
							data: null,
							depth: tree.depth + 1,
							position: {
								start: symbols[0].position.start,
								end: tail(symbols).position.end,
							},
							symbols: symbols.slice(0, 1),
							children: [],
							closingSymbols: [],
						}),
					);
				}
			}
		} else if (symbol && symbol.type === SymbolType.BRACKET_OPEN && ahead && ahead.type === SymbolType.BRACKET_OPEN) {
			const symbols = [symbol];
			let raw = symbol.value;
			symbol = reader.next();
			symbols.push(symbol!);
			raw += symbol!.value;
			symbol = reader.next();
			ahead = reader.lookAhead();
			back = reader.backTrack();

			while (symbol && back && back.type !== SymbolType.BRACKET_CLOSE) {
				symbols.push(symbol);
				raw += symbol.value;
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();
			}

			if (symbol && symbol.type === SymbolType.BRACKET_CLOSE) {
				symbols.push(symbol);
				raw += symbol.value;
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();

				tree.children.push({
					type: InlineTokenType.LINK,
					data: {
						href: raw.slice(2, -2),
					},
					depth: tree.depth + 1,
					position: {
						start: symbols[0].position.start,
						end: tail(symbols).position.end,
					},
					children: [],
					symbols: symbols.slice(0, -2),
					closingSymbols: symbols.slice(-2),
				});
			} else {
				tree.children.push({
					type: InlineTokenType.TEXT,
					data: null,
					depth: tree.depth + 1,
					position: {
						start: symbols[0].position.start,
						end: tail(symbols).position.end,
					},
					children: [],
					symbols: symbols.slice(0, 2),
					closingSymbols: [],
				});
			}
		} else if (symbol && symbol.type === SymbolType.BACKTICK) {
			const symbols = [symbol];
			symbol = reader.next();
			ahead = reader.lookAhead();
			back = reader.backTrack();

			while (symbol && symbol.type !== SymbolType.BACKTICK) {
				symbols.push(symbol);
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();
			}

			if (symbol) {
				symbols.push(symbol);
				symbol = reader.next();

				tree.children.push(
					parseInline(symbols.slice(1, -1), {
						type: InlineTokenType.CODE,
						data: null,
						depth: tree.depth + 1,
						position: {
							start: symbols[0].position.start,
							end: tail(symbols).position.end,
						},
						symbols: symbols.slice(0, 1),
						children: [],
						closingSymbols: symbols.slice(-1),
					}),
				);
			} else {
				tree.children.push(
					parseInline(symbols.slice(1), {
						type: InlineTokenType.TEXT,
						data: null,
						depth: tree.depth + 1,
						position: {
							start: symbols[0].position.start,
							end: tail(symbols).position.end,
						},
						symbols: symbols.slice(0, 1),
						children: [],
						closingSymbols: [],
					}),
				);
			}
		} else {
			const symbols = [symbol];
			symbol = reader.next();
			ahead = reader.lookAhead();
			back = reader.backTrack();

			while (symbol && !forbiddenSymbols.includes(symbol.type)) {
				symbols.push(symbol);
				symbol = reader.next();
				ahead = reader.lookAhead();
				back = reader.backTrack();
			}

			tree.children.push({
				type: InlineTokenType.TEXT,
				data: null,
				depth: tree.depth + 1,
				position: {
					start: symbols[0].position.start,
					end: tail(symbols).position.end,
				},
				children: [],
				symbols,
				closingSymbols: [],
			});
		}
	}

	return tree;
};
