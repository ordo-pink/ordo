import { SystemDirectory, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { contentType } from "mime-types"
import { TOKEN_PARSED_PARAM, USER_ID_PARAM } from "../../../fs/constants"
import { ExtensionsParams } from "../../../types"
import { FsRequestHandler } from "../../../types"

export const getExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({
    file: { getFileContentStream: getFileContent, checkFileExists, createFile },
    directory: { createDirectory, checkDirectoryExists },
  }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub
    const parent = `/${userId}${SystemDirectory.EXTENSIONS}` as const
    const path = `${parent}${req.params.extension}.json` as const

    const parentExists = await checkDirectoryExists(parent)
    const fileExists = await checkFileExists(path)

    if (!parentExists) {
      try {
        await createDirectory({ path: parent, issuerId })
      } catch (e) {
        req.params.logger.error(`Attempted to create directory that already exists: ${parent}`)
      }
    }

    if (!fileExists) {
      try {
        await createFile({ path, content: req, issuerId })
      } catch (e) {
        req.params.logger.error(`Attempted to create file that already exists: ${path}`)
      }
    }

    res.setHeader("content-type", contentType(".json") as string)

    getFileContent({ path, issuerId })
      .then((content) => content.pipe(res))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, async () => {
            res.status(ExceptionResponse.NOT_FOUND).send("{}")
          })
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
