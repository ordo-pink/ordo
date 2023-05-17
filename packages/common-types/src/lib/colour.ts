export const Colours = [
  "neutral",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
] as const

export type Colour = (typeof Colours)[number]
