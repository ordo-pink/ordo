import { Keycloak } from "keycloak-js"

import type { OrdoDirectory, OrdoFile } from "$core/types"

declare global {
  interface Window {
    ordo: {
      api: {
        fs: (auth: Keycloak) => {
          files: {
            get: (path: string) => Promise<string>
            create: (path: string) => Promise<OrdoFile>
            move: (oldPath: string, newPath: string) => Promise<OrdoFile | OrdoDirectory>
            update: (path: string, content: string) => Promise<OrdoFile>
            remove: (path: string) => Promise<void | OrdoFile>
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
