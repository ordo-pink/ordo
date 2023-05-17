import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { FsRequestHandler } from "../../../types"

export const handleCreateFile: FsRequestHandler =
  ({ fileService, logger, globalStatsService }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]

    try {
      const file = await fileService.create(userId, req.body)

      globalStatsService
        .increment("totalFiles")
        .catch((e) => logger.error("handleCreateFile", "globalStats", e))

      res.status(SuccessResponse.CREATED).json(file)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.FILE_ALREADY_EXISTS),
          () => res.status(ExceptionResponse.CONFLICT).send("{}"),
        )
        .default(() => {
          logger.error("handleCreateFile", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
