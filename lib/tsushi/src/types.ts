// deno-lint-ignore-file
// eslint-disable @typescript-eslint/no-explicit-any
import { TEither } from "#lib/either/mod.ts"
import { CLIConfig } from "#lib/clib/mod.ts"

export type ExpectFn = <T = unknown>(x?: T) => Expect<T>

export type FailedExpectation<T> = {
	expected: T
	got: T
}

export type MergeFn = <T>(
	...fs: Promise<TEither<true, FailedExpectation<any>>>[]
) => Promise<TEither<true, FailedExpectation<T>>>

export type TestCallbackFn<T> = (context: {
	expect: ExpectFn
	merge: MergeFn
	title: string
}) => Promise<TEither<true, FailedExpectation<T>>>

export type GroupCallbackFn = (context: {
	test: ReturnType<TestFn>
	group: ReturnType<GroupFn>
	todo: ReturnType<TodoFn>
}) => any | Promise<any>

export type Expect<T> = {
	toPass: () => Promise<TEither<true, FailedExpectation<T>>>
	toFail: () => Promise<TEither<any, FailedExpectation<T>>>
	toEqual: (y: T) => Promise<TEither<true, FailedExpectation<T>>>
	toBeInstanceOf: <K>(y: K) => Promise<TEither<true, FailedExpectation<T>>>
	toBeTrue: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeFalse: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeTruthy: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeFalsy: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeNullish: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeObject: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeArray: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeNull: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeUndefined: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeBoolean: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeNumber: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeBigInt: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeString: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeSymbol: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeDate: () => Promise<TEither<true, FailedExpectation<T>>>
	toBeFunction: () => Promise<TEither<true, FailedExpectation<T>>>
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
) => Promise<TEither<true, FailedExpectation<T>>>

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
