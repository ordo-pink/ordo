import { OrdoError, OrdoErrorCode } from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../constants"
import { ExceptionResponse, SuccessResponse } from "../../../response-code"
import { FilePathParams, FsRequestHandler } from "../../../types"
import { PATH_PARAM } from "../constants"
import { promiseReadStream } from "../utils/promise-read-stream"

export const handleUpdateFile: FsRequestHandler<FilePathParams> =
  ({ fileService, logger }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = req.params[PATH_PARAM]

    try {
      const body = await promiseReadStream(req)

      const file = await fileService.update(userId, path, JSON.parse(body))

      res.status(SuccessResponse.OK).json(file)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.FILE_NOT_FOUND),
          () => res.status(ExceptionResponse.NOT_FOUND).send("{}"),
        )
        .default(() => {
          logger.error("handleUpdateFile", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }

export const handleUpdateFileContent: FsRequestHandler<FilePathParams> =
  ({ fileService, logger }) =>
  async (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = req.params[PATH_PARAM]

    try {
      const file = await fileService.updateContent(userId, path, req)

      res.status(SuccessResponse.OK).json(file)
    } catch (e) {
      Switch.of(e as Error)
        .case(
          (e) => OrdoError.hasCode(e, OrdoErrorCode.FILE_NOT_FOUND),
          () => res.status(ExceptionResponse.NOT_FOUND).send("{}"),
        )
        .default(() => {
          logger.error("handleUpdateFileContent", "UNEXPECTED", e)
          res.status(ExceptionResponse.UNKNOWN_ERROR).send("{}")
        })
    }
  }
