const { join } = require("path");
const listDirectory = require("../../core/list-directory");
const { getErrorMessage, errors } = require("../../errors");

module.exports = (dir) => async (req, res) => {
  // TODO: Add support for ?depth=N (max 5), default N=1
  // TODO: Add support for ?length=N (max 100), default N=50
  // TODO: Add support for pagination
  // TODO: Add support for listing as a tree or as a list (by accessedAt(ASC|DESC) or createdAt(ASC|DESC))
  //          in this case, ignore ?depth query parameter
  if (!req.params || !req.params.path)
    res.status(400).json(getErrorMessage(errors.BAD_REQUEST));

  try {
    const directory = await listDirectory(req.params.path, dir);
    res.json(directory);
  } catch (_) {
    res.status(404).json(getErrorMessage(errors.NOT_FOUND));
  }
};
