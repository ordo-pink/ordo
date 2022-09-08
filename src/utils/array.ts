/**
 * Get the last existing index of the array.
 */
export const lastIndex = <T extends { length: number }>(arr: T) => arr.length - 1;

/**
 * Get the last element of the array.
 */
export const tail = <T>(arr: T[]): T => arr[lastIndex(arr)];
