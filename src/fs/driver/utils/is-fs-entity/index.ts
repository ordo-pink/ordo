import { OrdoFile, OrdoDirectory, Nullable } from "$core/types"

export const isOrdoDirectory = (x: Nullable<OrdoFile | OrdoDirectory>): x is OrdoDirectory =>
  Boolean(x) && (x as OrdoFile).extension == null && Array.isArray((x as OrdoDirectory).children)

export const isOrdoFile = (x: Nullable<OrdoFile | OrdoDirectory>): x is OrdoDirectory =>
  Boolean(x) && (x as OrdoFile).extension != null && (x as OrdoDirectory).children == null
