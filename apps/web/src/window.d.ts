import type { UnaryFn } from "@ordo-pink/common-types"
import type {
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  OrdoFilePath,
  OrdoDirectoryPath,
} from "@ordo-pink/fs-entity"
import { OrdoExtensionName } from "./core/types"

declare global {
  interface Window {
    ordo: {
      env: {
        type: "electron" | "browser"
        fetch: typeof fetch
        openExternal: UnaryFn<string, void>
      }
      api: {
        fs: {
          files: {
            get: UnaryFn<OrdoFilePath, Promise<string>>
            getRaw: UnaryFn<OrdoFilePath, ReturnType<typeof fetch>>
            getBlob: UnaryFn<OrdoFilePath, Promise<Blob>>
            create: UnaryFn<
              { path: OrdoFilePath; content?: string },
              Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
            >
            move: UnaryFn<
              { oldPath: OrdoFilePath; newPath: OrdoFIlePath },
              Promise<IOrdoFileRaw | IOrdoDirectoryRaw>
            >
            update: UnaryFn<{ path: OrdoFilePath; content: string }, Promise<IOrdoFileRaw>>
            remove: UnaryFn<OrdoFilePath, Promise<IOrdoFileRaw>>
          }
          directories: {
            get: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
            create: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
            move: UnaryFn<
              { oldPath: OrdoDirectoryPath; newPath: OrdoDirectoryPath },
              Promise<IOrdoDirectoryRaw>
            >
            remove: UnaryFn<OrdoDirectoryPath, Promise<IOrdoDirectoryRaw>>
          }
        }
        extensions: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          get: UnaryFn<OrdoExtensionName, Promise<any>>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: UnaryFn<{ name: OrdoExtensionName; content?: any }, Promise<IOrdoFileRaw>>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          update: UnaryFn<{ name: OrdoExtensionName; content: any }, Promise<IOrdoFileRaw>>
          remove: UnaryFn<OrdoExtensionName, Promise<IOrdoFileRaw>>
        }
      }
    }
  }
}
