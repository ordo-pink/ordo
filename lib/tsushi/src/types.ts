// deno-lint-ignore-file
// eslint-disable @typescript-eslint/no-explicit-any
import type { T } from "#lib/either/mod.ts"

export type ExpectFn = <T = unknown>(x?: T) => Expect<T>

export type FailedExpectation<T> = {
	expected: T
	got: T
}

export type MergeFn = <T>(
	...fs: Promise<T.Either<true, FailedExpectation<any>>>[]
) => Promise<T.Either<true, FailedExpectation<T>>>

export type TestCallbackFn<T> = (context: {
	expect: ExpectFn
	merge: MergeFn
	title: string
}) => Promise<T.Either<true, FailedExpectation<T>>>

export type GroupCallbackFn = (context: {
	test: ReturnType<TestFn>
	group: ReturnType<GroupFn>
	todo: ReturnType<TodoFn>
}) => any | Promise<any>

export type Expect<T> = {
	toPass: () => Promise<T.Either<true, FailedExpectation<T>>>
	toFail: () => Promise<T.Either<any, FailedExpectation<T>>>
	toEqual: (y: T) => Promise<T.Either<true, FailedExpectation<T>>>
	toBeInstanceOf: <K>(y: K) => Promise<T.Either<true, FailedExpectation<T>>>
	toBeTrue: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeFalse: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeTruthy: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeFalsy: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeNullish: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeObject: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeArray: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeNull: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeUndefined: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeBoolean: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeNumber: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeBigInt: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeString: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeSymbol: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeDate: () => Promise<T.Either<true, FailedExpectation<T>>>
	toBeFunction: () => Promise<T.Either<true, FailedExpectation<T>>>
}

export type GroupFn = (
	parentTitle?: string
) => (title: string, callback: GroupCallbackFn) => any | Promise<any>

export type TodoFn = (parentTitle?: string) => (title: string) => void

export type TestFn = (
	parentTitle?: string
) => <T>(
	title: string,
	callback: TestCallbackFn<T>,
	config?: TsushiConfig
) => Promise<T.Either<true, FailedExpectation<T>>>

export type TsushiConfig = {
	silent?: boolean
	noColor?: boolean
	skipTodo?: boolean
}
export type Tsushi = (config?: TsushiConfig) => {
	todo: ReturnType<TodoFn>
	group: ReturnType<GroupFn>
	test: ReturnType<TestFn>
}
