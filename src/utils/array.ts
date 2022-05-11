export const lastIndex = <T extends { length: number }>(arr: T) => arr.length - 1;

export const tail = <T extends any[] | string>(arr: T) => arr[lastIndex(arr)];
