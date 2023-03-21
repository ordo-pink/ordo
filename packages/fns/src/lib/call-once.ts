// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const callOnce = <T extends any[], R>(fn: (...args: T) => R) => {
  let wasCalled = false

  return (...args: T): R => {
    if (wasCalled) throw new Error("Attempted to call a single call function twice.")

    const result = fn(...args)

    wasCalled = true

    return result
  }
}
