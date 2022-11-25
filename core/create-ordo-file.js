const { getDepth, getFileExtension, getReadableFileName } = require("../utils");

/**
 *
 * @param {{ path: string; createdAt: Date; updatedAt: Date; accessedAt: Date; size: number }} props
 * @returns {{ path: string; createdAt: Date; updatedAt: Date; accessedAt: Date; size: number, readableName: string; extension: `.${string}`; depth: number }}
 */
module.exports = (props) => {
  if (!props.path.startsWith("/")) {
    props.path = `/${props.path}`;
  }

  const depth = getDepth(props.path);
  const extension = getFileExtension(props.path);
  const readableName = getReadableFileName(props.path);

  return {
    ...props,
    readableName,
    extension,
    depth,
  };
};
