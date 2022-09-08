import test from "ava";
import { getIndicesOfSubstring } from "./string";

const targetString = "hello world";

test("indicesOf: return indices of substring occurrences in a string", (t) => {
  const getAllOccurrencesOfL = getIndicesOfSubstring("l");

  const testedValue = getAllOccurrencesOfL(targetString);
  const exprectedResult = [2, 3, 9];

  t.deepEqual(testedValue, exprectedResult);
});

test("indicesOf: return [] if no substring occurrences found", (t) => {
  const getAllOccurrencesOfX = getIndicesOfSubstring("x");

  const testedValue = getAllOccurrencesOfX(targetString);
  const expectedResult: any[] = [];

  t.deepEqual(testedValue, expectedResult);
});
