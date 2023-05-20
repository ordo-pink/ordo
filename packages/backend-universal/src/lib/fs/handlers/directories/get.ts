import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM, TOKEN_PARSED_PARAM } from "../../../constants"
import { SuccessResponse, ExceptionResponse } from "../../../response-code"
import { FsRequestHandler, OrdoDirectoryPathParams } from "../../../types"
import { PATH_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const getDirectoryHandler: FsRequestHandler<OrdoDirectoryPathParams> =
  ({ directory: { getDirectory } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]
    const issuerId = req.params[TOKEN_PARSED_PARAM].sub

    getDirectory({ path, issuerId })
      .then(removeUserIdFromPath(userId))
      .then((directory) => res.status(SuccessResponse.OK).json(directory))
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
