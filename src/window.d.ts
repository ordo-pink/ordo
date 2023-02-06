import type { OrdoDirectory, OrdoFile, UnaryFn } from "$core/types"

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
            get: (path: string) => Promise<string>
            getRaw: (path: string) => ReturnType<typeof fetch>
            create: (path: string, content?: string) => Promise<OrdoFile>
            move: (oldPath: string, newPath: string) => Promise<OrdoFile | OrdoDirectory>
            update: (path: string, content: string) => Promise<OrdoFile>
            remove: (path: string) => Promise<OrdoFile>
          }
          directories: {
            get: (path: string) => Promise<OrdoDirectory>
            create: (path: string) => Promise<OrdoDirectory>
            move: (oldPath: string, newPath: string) => Promise<OrdoDirectory>
            remove: (path: string) => Promise<void | OrdoDirectory>
          }
        }
      }
    }
  }
}
