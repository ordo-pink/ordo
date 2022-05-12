import { tap } from "@utils/functions";

export const preventDefault = <T extends { preventDefault: () => void }>(e: T) => e.preventDefault();
export const stopPropagation = <T extends { stopPropagation: () => void }>(e: T) => e.stopPropagation();
export const tapPreventDefault = tap(preventDefault);
export const tapStopPropagation = tap(stopPropagation);
