import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { FsRequestHandler } from "../../../types"

export const handleCreateDirectory: FsRequestHandler =
  ({ directoryService, logger, globalStatsService }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]

    try {
      const directory = await directoryService.create(userId, req.body)

      globalStatsService
        .increment("totalDirectories")
        .catch((e) => logger.error("handleCreateDirectory", "globalStats", e))

      res.status(SuccessResponse.CREATED).json(directory)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.DIRECTORY_ALREADY_EXISTS),
          () => res.status(ExceptionResponse.CONFLICT).send("{}"),
        )
        .default(() => {
          logger.error("handleCreateDirectory", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
