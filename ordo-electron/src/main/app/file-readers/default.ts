import type { OrdoFile } from "@core/app/types"

import { promises } from "fs"

/**
 * Default file opener that uses decodes files with UTF-8 with no additional steps.
 */
export const defaultFileReader = (file: OrdoFile) => promises.readFile(file.path, "utf8")
