import test from "ava"

import { Either } from "./eithers"
import { id } from "./functions"

test("Either.fromNullable should create a right for non-nullable values", (t) => {
	t.true(Either.fromNullable(123).isRight)
	t.is(Either.fromNullable(123).fold(id, id), 123)
})

test("Either.fromNullable should create a right for falsy values", (t) => {
	t.true(Either.fromNullable("").isRight)
	t.true(Either.fromNullable(0).isRight)
	t.is(Either.fromNullable(0).fold(id, id), 0)
})

test("Either.fromNullable should create a left for undefined", (t) => {
	t.true(Either.fromNullable(undefined).isLeft)
	t.is(Either.fromNullable(undefined).fold(id, id), null)
})

test("Either.fromNullable should create a left for null", (t) => {
	t.true(Either.fromNullable(null).isLeft)
	t.is(Either.fromNullable(null).fold(id, id), null)
})

test("Either.fromEmptyArray should return an left if provided array is empty", (t) => {
	t.true(Either.fromEmptyArray([]).isLeft)
	t.deepEqual(Either.fromEmptyArray([]).fold(id, id), [])
})

test("Either.fromEmptyArray should return an right if provided array is not empty", (t) => {
	t.true(Either.fromEmptyArray([123]).isRight)
	t.deepEqual(Either.fromEmptyArray([123]).fold(id, id), [123])
})

test("Either.fromBoolean should return an left if provided boolean is true", (t) => {
	t.true(Either.fromBoolean(false).isLeft)
	t.false(Either.fromBoolean(false).fold(id, id))
})

test("Either.fromBoolean should return an right if provided boolean is false", (t) => {
	t.true(Either.fromBoolean(true).isRight)
	t.true(Either.fromBoolean(true).fold(id, id))
})
