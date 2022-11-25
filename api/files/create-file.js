const { join } = require("path");
const { promises } = require("fs");

const createOrdoFile = require("../../core/create-ordo-file");
const { getErrorMessage, errors } = require("../../errors");

module.exports = (dir) => async (req, res) => {
  if (!req.body) return res.sendStatus(400);

  const absolutePath = join(dir, req.body.path);

  try {
    await promises.stat(absolutePath);

    res.status(409).json(getErrorMessage(errors.FILE_EXISTS));
  } catch (_) {
    try {
      if (req.body.path.indexOf("/") !== -1) {
        const parentPath = req.body.path.slice(
          0,
          req.body.path.lastIndexOf("/")
        );

        if (parentPath !== "") {
          await promises.mkdir(join(dir, parentPath), {
            recursive: true,
          });
        }
      }

      await promises.writeFile(
        absolutePath,
        req.body.raw ? req.body.raw : "",
        "utf-8"
      );
      const { atime, mtime, birthtime, size } = await promises.stat(
        absolutePath
      );

      res.status(201).json(
        createOrdoFile({
          path: req.body.path,
          size,
          createdAt: birthtime,
          accessedAt: atime,
          updatedAt: mtime,
        })
      );
    } catch (e) {
      res.status(500).json(getErrorMessage(errors.UNKNOWN_ERROR, e));
    }
  }
};
