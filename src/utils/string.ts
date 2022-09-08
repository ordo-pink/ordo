/**
 * Get indices of substring occurrences in a string.
 */
export const getIndicesOfSubstring = (substring: string) => (sourceString: string) => {
  const indices = [];

  for (let i = sourceString.indexOf(substring); i >= 0; i = sourceString.indexOf(substring, i + 1)) {
    indices.push(i);
  }

  return indices;
};
