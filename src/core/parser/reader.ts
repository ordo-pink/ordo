import { Char, Reader } from "@core/parser/types";

export const createReader = (chars: Char[], currentIndex = -1): Reader => {
  return {
    next: () => {
      currentIndex++;

      const hasNoMoreChars = currentIndex > chars.length - 1;

      if (hasNoMoreChars) return null;

      return chars[currentIndex];
    },
    current: () => {
      const outOfBounds = currentIndex >= chars.length;

      if (outOfBounds) return null;

      return chars[currentIndex];
    },
    lookAhead: (offset = 1) => {
      const indexWithOffset = currentIndex + offset;
      const outOfBounds = indexWithOffset >= chars.length;

      if (outOfBounds) return null;

      return chars[indexWithOffset];
    },
    backTrack: (offset = 1) => createReader(chars, currentIndex).lookAhead(-Math.abs(offset)),
    currentIndex: () => currentIndex,
    getChars: () => chars,
    length: chars.length,
  };
};
