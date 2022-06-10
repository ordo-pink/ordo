import { CharType } from "@core/parser/char-type";
import { isNodeWithChars, isNodeWithChildren } from "@core/parser/is";
import { NodeWithChildren, Char, Node } from "@core/parser/types";
import { OrdoEventHandler } from "@core/types";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { parseLine, createNodeWithChildren } from "@modules/text-parser";
import { TextNodeWithChildrenType } from "@modules/text-parser/enums";
import { tail } from "@utils/array";
import { collectFrontmatterValues } from "../utils/collect-frontmatter-values";

const findChar = (tree: Node, line: number, character: number): Char | null => {
	if (isNodeWithChildren(tree)) {
		for (const child of tree.children) {
			const found = findChar(child, line, character);
			if (found) {
				return found;
			}
		}
	} else if (isNodeWithChars(tree)) {
		return tree.chars.find((char) => char.position.line === line && char.position.character === character) ?? null;
	}

	return null;
};

export const handleTyping: OrdoEventHandler<"@editor/handle-typing"> = ({ draft, payload, transmission }) => {
	if (!draft.editor.focused) {
		return;
	}

	const tab = draft.editor.tabs.find((t) => t.path === payload.path);
	const file = findOrdoFile(draft.fileExplorer.tree, "path", payload.path);

	if (!tab || !file) return;

	const currentLine = tab.content.children.find((node) => node.range.start.line === tab.caretPositions[0].start.line);

	if (!currentLine) return;

	if (
		payload.event.key === "Shift" ||
		payload.event.key === "Alt" ||
		payload.event.key === "Control" ||
		payload.event.key === "Insert" ||
		payload.event.key === "Meta" ||
		payload.event.key === "F1" ||
		payload.event.key === "F2" ||
		payload.event.key === "F3" ||
		payload.event.key === "F4" ||
		payload.event.key === "F5" ||
		payload.event.key === "F6" ||
		payload.event.key === "F7" ||
		payload.event.key === "F8" ||
		payload.event.key === "F9" ||
		payload.event.key === "F10" ||
		payload.event.key === "F11" ||
		payload.event.key === "F12" ||
		payload.event.key === "AltGraph" ||
		payload.event.key === "Tab" ||
		payload.event.key === "CapsLock" ||
		payload.event.key === "NumLock" ||
		payload.event.key === "PrintScreen" ||
		payload.event.key === "Pause"
	) {
		return;
	} else if (payload.event.key === "Escape") {
		if (tab.caretPositions.length > 1) {
			tab.caretPositions = [tail(tab.caretPositions)];
		}
	} else if (payload.event.key === "ArrowRight") {
		tab.caretPositions.forEach((position) => {
			if (position.start.character === currentLine.range.end.character) {
				if (position.start.line === tail(tab.content.children).range.start.line) {
					position.start.character = tail(tab.content.children).range.end.character;
					return;
				}
				position.start.line++;
				position.start.character = 0;
			} else {
				if (payload.event.ctrlKey) {
					const char = findChar(
						tab.content.children[position.start.line - 1],
						position.start.line,
						position.start.character + 1,
					);

					if (!char) {
						position.start.character = tab.content.children[position.start.line - 1].range.end.character;
					} else {
						let nextNonChar: Char | null = char;

						while (nextNonChar && (nextNonChar.type === CharType.CHAR || nextNonChar.type === CharType.OCTET)) {
							nextNonChar = findChar(
								tab.content.children[position.start.line - 1],
								position.start.line,
								nextNonChar.position.character + 1,
							);
						}

						position.start.character =
							nextNonChar?.position.character || tab.content.children[position.start.line - 1].range.end.character;
					}
				} else {
					position.start.character++;
				}
			}
		});
	} else if (payload.event.key === "ArrowLeft") {
		tab.caretPositions.forEach((position) => {
			if (position.start.character === 0) {
				if (position.start.line === 1) {
					return;
				}
				position.start.line--;
				position.start.character = tab.content.children[position.start.line - 1].range.end.character;
			} else {
				if (payload.event.ctrlKey) {
					const char = findChar(
						tab.content.children[position.start.line - 1],
						position.start.line,
						position.start.character - 1,
					);

					if (!char) {
						position.start.character = 0;
					} else {
						let previousNonChar: Char | null = char;

						while (previousNonChar && (previousNonChar.type === CharType.CHAR || previousNonChar.type === CharType.OCTET)) {
							previousNonChar = findChar(
								tab.content.children[position.start.line - 1],
								position.start.line,
								previousNonChar.position.character - 1,
							);
						}

						position.start.character = previousNonChar?.position.character || 0;
					}
				} else {
					position.start.character--;
				}
			}
		});
	} else if (payload.event.key === "ArrowUp") {
		tab.caretPositions.forEach((position) => {
			if (position.start.line === 1) {
				position.start.character = 0;
				return;
			}
			position.start.line--;
			if (tab.content.children[position.start.line - 1].range.end.character <= position.start.character) {
				position.start.character = tab.content.children[position.start.line - 1].range.end.character;
			}
		});
	} else if (payload.event.key === "ArrowDown") {
		tab.caretPositions.forEach((position) => {
			if (position.start.line === tail(tab.content.children).range.end.line) {
				position.start.character = tail(tab.content.children).range.end.character;
				return;
			}
			position.start.line++;
			if (tab.content.children[position.start.line - 1].range.end.character <= position.start.character) {
				position.start.character = tab.content.children[position.start.line - 1].range.end.character;
			}
		});
	} else if (payload.event.key === "Delete") {
		let reparse = false;

		tab.caretPositions.forEach((position) => {
			const lineIndex = position.start.line - 1;
			const charPosition = position.start.character;
			const line = tab.content.children[lineIndex] as NodeWithChildren;

			if (charPosition === tab.content.children[lineIndex].raw.length) {
				if (lineIndex === tab.content.children.length - 1) {
					return;
				}

				tab.content.children[lineIndex].raw = tab.content.children[lineIndex].raw + tab.content.children[lineIndex + 1].raw;

				tab.content.children.splice(lineIndex + 1, 1);

				reparse = true;
			} else {
				tab.content.children[lineIndex].raw = line.raw.slice(0, charPosition).concat(line.raw.slice(charPosition + 1));

				tab.content.children[lineIndex] = parseLine(tab.content.children[lineIndex].raw, lineIndex, tab.content, {
					depth: tab.content.depth,
				});
			}
		});

		if (reparse) {
			tab.content.children.forEach((line, index) => {
				tab.content.children[index] = parseLine(line.raw, index, tab.content, {
					depth: tab.content.depth,
				});
			});
		}
	} else if (payload.event.key === "Backspace") {
		let reparse = false;

		tab.caretPositions.forEach((position) => {
			const lineIndex = position.start.line - 1;
			const charPosition = position.start.character;

			if (charPosition === 0) {
				if (lineIndex === 0) {
					return;
				}

				position.start.line--;
				position.start.character = tab.content.children[lineIndex - 1].raw.length;

				tab.content.children[lineIndex - 1].raw =
					tab.content.children[lineIndex - 1].raw + tab.content.children[lineIndex].raw;

				tab.content.children.splice(lineIndex, 1);

				reparse = true;
			} else {
				tab.content.children[lineIndex].raw =
					tab.content.children[lineIndex].raw.slice(0, charPosition - 1) +
					tab.content.children[lineIndex].raw.slice(charPosition);
				position.start.character--;

				tab.content.children[lineIndex] = parseLine(tab.content.children[lineIndex].raw, lineIndex, tab.content, {
					depth: tab.content.depth,
				});
			}
		});

		if (reparse) {
			tab.content.children.forEach((line, index) => {
				tab.content.children[index] = parseLine(line.raw, index, tab.content, {
					depth: tab.content.depth,
				});
			});
		}
	} else if (payload.event.key === "Enter") {
		// TODO: Fix backspace and enter with multiple carets
		tab.caretPositions.forEach((position) => {
			const lineIndex = position.start.line - 1;
			const raw = tab.content.children[lineIndex].raw.slice(position.start.character);

			tab.content.children[lineIndex].raw = tab.content.children[lineIndex].raw.slice(0, position.start.character);

			position.start.line = position.start.line + 1;
			position.start.character = 0;

			const node = createNodeWithChildren(
				TextNodeWithChildrenType.PARAGRAPH,
				tab.content,
				{ position: { character: 1, line: lineIndex + 1 } } as Char,
				raw,
				tab.content.depth + 1,
			);
			node.raw = raw;

			tab.content.children.splice(lineIndex + 1, 0, node);
		});

		tab.content.children.forEach((line, index) => {
			tab.content.children[index] = parseLine(line.raw, index, tab.content, {
				depth: tab.content.depth,
			});
		});
	} else {
		if (payload.event.ctrlKey || payload.event.altKey || payload.event.metaKey) {
			return;
		}

		tab.caretPositions.forEach((position) => {
			const lineIndex = position.start.line - 1;
			const charPosition = position.start.character;

			const newLine =
				tab.content.children[lineIndex].raw.slice(0, charPosition) +
				(payload.event.shiftKey ? payload.event.key.toUpperCase() : payload.event.key) +
				tab.content.children[lineIndex].raw.slice(charPosition);
			tab.content.children[lineIndex].raw = newLine;

			tab.content.children[lineIndex] = parseLine(tab.content.children[lineIndex].raw, lineIndex, tab.content, {
				depth: tab.content.depth,
			});

			position.start.character++;
			position.end.character = position.start.character;
		});
	}

	tab.content.raw = tab.content.children.map((line) => line.raw).join("\n");

	file.size = new TextEncoder().encode(tab.raw === "\n" ? "" : tab.content.raw).length;

	collectFrontmatterValues(file, tab);

	transmission.emit("@file-explorer/save-file", { path: file.path, content: tab.content.raw });
};
