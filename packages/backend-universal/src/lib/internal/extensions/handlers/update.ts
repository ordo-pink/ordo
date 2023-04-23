import { SystemDirectory, SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { TOKEN_PARSED_PARAM, USER_ID_PARAM } from "../../../fs/constants"
import { removeUserIdFromPath } from "../../../fs/utils/remove-user-id-from-path"
import { FsRequestHandler } from "../../../types"
import { ExtensionsParams } from "../../../types"

export const updateExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({ file: { updateFile, getFile }, internal: { getInternalValue, setInternalValue } }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub
    const path = `/${userId}${SystemDirectory.EXTENSIONS}${req.params.extension}.json` as const

    const contentLength = Number(req.headers["content-length"])

    const { size } = await getFile({ path, issuerId })

    updateFile({ path, content: req, issuerId })
      .then(removeUserIdFromPath(userId))
      .then((file) => res.status(SuccessResponse.OK).json(file))
      .then(() => getInternalValue(userId, "totalSize"))
      .then((total) => setInternalValue(userId, "totalSize", total + contentLength - size))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () =>
            res.status(ExceptionResponse.NOT_FOUND).send("{}"),
          )
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
