export const thunkify =
	<T>(x: T) =>
	(): T =>
		x
