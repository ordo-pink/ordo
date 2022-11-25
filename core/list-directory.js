const { promises } = require("fs");
const { join } = require("path");

const { errors } = require("../errors");
const createOrdoDirectory = require("./create-ordo-directory");
const createOrdoFile = require("./create-ordo-file");
const sortOrdoDirectory = require("./sort-ordo-directory");

/**
 * @param {string} path
 * @param {number?} depth
 * @param {string?} rootPath
 */
const listDirectory = async (path, dir, depth = 0, rootPath = path) => {
  const absolutePath = join(dir, path);
  const stat = await promises.stat(absolutePath);

  if (!stat.isDirectory()) {
    throw new Error(errors.NOT_DIRECTORY);
  }

  const directory = await promises.readdir(absolutePath, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  const ordoDirectory = createOrdoDirectory({
    depth,
    path,
    createdAt: stat.birthtime,
    updatedAt: stat.mtime,
    accessedAt: stat.atime,
  });

  for (const item of directory) {
    const itemPath = join(path, item.name).replaceAll("\\", "/");
    const itemAbsolutePath = join(absolutePath, item.name);

    if (item.isDirectory()) {
      const listedDirectory = await listDirectory(
        itemPath,
        dir,
        depth + 1,
        rootPath
      );

      ordoDirectory.children.push(listedDirectory);
    } else if (item.isFile()) {
      const stat = await promises.stat(itemAbsolutePath);

      const ordoFile = createOrdoFile({
        path: itemPath,
        depth: depth + 1,
        createdAt: stat.birthtime,
        updatedAt: stat.mtime,
        accessedAt: stat.atime,
        size: stat.size,
      });

      ordoDirectory.children.push(ordoFile);
    }
  }

  return sortOrdoDirectory(ordoDirectory);
};

module.exports = listDirectory;
