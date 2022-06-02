/**
 * A set of colors supported natively in Ordo for file and folder customisation.
 */
export const Colors = ["neutral", "red", "pink", "orange", "yellow", "green", "blue", "purple"] as const;

export type Color = typeof Colors[number];
