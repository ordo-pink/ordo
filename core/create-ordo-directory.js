const { getReadableFileName } = require("../utils");

module.exports = (props) => {
  const readableName = getReadableFileName(props.path);

  return {
    ...props,
    readableName,
    children: [],
  };
};
