const { join } = require("path");
const { promises } = require("fs");
const { getErrorMessage, errors } = require("../../errors");

module.exports = (dir) => async (req, res) => {
  if (!req.params || !req.params.path)
    res.status(400).json(getErrorMessage(errors.BAD_REQUEST));

  const path = join(dir, req.params.path);

  try {
    await promises.stat(path);
    res.sendFile(path);
  } catch (_) {
    res.status(404).json(getErrorMessage(errors.NOT_FOUND));
  }
};
