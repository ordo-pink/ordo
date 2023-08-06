import { DirectoryPath, FilePath } from "#lib/universal-data-service/mod.ts"

export const pathParamToDirectoryPath = (path: string) => `/${path}/` as DirectoryPath

export const pathParamToFilePath = (path: string) => `/${path}` as FilePath
