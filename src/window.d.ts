import type {
  IOrdoDirectoryRaw,
  IOrdoFileRaw,
  OrdoFilePath,
  OrdoDirectoryPath,
  UnaryFn,
} from "@ordo-pink/core"

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
      }
    }
  }
}
