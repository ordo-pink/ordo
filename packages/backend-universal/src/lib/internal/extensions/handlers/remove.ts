import {
  SystemDirectory,
  SuccessResponse,
  ExceptionResponse,
  IOrdoFileRaw,
} from "@ordo-pink/common-types"
import { Switch } from "@ordo-pink/switch"
import { USER_ID_PARAM } from "../../../fs/constants"
import { removeUserIdFromPath } from "../../../fs/utils/remove-user-id-from-path"
import { FsRequestHandler } from "../../../types"
import { ExtensionsParams } from "../../../types"

export const removeExtensionFileHandler: FsRequestHandler<ExtensionsParams> =
  ({ file: { deleteFile }, internal: { getInternalValue, setInternalValue } }) =>
  (req, res) => {
    const userId = req.params[USER_ID_PARAM]
    const path = `/${userId}${SystemDirectory.EXTENSIONS}${req.params.extension}.json` as const

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
          .case(ExceptionResponse.NOT_FOUND, () =>
            res.status(ExceptionResponse.NOT_FOUND).send("{}"),
          )
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
