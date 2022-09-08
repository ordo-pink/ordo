import test from "ava";
import { findCharOffset } from "./find-char-offset";

test("return offset of a char from the beginning of the document", (t) => {
  const tab: any = { content: { children: [{ raw: "Hello," }, { raw: "I'm a test document" }] } };
  const lineNumber = 2;
  const charNumber = 8;

  const testedValue = findCharOffset({ tab, lineNumber, charNumber });
  const expectedResult = 15;

  t.is(testedValue, expectedResult);
});
