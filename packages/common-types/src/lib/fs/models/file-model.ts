import { BinaryFn, QuadrinomialFn, TernaryFn, UnaryFn } from "../../types"
import { UserID } from "../common"
import { OrdoFilePath, IOrdoFile, IOrdoFileInitParams } from "../ordo-file"

export type IOrdoFileModel<Content> = {
  exists: UnaryFn<OrdoFilePath, Promise<boolean>>
  create:
    | BinaryFn<IOrdoFileInitParams, UserID, Promise<IOrdoFile>>
    | TernaryFn<IOrdoFileInitParams, UserID, Content, Promise<IOrdoFile>>
  get: BinaryFn<OrdoFilePath, UserID, Promise<IOrdoFile>>
  update:
    | TernaryFn<OrdoFilePath, UserID, IOrdoFile, Promise<IOrdoFile>>
    | QuadrinomialFn<OrdoFilePath, UserID, IOrdoFile, boolean, Promise<IOrdoFile>>
  remove: BinaryFn<OrdoFilePath, UserID, Promise<IOrdoFile>>
  getContent: BinaryFn<OrdoFilePath, UserID, Promise<Content>>
  updateContent: TernaryFn<OrdoFilePath, UserID, Content, Promise<IOrdoFile>>
}
