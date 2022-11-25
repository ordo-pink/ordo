/**
 * @param {string} path
 * @returns {number}
 */
const getDepth = (path) => path.split("/").filter(Boolean).length;

/**
 * @param {string} path
 * @returns {string}
 */
const getFileExtension = (path) => {
  const lastDotPosition = path.lastIndexOf(".");
  return path.substring(lastDotPosition);
};

/**
 * @param {string} path
 * @returns {string}
 */
const getReadableFileName = (path) => {
  const hasSeparatorAtTheEnd = path.endsWith("/");
  const splittablePath = hasSeparatorAtTheEnd ? path.slice(0, -1) : path;

  const lastSeparatorPosition = splittablePath.lastIndexOf("/") + 1;
  const readableName = splittablePath.slice(lastSeparatorPosition);
  const extension = getFileExtension(path);
  const readableNameWithoutExtension = readableName.replace(extension, "");

  return readableNameWithoutExtension !== ""
    ? readableNameWithoutExtension
    : readableName;
};

/**
 * @param {string} path
 * @returns {string}
 */
const getParentPath = (path) => {
  const hasSeparatorAtTheEnd = path.endsWith("/");
  const splittablePath = hasSeparatorAtTheEnd ? path.slice(0, -1) : path;
  const lastSeparatorPosition = splittablePath.lastIndexOf("/") + 1;

  return splittablePath.slice(0, lastSeparatorPosition);
};

module.exports = {
  getDepth,
  getFileExtension,
  getReadableFileName,
  getParentPath,
};
