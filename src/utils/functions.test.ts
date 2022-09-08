import test from "ava";

import { id, tap, noOpFn, NoOp, FoldVoid } from "./functions";

test("id: return what was provided", (t) => {
  const testedValue = id(1);
  const expectedResult = 1;

  t.is(testedValue, expectedResult);
});

test("tap: return what was provided", (t) => {
  const check = () => 123;
  const tapCheck = tap(check);

  const testedValue = tapCheck(2);
  const expectedResult = 2;

  t.is(testedValue, expectedResult);
});

test("tap: fire the provided function", (t) => {
  let x = 1;
  let y = 0;

  const check = () => (y = x + 1);
  const tapCheck = tap(check);

  const testedValue1 = tapCheck(x);
  const expectedResult1 = 1;

  const testedValue2 = y;
  const expectedResult2 = 2;

  t.is(testedValue1, expectedResult1);
  t.is(testedValue2, expectedResult2);
});

test("noOpFn: return undefined", (t) => {
  const testedValue = noOpFn();
  const expectedResult = undefined;

  t.is(testedValue, expectedResult);
});

test("NoOp: return null", (t) => {
  const testedValue = NoOp();
  const expectedResult = null;

  t.is(testedValue, expectedResult);
});

test("FoldVoid: return two noOpFns", (t) => {
  const testedValue1 = FoldVoid[0];
  const testedValue2 = FoldVoid[1];
  const expectedResult = noOpFn;

  t.deepEqual(testedValue1, expectedResult);
  t.deepEqual(testedValue2, expectedResult);
});
