export const debounce = <Args extends unknown[]>(
	func: (...args: Args) => unknown,
	timeout: number,
): ((...args: Args) => void) => {
	let timer: number | NodeJS.Timeout;

	return (...args: Args): void => {
		clearTimeout(timer as NodeJS.Timeout);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
