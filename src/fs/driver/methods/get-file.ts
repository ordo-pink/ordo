import { createReadStream, existsSync } from "fs"
import { join } from "path"

import { Either } from "$core/either"
import { FSDriver } from "$core/types"

import { Exception } from "$fs/constants"

export const getFile =
  (directory: string): FSDriver["getFile"] =>
  async (path) =>
    Either.of(path)
      .map((p) => join(directory, p))
      .chain((absolutePath) =>
        Either.fromBoolean(existsSync(absolutePath)).bimap(
          () => Exception.NOT_FOUND as const,
          () => createReadStream(absolutePath),
        ),
      )
