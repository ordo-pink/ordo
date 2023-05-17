import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { DirectoryPathParams, FsRequestHandler } from "../../../types"
import { PATH_PARAM } from "../constants"

export const handleGetDirectoryChildren: FsRequestHandler<DirectoryPathParams> =
  ({ directoryService, logger }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = req.params[PATH_PARAM]

    try {
      const directory = path
        ? await directoryService.getDirectoryChildren(userId, path)
        : await directoryService.getRootDirectory(userId)

      res.status(SuccessResponse.OK).json(directory)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.DIRECTORY_NOT_FOUND),
          () => res.status(ExceptionResponse.NOT_FOUND).send("{}"),
        )
        .default(() => {
          logger.error("handleGetDirectory", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
