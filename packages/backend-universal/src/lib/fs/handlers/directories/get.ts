import { SuccessResponse, ExceptionResponse, SystemDirectory } from "@ordo-pink/common-types"
import { IOrdoDirectoryRaw } from "@ordo-pink/fs-entity"
import { Switch } from "@ordo-pink/switch"
import { FsRequestHandler, OrdoDirectoryPathParams } from "../../../types"
import { PATH_PARAM, USER_ID_PARAM } from "../../constants"
import { removeUserIdFromPath } from "../../utils/remove-user-id-from-path"

export const getDirectoryHandler: FsRequestHandler<OrdoDirectoryPathParams> =
  ({ directory: { getDirectory } }) =>
  (req, res) => {
    const path = req.params[PATH_PARAM]
    const userId = req.params[USER_ID_PARAM]

    getDirectory(path)
      .then(removeUserIdFromPath(userId))
      .then((directory: IOrdoDirectoryRaw) => {
        if (directory.path !== "/") return directory

        const internalDirectoryIndex = directory.children.findIndex(
          (child) => child.path === SystemDirectory.INTERNAL,
        )

        if (internalDirectoryIndex === -1) return directory

        directory.children.splice(internalDirectoryIndex, 1)

        return directory
      })
      .then((directory) => res.status(SuccessResponse.OK).json(directory))
      .catch((error: ExceptionResponse.NOT_FOUND | Error) =>
        Switch.of(error)
          .case(ExceptionResponse.NOT_FOUND, () => res.status(ExceptionResponse.NOT_FOUND).send())
          .default(() => {
            req.params.logger.error(error)
            res.status(ExceptionResponse.UNKNOWN_ERROR).send(error.toString())
          }),
      )
  }
