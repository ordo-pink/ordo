import { SystemDirectory, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { contentType } from "mime-types"
import { USER_ID_PARAM } from "../../../fs/constants"
import { ExtensionsParams } from "../../../types"
import { FsRequestHandler } from "../../../types"

export const getExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({ file: { getFileContent } }) =>
  (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = `/${userId}${SystemDirectory.EXTENSIONS}${req.params.extension}.json` as const

    res.setHeader("content-type", contentType(".json") as string)

    getFileContent(path)
      .then((content) => content.pipe(res))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, async () => {
            res.status(ExceptionResponse.NOT_FOUND).send()
          })
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
