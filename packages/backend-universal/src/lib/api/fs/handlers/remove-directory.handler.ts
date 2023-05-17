import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { DirectoryPathParams, FsRequestHandler } from "../../../types"
import { PATH_PARAM } from "../constants"

export const handleRemoveDirectory: FsRequestHandler<DirectoryPathParams> =
  ({ directoryService, logger, globalStatsService }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = req.params[PATH_PARAM]

    try {
      const directory = await directoryService.remove(userId, path)

      globalStatsService
        .decrement("totalDirectories")
        .catch((e) => logger.error("handleRemoveDirectory", "globalStats", e))

      res.status(SuccessResponse.OK).json(directory)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.DIRECTORY_NOT_FOUND),
          () => res.status(ExceptionResponse.NOT_FOUND).send("{}"),
        )
        .default(() => {
          logger.error("handleRemoveDirectory", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
