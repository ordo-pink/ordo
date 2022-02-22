import test from "ava";
import { OpenOrdoFile } from "../../../application/types";
import { handleEnter } from "./enter";

const initial = (): OpenOrdoFile =>
	({
		body: [
			["h", "e", "l", "l", "o", " "],
			["w", "o", "r", "l", "d", " "],
		],
		selection: {
			start: {
				line: 0,
				index: 0,
			},
			end: {
				line: 0,
				index: 0,
			},
			direction: "ltr",
		},
	} as OpenOrdoFile);

test("Enter press at the beginning of the line should prepend a new line above", (t) => {
	const handled = handleEnter(initial(), {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});
	t.deepEqual(handled.body, [[" "], ["h", "e", "l", "l", "o", " "], ["w", "o", "r", "l", "d", " "]]);
	t.deepEqual(handled.selection, { start: { line: 1, index: 0 }, end: { line: 1, index: 0 }, direction: "ltr" });
});

test("Enter press at the end of the line should append a new line and focus there", (t) => {
	const stateCopy = initial();
	stateCopy.selection.start.index = stateCopy.selection.end.index = 6;

	const handled = handleEnter(stateCopy, {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});

	t.deepEqual(handled.body, [["h", "e", "l", "l", "o", " "], [" "], ["w", "o", "r", "l", "d", " "]]);
	t.deepEqual(handled.selection, { start: { line: 1, index: 0 }, end: { line: 1, index: 0 }, direction: "ltr" });
});

test("Enter press at the end of the last line should append a new line and focus there", (t) => {
	const stateCopy = initial();
	stateCopy.selection.start.index = stateCopy.selection.end.index = 6;
	stateCopy.selection.start.line = stateCopy.selection.end.line = 1;

	const handled = handleEnter(stateCopy, {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});

	t.deepEqual(handled.body, [["h", "e", "l", "l", "o", " "], ["w", "o", "r", "l", "d", " "], [" "]]);
	t.deepEqual(handled.selection, { start: { line: 2, index: 0 }, end: { line: 2, index: 0 }, direction: "ltr" });
});

test("Enter press in the middle of the line should move the rightmost part of the line to the next line", (t) => {
	const stateCopy = initial();
	stateCopy.selection.start.index = stateCopy.selection.end.index = 3;

	const handled = handleEnter(stateCopy, {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});

	t.deepEqual(handled.body, [
		["h", "e", "l", " "],
		["l", "o", " "],
		["w", "o", "r", "l", "d", " "],
	]);
	t.deepEqual(handled.selection, { start: { line: 1, index: 0 }, end: { line: 1, index: 0 }, direction: "ltr" });
});

test("Enter press with a selection within one line should drop the content of the selection content", (t) => {
	const stateCopy = initial();
	stateCopy.selection.start.index = 3;
	stateCopy.selection.end.index = 4;

	const handled = handleEnter(stateCopy, {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});

	t.deepEqual(handled.body, [
		["h", "e", "l", " "],
		["o", " "],
		["w", "o", "r", "l", "d", " "],
	]);
	t.deepEqual(handled.selection, { start: { line: 1, index: 0 }, end: { line: 1, index: 0 }, direction: "ltr" });
});

test("Enter press with a selection within multiple lines should drop the content of the selection content", (t) => {
	const stateCopy = initial();
	stateCopy.selection.start.index = 3;
	stateCopy.selection.end.index = 4;

	let handled = handleEnter(stateCopy, {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});

	handled.selection.start.index = 2;
	handled.selection.start.line = 0;
	handled.selection.end.index = 3;
	handled.selection.end.line = 2;

	handled = handleEnter(stateCopy, {
		key: "Enter",
		shiftKey: false,
		altKey: false,
		metaKey: false,
		ctrlKey: false,
	});

	t.deepEqual(handled.body, [["h", "e", " "], [" "], ["l", "d", " "]]);
	t.deepEqual(handled.selection, { start: { line: 1, index: 0 }, end: { line: 1, index: 0 }, direction: "ltr" });
});
