import test from "ava";
import { tail, lastIndex } from "./array";

const arr = [1, 2, 3];

test("lastIndex: return the last available index of the array", (t) => {
  const testedValue = lastIndex(arr);
  const exprectedResult = 2;

  t.is(testedValue, exprectedResult);
});

test("tail: return the last element of the array", (t) => {
  const testedValue = tail(arr);
  const expectedResult = 3;

  t.is(testedValue, expectedResult);
});
