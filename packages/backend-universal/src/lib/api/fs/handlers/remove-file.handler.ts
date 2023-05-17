import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { FilePathParams, FsRequestHandler } from "../../../types"
import { PATH_PARAM } from "../constants"

export const handleRemoveFile: FsRequestHandler<FilePathParams> =
  ({ fileService, logger, globalStatsService }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = req.params[PATH_PARAM]

    try {
      const file = await fileService.remove(userId, path)

      globalStatsService
        .decrement("totalFiles")
        .catch((e) => logger.error("handleRemoveFile", "globalStats", e))

      res.status(SuccessResponse.OK).json(file)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.FILE_NOT_FOUND),
          () => res.status(ExceptionResponse.NOT_FOUND).send("{}"),
        )
        .default(() => {
          logger.error("handleRemoveFile", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
