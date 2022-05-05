export const debounce = <TArgs extends any[]>(func: (...args: TArgs) => any, timeout = 500) => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return async (...args: TArgs) => {
		if (timer != null) {
			await func.apply(this, args);
		}

		timer && clearTimeout(timer);

		timer = setTimeout(() => {
			timer = undefined;
		}, timeout);
	};
};
