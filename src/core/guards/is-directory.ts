import { OrdoFile, OrdoDirectory, Nullable } from "$core/types"

export const isDirectory = (x: Nullable<OrdoFile | OrdoDirectory>): x is OrdoDirectory =>
  Boolean(x) && (x as OrdoFile).extension == null
