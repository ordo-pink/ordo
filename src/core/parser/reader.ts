import { Char, Reader } from "@core/parser/types";

export const createReader = (chars: Char[]): Reader => {
	let i = -1;

	return {
		next: () => {
			i++;

			if (i > chars.length - 1) {
				return null;
			}

			return chars[i];
		},
		current: () => (i < chars.length ? chars[i] : null),
		lookAhead: (offset = 1) => (i + offset < chars.length ? chars[i + offset] : null),
		backTrack: (offset = 1) => (i - offset > 0 ? chars[i - offset] : null),
		currentIndex: () => i,
		getChars: () => chars,
		length: chars.length,
	};
};
