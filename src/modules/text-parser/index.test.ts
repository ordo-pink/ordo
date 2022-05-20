import test from "ava";
import { createRoot } from "../../core/parser/create-root";
import { NodeWithChars, NodeWithChildren } from "../../core/parser/types";
import { parseText } from "./index";

test("define parent structure", (t) => {
	const tree = createRoot("path");

	parseText("Hello\n\n", tree);

	t.is(tree.raw, "Hello\n\n");
	t.is(tree.length, 7);
	t.is(tree.range.end.character, 7);
	t.is(tree.range.end.line, 2);
	t.is(tree.path, "path");
});

test("create separate lines", (t) => {
	const tree = createRoot("path");

	parseText("Hello\n\nWorld\n", tree);

	t.is(tree.children.length, 3);
});

test("assign ids", (t) => {
	const tree = createRoot("path");

	parseText("Yo!\n\n", tree);

	const firstLine = tree.children[0] as NodeWithChildren;
	const secondLine = tree.children[1] as NodeWithChildren;
	const firstLineContent = firstLine.children[0] as NodeWithChars;
	const secondLineContent = secondLine.children[0] as NodeWithChars;

	t.is(firstLine.id, "1-1");
	t.is(secondLine.id, "1-2");
	t.is(firstLineContent.id, "1-1-1");
	t.is(secondLineContent.id, "1-2-1");
});

test("assign depth", (t) => {
	const tree = createRoot("path");

	parseText("Line 1\n\nLine 2", tree);

	const firstLine = tree.children[0] as NodeWithChildren;
	const secondLine = tree.children[1] as NodeWithChildren;
	const firstLineContent = firstLine.children[0] as NodeWithChars;
	const secondLineContent = secondLine.children[0] as NodeWithChars;

	t.is(firstLine.depth, 1);
	t.is(secondLine.depth, 1);
	t.is(firstLineContent.depth, 2);
	t.is(secondLineContent.depth, 2);
});

test("assign positions", (t) => {
	const tree = createRoot("path");

	parseText("Line 1\n\nAnother line\n", tree);

	const firstLine = tree.children[0] as NodeWithChildren;
	const secondLine = tree.children[1] as NodeWithChildren;
	const thirdLine = tree.children[2] as NodeWithChildren;
	const firstLineContent = firstLine.children[0] as NodeWithChars;
	const secondLineContent = secondLine.children[0] as NodeWithChars;
	const thirdLineContent = thirdLine.children[0] as NodeWithChars;

	t.is(firstLine.range.start.line, 1);
	t.is(firstLine.range.end.line, 1);
	t.is(firstLine.range.start.character, 1);
	t.is(firstLine.range.end.character, 6);

	t.is(secondLine.range.start.line, 2);
	t.is(secondLine.range.end.line, 2);
	t.is(secondLine.range.start.character, 1);
	t.is(secondLine.range.end.character, 1);

	t.is(thirdLine.range.start.line, 3);
	t.is(thirdLine.range.end.line, 3);
	t.is(thirdLine.range.start.character, 1);
	t.is(thirdLine.range.end.character, 12);

	t.is(firstLineContent.range.start.line, 1);
	t.is(firstLineContent.range.end.line, 1);
	t.is(firstLineContent.range.start.character, 1);
	t.is(firstLineContent.range.end.character, 6);

	t.is(secondLineContent.range.start.line, 2);
	t.is(secondLineContent.range.end.line, 2);
	t.is(secondLineContent.range.start.character, 1);
	t.is(secondLineContent.range.end.character, 1);

	t.is(thirdLineContent.range.start.line, 3);
	t.is(thirdLineContent.range.end.line, 3);
	t.is(thirdLineContent.range.start.character, 1);
	t.is(thirdLineContent.range.end.character, 12);
});
