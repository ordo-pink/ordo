import { SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const updateFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { updateFile, getFile }, internal: { getInternalValue, setInternalValue } }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    const contentLength = Number(req.headers["content-length"])

    const { size } = await getFile(path)

    updateFile({ path, content: req })
      .then(removeUserIdFromPath(userId))
      .then((file) => res.status(SuccessResponse.OK).json(file))
      .then(() => getInternalValue(userId, "totalSize"))
      .then((total) => setInternalValue(userId, "totalSize", total + contentLength - size))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
