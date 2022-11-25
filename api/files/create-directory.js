const { join } = require("path");
const { promises } = require("fs");

const { getErrorMessage, errors } = require("../../errors");
const { getParentPath } = require("../../utils");
const listDirectory = require("../../core/list-directory");

module.exports = (dir) => async (req, res) => {
  const absolutePath = join(dir, req.body.path);

  try {
    const recursiveCreationStartPath = await promises.mkdir(absolutePath, {
      recursive: true,
    });

    if (!recursiveCreationStartPath) {
      return res.status(409).json(getErrorMessage(errors.DIRECTORY_EXISTS));
    }

    const relativeRecursiveCreationStartPath = recursiveCreationStartPath
      .replace(dir, "")
      .replaceAll("\\", "/");

    const parentPath = getParentPath(relativeRecursiveCreationStartPath);

    const listedDirectory = await listDirectory(parentPath, dir);

    console.log(listedDirectory);

    res.status(201).json(listedDirectory);
  } catch (e) {
    res.status(500).json(getErrorMessage(errors.UNKNOWN_ERROR, e));
  }
};
