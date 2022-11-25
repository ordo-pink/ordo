const app = require("express");
const { json, urlencoded } = require("body-parser");
const { resolve } = require("path");

const createFile = require("./api/files/create-file");
const getFolder = require("./api/files/get-directory");
const getFile = require("./api/files/get-file");
const deleteFileOrFolder = require("./api/files/delete-file-or-directory");
const createFolder = require("./api/files/create-directory");
const moveFileOrFolder = require("./api/files/move-file-or-directory");
const updateFile = require("./api/files/update-file");

const server = app();

const port = process.env.PORT ?? 5000;
const dir = process.env.DIR ?? resolve("./files");

server
  .use(urlencoded({ extended: false }))
  .use(json())
  .get("/api/files/:path", getFile(dir))
  .get("/api/directories/:path", getFolder(dir))
  .post("/api/files", createFile(dir))
  .post("/api/directories", createFolder(dir))
  .put("/api/files/:path", moveFileOrFolder(dir))
  .patch("/api/files/:path", updateFile(dir))
  .delete("/api/files/:path", deleteFileOrFolder(dir));

server.listen(port, () => console.log(`Server running on port ${port}`));
