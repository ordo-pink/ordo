import { OrdoFile, OrdoDirectory } from "@core/app/types"

export const isDirectory = (x: OrdoFile | OrdoDirectory): x is OrdoDirectory =>
  Boolean(x) && !(x as OrdoFile).extension
