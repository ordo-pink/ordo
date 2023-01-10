import { EventBox, IBox } from "./box"

export const lazyBox =
  <T>(callback: (either: IBox<T>) => void) =>
  (x?: T) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback(EventBox.of(x ?? (null as any)))
  }
