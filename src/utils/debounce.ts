export const debounce = <TArgs extends any[]>(func: (...args: TArgs) => any, timeout = 500) => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return (...args: TArgs) => {
		if (timer != null) {
			func.apply(this, args);
		}

		timer && clearTimeout(timer);

		timer = setTimeout(() => {
			timer = undefined;
		}, timeout);
	};
};
