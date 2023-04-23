import { ExtensionCreatorContext } from "./extensions"
import { IOrdoDirectory } from "./fs/ordo-directory"
import { UnaryFn } from "./types"

export type AuthInfo =
  | {
      isAuthenticated: false
    }
  | {
      isAuthenticated: true
      credentials: {
        token?: string
        sub: string
      }
    }

export type OrdoDrive = {
  params: {
    maxUploadSize: number
    maxTotalSize: number
  }
  root: IOrdoDirectory
}

export type UserInfo = {
  auth: AuthInfo
  extensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, void> }>[]
}
