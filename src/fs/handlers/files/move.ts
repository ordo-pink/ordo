import { lazySwitch } from "@ordo-pink/switch"

import { OrdoFilePath, FsRequestHandler } from "$core/types"

import { Exception, NEW_PATH_PARAM, OLD_PATH_PARAM } from "$fs/constants"

type Params = {
  [OLD_PATH_PARAM]: OrdoFilePath
  [NEW_PATH_PARAM]: OrdoFilePath
}

export const moveFileHandler: FsRequestHandler<Params> =
  ({ moveFile }) =>
  async (req, res) => {
    const oldPath = req.params[OLD_PATH_PARAM]
    const newPath = req.params[NEW_PATH_PARAM]

    const eitherFile = await moveFile(oldPath, newPath)

    eitherFile.fold(
      lazySwitch((s) =>
        s
          .case(Exception.NOT_FOUND, () => res.status(404).send())
          .default(() => res.status(409).send()),
      ),
      (file) => res.status(201).json(file),
    )
  }
