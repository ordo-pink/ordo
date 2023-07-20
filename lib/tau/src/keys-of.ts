export type TKeysOf<T> = <T extends object>(o: T) => (keyof T)[]

export const keysOf = <T extends object>(o: T): (keyof T)[] => {
	return Object.keys(o) as (keyof T)[]
}
