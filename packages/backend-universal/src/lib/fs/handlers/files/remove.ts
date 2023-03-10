import { SuccessResponse, ExceptionResponse } from "@ordo-pink/common-types"
import { IOrdoFileRaw } from "@ordo-pink/fs-entity"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoFilePathParams } from "../../../types"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const removeFileHandler: FsRequestHandler<OrdoFilePathParams> =
  ({ file: { deleteFile }, internal: { getInternalValue, setInternalValue } }) =>
  async (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    deleteFile(path)
      .then(removeUserIdFromPath(userId))
      .then((file) => {
        res.status(SuccessResponse.OK).json(file)

        return file as IOrdoFileRaw
      })
      .then(({ size }) =>
        getInternalValue(userId, "totalSize").then((total) =>
          setInternalValue(userId, "totalSize", total - size),
        ),
      )
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
