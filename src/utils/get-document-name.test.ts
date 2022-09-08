import test from "ava";
import { getDocumentName } from "./get-document-name";

test("return document name without .md if it has .md extension", (t) => {
  const testedValue = getDocumentName("test.md");
  const expectedResult = "test";

  t.is(testedValue, expectedResult);
});

test("return unchanged name if the document has no extension", (t) => {
  const testedValue = getDocumentName("test");
  const expectedResult = "test";

  t.is(testedValue, expectedResult);
});

test("return unchanged name if the document has a different extension", (t) => {
  const testedValue = getDocumentName("test.png");
  const expectedResult = "test.png";

  t.is(testedValue, expectedResult);
});
