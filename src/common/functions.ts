import { UnaryFn } from "./types";

export const id = <T>(x: T): T => x;

export const tap =
	<T, K>(f: UnaryFn<T, K>) =>
	(x: T): T => {
		f(x);

		return x;
	};
