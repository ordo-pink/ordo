import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { DirectoryPathParams, FsRequestHandler } from "../../../types"
import { PATH_PARAM } from "../constants"
import { promiseReadStream } from "../utils/promise-read-stream"

export const handleUpdateDirectory: FsRequestHandler<DirectoryPathParams> =
  ({ directoryService, logger }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = req.params[PATH_PARAM]

    try {
      const body = await promiseReadStream(req)

      const file = await directoryService.update(userId, path, JSON.parse(body))

      res.status(SuccessResponse.OK).json(file)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.DIRECTORY_NOT_FOUND),
          () => res.status(ExceptionResponse.NOT_FOUND).send("{}"),
        )
        .default(() => {
          logger.error("handleUpdateDirectory", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
