const isDirectory = require("./is-directory");

const sortOrdoDirectory = (directory) => {
  directory.children = directory.children.sort((a, b) => {
    if (isDirectory(a)) {
      sortOrdoDirectory(a);
    }

    if (isDirectory(b)) {
      sortOrdoDirectory(b);
    }

    if (!isDirectory(a) && isDirectory(b)) {
      return 1;
    }

    if (isDirectory(a) && !isDirectory(b)) {
      return -1;
    }

    return a.readableName.localeCompare(b.readableName);
  });

  return directory;
};

module.exports = sortOrdoDirectory;
