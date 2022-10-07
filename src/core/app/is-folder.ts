import { OrdoFile, OrdoFolder } from "@core/app/types"

export const isFolder = (x: OrdoFile | OrdoFolder): x is OrdoFolder =>
  Boolean(x) && !(x as OrdoFile).extension
