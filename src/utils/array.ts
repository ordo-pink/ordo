export const lastIndex = <T extends { length: number }>(arr: T) => arr.length - 1;

export const tail = <T>(arr: T[]): T => arr[lastIndex(arr)];

export const indicesOf = (substr: string) => (str: string) => {
	const indices = [];

	let i = -1;

	while ((i = str.indexOf(substr, i + 1)) >= 0) {
		indices.push(i);
	}

	return indices;
};
