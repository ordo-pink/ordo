import test from "ava";
import { createRoot } from "../../core/parser/create-root";
import { NodeWithChars, NodeWithChildren } from "../../core/parser/types";
import { TextNodeWithChildrenType } from "./enums";
import { parseText } from "./index";
import { CharType } from "../../core/parser/char-type";

test("define parent structure", (t) => {
  const tree = createRoot("path");

  parseText("Hello\n", tree);

  t.is(tree.raw, "Hello\n");
  t.is(tree.data.length, 6);
  t.is(tree.range.end.line, 2);
  t.is(tree.range.end.character, 0);
  t.is(tree.data.path, "path");
});

test("create separate lines", (t) => {
  const tree = createRoot("path");

  parseText("Hello\n\nWorld\n", tree);

  t.is(tree.children.length, 4);
});

test("assign ids", (t) => {
  const tree = createRoot("path");

  parseText("Yo!\n\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;
  const secondLine = tree.children[1] as NodeWithChildren;
  const firstLineContent = firstLine.children[0] as NodeWithChars;

  t.is(firstLine.id, "1-1");
  t.is(secondLine.id, "1-2");
  t.is(firstLineContent.id, "1-1-1");
});

test("assign depth", (t) => {
  const tree = createRoot("path");

  parseText("Line 1\n\nLine 2", tree);

  const firstLine = tree.children[0] as NodeWithChildren;
  const secondLine = tree.children[1] as NodeWithChildren;
  const firstLineContent = firstLine.children[0] as NodeWithChars;

  t.is(firstLine.depth, 1);
  t.is(secondLine.depth, 1);
  t.is(firstLineContent.depth, 2);
});

test("assign positions", (t) => {
  const tree = createRoot("path");

  parseText("Line 1\n\nAnother line\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;
  const secondLine = tree.children[1] as NodeWithChildren;
  const thirdLine = tree.children[2] as NodeWithChildren;
  const fourthLine = tree.children[3] as NodeWithChildren;
  const firstLineContent = firstLine.children[0] as NodeWithChars;
  const secondLineContent = secondLine.children[0] as NodeWithChars;
  const thirdLineContent = thirdLine.children[0] as NodeWithChars;
  const fourthLineContent = fourthLine.children[0] as NodeWithChars;

  t.is(firstLine.range.start.line, 1);
  t.is(firstLine.range.end.line, 1);
  t.is(firstLine.range.start.character, 1);
  t.is(firstLine.range.end.character, 6);

  t.is(secondLine.range.start.line, 2);
  t.is(secondLine.range.end.line, 2);
  t.is(secondLine.range.start.character, 0);
  t.is(secondLine.range.end.character, 0);

  t.is(thirdLine.range.start.line, 3);
  t.is(thirdLine.range.end.line, 3);
  t.is(thirdLine.range.start.character, 1);
  t.is(thirdLine.range.end.character, 12);

  t.is(fourthLine.range.start.line, 4);
  t.is(fourthLine.range.end.line, 4);
  t.is(fourthLine.range.start.character, 0);
  t.is(fourthLine.range.end.character, 0);

  t.is(firstLineContent.range.start.line, 1);
  t.is(firstLineContent.range.end.line, 1);
  t.is(firstLineContent.range.start.character, 1);
  t.is(firstLineContent.range.end.character, 6);

  t.is(secondLineContent, undefined as any);

  t.is(thirdLineContent.range.start.line, 3);
  t.is(thirdLineContent.range.end.line, 3);
  t.is(thirdLineContent.range.start.character, 1);
  t.is(thirdLineContent.range.end.character, 12);

  t.is(fourthLineContent, undefined as any);
});

test("parse heading 1", (t) => {
  const tree = createRoot("path");

  parseText("# Yo!\n\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;

  t.is(firstLine.depth, 1);
  t.is(firstLine.type, TextNodeWithChildrenType.HEADING);
  t.is(firstLine.raw, "# Yo!");
});

test("parse heading 2", (t) => {
  const tree = createRoot("path");

  parseText("## Yo!\n\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;

  t.is(firstLine.depth, 2);
  t.is(firstLine.type, TextNodeWithChildrenType.HEADING);
  t.is(firstLine.raw, "## Yo!");
});

test("parse heading 3", (t) => {
  const tree = createRoot("path");

  parseText("### Yo!\n\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;

  t.is(firstLine.depth, 3);
  t.is(firstLine.type, TextNodeWithChildrenType.HEADING);
  t.is(firstLine.raw, "### Yo!");
});

test("parse heading 4", (t) => {
  const tree = createRoot("path");

  parseText("#### Yo!\n\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;

  t.is(firstLine.depth, 4);
  t.is(firstLine.type, TextNodeWithChildrenType.HEADING);
  t.is(firstLine.raw, "#### Yo!");
});

test("parse heading 5", (t) => {
  const tree = createRoot("path");

  parseText("##### Yo!\n\n", tree);

  const firstLine = tree.children[0] as NodeWithChildren;

  t.is(firstLine.depth, 5);
  t.is(firstLine.type, TextNodeWithChildrenType.HEADING);
  t.is(firstLine.raw, "##### Yo!");
});

test("parse nested paragraph", (t) => {
  const tree = createRoot("path");

  parseText("### Yo!\n\nSome text", tree);

  const thirdLine = tree.children[2] as NodeWithChildren;

  t.is(thirdLine.depth, 4);
  t.is(thirdLine.type, TextNodeWithChildrenType.PARAGRAPH);
  t.is(thirdLine.raw, "Some text");
});
