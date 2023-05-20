import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM, TOKEN_PARSED_PARAM } from "../../../constants"
import { SuccessResponse, ExceptionResponse } from "../../../response-code"
import { FsRequestHandler, OrdoDirectoryPathParams } from "../../../types"
import { PATH_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const createDirectoryHandler: FsRequestHandler<OrdoDirectoryPathParams> =
  ({ directory: { createDirectory } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub

    createDirectory({ path, issuerId })
      .then(removeUserIdFromPath(userId))
      .then((directory) => res.status(SuccessResponse.CREATED).json(directory))
      .catch((error: ExceptionResponse.CONFLICT | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.CONFLICT, () => res.status(ExceptionResponse.CONFLICT).send("{}"))
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
