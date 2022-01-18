export type Optional<T> = T | undefined

export type UnaryFn<T, R> = (x: T) => R

export type OrdoEvent<T extends string, K extends string, Args = void> = Args extends void
	? [`@${T}/${K}`]
	: [`@${T}/${K}`, Args]
