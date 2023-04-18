// /* eslint-disable */
// import { OrdoFilePath, OrdoDirectoryPath } from "@ordo-pink/common-types"
// import { FSDriver } from "../../types"
// import { OrdoDirectoryModel } from "./directory"
// import { OrdoFileModel } from "./file"
// import { IgnoreLogger } from "@ordo-pink/logger"
// import { Readable } from "stream"

describe("models", () => {
  it.todo("make jest work because it stopped for some weird reason")
})

// const logger = IgnoreLogger
// const issuerId = "userID"

// const getDriver = (tree: (OrdoFilePath | OrdoDirectoryPath)[]): FSDriver => ({
//   createDirectory: (path) => {
//     tree.push(path)
//     return Promise.resolve(path)
//   },
//   checkDirectoryExists: (path) => Promise.resolve(tree.includes(path)),
//   checkFileExists: (path) => Promise.resolve(tree.includes(path)),
//   createFile: (params) => {
//     tree.push(params.path)
//     return Promise.resolve(params.path)
//   },
//   deleteDirectory: (path) => {
//     tree.splice(tree.indexOf(path), 1)
//     return Promise.resolve(path)
//   },
//   deleteFile: (path) => {
//     tree.splice(tree.indexOf(path), 1)
//     return Promise.resolve(path)
//   },
//   getDirectoryChildren: (path) =>
//     Promise.resolve(tree.filter((child) => child.startsWith(path) && child !== path)),
//   getFile: () => Promise.resolve(Readable.from("{}")),
//   getFileDescriptor: (path) =>
//     tree.includes(path) ? Promise.resolve({ path, size: 123 }) : Promise.reject(),
//   moveDirectory: (params) => {
//     const oldIndex = tree.indexOf(params.oldPath)
//     tree.splice(oldIndex, 1)
//     tree.push(params.newPath)
//     return Promise.resolve(params.newPath)
//   },
//   moveFile: (params) => {
//     const oldIndex = tree.indexOf(params.oldPath)
//     tree.splice(oldIndex, 1)
//     tree.push(params.newPath)
//     return Promise.resolve(params.newPath)
//   },
//   updateFile: (params) => Promise.resolve(params.path),
// })

// describe("models", () => {
//   describe("directory-model", () => {
//     describe("create-directory", () => {
//       it("should create an empty directory if everything is ok", () =>
//         Promise.resolve(getDriver(["/userID/"]))
//           .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//           .then((model) => model.createDirectory({ path: "/userID/1/", issuerId }))
//           .then((result) => {
//             expect(result).toBeDefined()
//             expect(result.path).toEqual("/userID/1/")
//             expect(result.children).toEqual([])
//           }))
//       it("should recursively create directories if everything is ok", () =>
//         Promise.resolve(["/userID/"])
//           .then(getDriver)
//           .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//           .then((model) => model.createDirectory({ path: "/userID/1/2/3/4/5/", issuerId }))
//           .then((result: any) => {
//             expect(result).toBeDefined()
//             expect(result.path).toEqual("/userID/1/")
//             expect(result.children[0].path).toEqual("/userID/1/2/")
//             expect(result.children[0].children[0].path).toEqual("/userID/1/2/3/")
//             expect(result.children[0].children[0].children[0].path).toEqual("/userID/1/2/3/4/")
//             expect(result.children[0].children[0].children[0].children[0].path).toEqual(
//               "/userID/1/2/3/4/5/",
//             )
//           }))
//       it("should create root if it does not exist", () =>
//         Promise.resolve([])
//           .then(getDriver)
//           .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//           .then((model) => model.createDirectory({ path: "/userID/1/", issuerId }))
//           .then((result) => {
//             expect(result).toBeDefined()
//             expect(result.path).toEqual("/userID/")
//           }))
//       it("should throw 409 if the directory already exists", () =>
//         Promise.resolve(getDriver(["/userID/", "/userID/1/"]))
//           .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//           .then((model) => model.createDirectory({ path: "/userID/1/", issuerId }))
//           .catch((x) => x)
//           .then((result) => {
//             expect(result).toEqual(409)
//           }))
//     })
//     // describe("get-directory", () => {
//     //   it("should return children of given directory if everything is ok", () =>
//     //     Promise.resolve(
//     //       getDriver([
//     //         "/userID/",
//     //         "/userID/1/",
//     //         "/userID/1/2/",
//     //         "/userID/1/2/3/",
//     //         "/userID/1/2/3/test.md",
//     //       ]),
//     //     )
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) => model.getDirectory({ path: "/userID/1/", issuerId }))
//     //       .then((directory: any) => {
//     //         expect(directory.path).toEqual("/userID/1/")
//     //         expect(directory.children[0].path).toEqual("/userID/1/2/")
//     //         expect(directory.children[0].children[0].path).toEqual("/userID/1/2/3/")
//     //         expect(directory.children[0].children[0].children[0].path).toEqual(
//     //           "/userID/1/2/3/test.md",
//     //         )
//     //       }))
//     //   it("should create root if it does not exist", () =>
//     //     Promise.resolve([])
//     //       .then(getDriver)
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) => model.getDirectory({ path: "/userID/", issuerId }))
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result.path).toEqual("/userID/")
//     //       }))
//     //   it("should throw 404 if directory does not exist", () =>
//     //     Promise.resolve(getDriver(["/userID/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) => model.getDirectory({ path: "/userID/1/", issuerId }))
//     //       .catch((x) => x)
//     //       .then((result) => {
//     //         expect(result).toEqual(404)
//     //       }))
//     // })
//     // describe("delete-directory", () => {
//     //   it("should properly delete directory if everything is ok", () =>
//     //     Promise.resolve(getDriver(["/userID/", "/userID/1/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) => model.deleteDirectory({ path: "/userID/1/", issuerId }))
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result.path).toEqual("/userID/1/")
//     //       }))
//     //   it("should throw 404 if the directory does not exist", () =>
//     //     Promise.resolve(getDriver(["/userID/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) => model.deleteDirectory({ path: "/userID/1/", issuerId }))
//     //       .catch((x) => x)
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result).toEqual(404)
//     //       }))
//     //   it("should throw 409 on attempt to remove root", () =>
//     //     Promise.resolve(getDriver(["/userID/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) => model.deleteDirectory({ path: "/userID/", issuerId }))
//     //       .catch((x) => x)
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result).toEqual(409)
//     //       }))
//     // })
//     // describe("move-directory", () => {
//     //   it("should correctly move if all is ok", () =>
//     //     Promise.resolve(getDriver(["/userID/", "/userID/1/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) =>
//     //         model.moveDirectory({ oldPath: "/userID/1/", newPath: "/userID/2/", issuerId }),
//     //       )
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result.path).toEqual("/userID/2/")
//     //       }))
//     //   it("should recursively create directories", () =>
//     //     Promise.resolve(getDriver(["/userID/", "/userID/1/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) =>
//     //         model.moveDirectory({ oldPath: "/userID/1/", newPath: "/userID/2/3/4/", issuerId }),
//     //       )
//     //       .then((result: any) => {
//     //         expect(result).toBeDefined()
//     //         expect(result.path).toEqual("/userID/2/")
//     //         expect(result.children[0].path).toEqual("/userID/2/3/")
//     //         expect(result.children[0].children[0].path).toEqual("/userID/2/3/4/")
//     //       }))
//     //   it("should throw 404 if oldPath directory does not exist", () =>
//     //     Promise.resolve(getDriver(["/userID/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) =>
//     //         model.moveDirectory({ oldPath: "/userID/1/", newPath: "/userID/2/", issuerId }),
//     //       )
//     //       .catch((x) => x)
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result).toEqual(404)
//     //       }))
//     //   it("should throw 409 if oldPath and newPath are the same", () =>
//     //     Promise.resolve(getDriver(["/userID/", "/userID/1/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) =>
//     //         model.moveDirectory({ oldPath: "/userID/1/", newPath: "/userID/1/", issuerId }),
//     //       )
//     //       .catch((x) => x)
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result).toEqual(409)
//     //       }))
//     //   it("should throw 409 if newPath is already taken", () =>
//     //     Promise.resolve(getDriver(["/userID/", "/userID/1/", "/userID/2/"]))
//     //       .then((driver) => OrdoDirectoryModel.of({ driver, logger }))
//     //       .then((model) =>
//     //         model.moveDirectory({ oldPath: "/userID/1/", newPath: "/userID/2/", issuerId }),
//     //       )
//     //       .catch((x) => x)
//     //       .then((result) => {
//     //         expect(result).toBeDefined()
//     //         expect(result).toEqual(409)
//     //       }))
//     // })
//   })

//   // describe("ordo-file-model", () => {
//   //   describe("get-file", () => {
//   //     it("should get a file descriptor if everything is ok", () =>
//   //       Promise.resolve(getDriver(["/userID/", "/userID/test.md"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) => model.getFile({ path: "/userID/test.md", issuerId }))
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result.path).toEqual("/userID/test.md")
//   //           expect(result.size).toEqual(123)
//   //           expect(result.updatedAt).toBeInstanceOf(Date)
//   //         }))

//   //     it("should throw 404 if the file does not exist", () =>
//   //       Promise.resolve(getDriver(["/userID/"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) => model.getFile({ path: "/userID/test.md", issuerId }))
//   //         .catch((x) => x)
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result).toEqual(404)
//   //         }))
//   //   })

//   //   describe("delete-file", () => {
//   //     it("should properly delete file if everything is ok", () =>
//   //       Promise.resolve(getDriver(["/userID/", "/userID/1.md"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) => model.deleteFile({ path: "/userID/1.md", issuerId }))
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result.path).toEqual("/userID/1.md")
//   //         }))

//   //     it("should throw 404 if the file does not exist", () =>
//   //       Promise.resolve(getDriver(["/userID/"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) => model.deleteFile({ path: "/userID/1.md", issuerId }))
//   //         .catch((x) => x)
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result).toEqual(404)
//   //         }))
//   //   })

//   //   describe("move-file", () => {
//   //     it("should correctly move if all is ok", () =>
//   //       Promise.resolve(getDriver(["/userID/", "/userID/1.md"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) =>
//   //           model.moveFile({ oldPath: "/userID/1.md", newPath: "/userID/2.md", issuerId }),
//   //         )
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result.path).toEqual("/userID/2.md")
//   //         }))

//   //     it("should recursively create directories", () =>
//   //       Promise.resolve(getDriver(["/userID/", "/userID/1.md"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) =>
//   //           model.moveFile({ oldPath: "/userID/1.md", newPath: "/userID/2/3/4.md", issuerId }),
//   //         )
//   //         .then((result: any) => {
//   //           expect(result).toBeDefined()
//   //           expect(result.path).toEqual("/userID/2/")
//   //           expect(result.children[0].path).toEqual("/userID/2/3/")
//   //           expect(result.children[0].children[0].path).toEqual("/userID/2/3/4.md")
//   //         }))

//   //     it("should throw 404 if oldPath does not exist", () =>
//   //       Promise.resolve(getDriver(["/userID/"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) =>
//   //           model.moveFile({ oldPath: "/userID/1.md", newPath: "/userID/2.md", issuerId }),
//   //         )
//   //         .catch((x) => x)
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result).toEqual(404)
//   //         }))

//   //     it("should throw 409 if oldPath and newPath are the same", () =>
//   //       Promise.resolve(getDriver(["/userID/", "/userID/1.md"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) =>
//   //           model.moveFile({ oldPath: "/userID/1.md", newPath: "/userID/1.md", issuerId }),
//   //         )
//   //         .catch((x) => x)
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result).toEqual(409)
//   //         }))

//   //     it("should throw 409 if newPath is already taken", () =>
//   //       Promise.resolve(getDriver(["/userID/", "/userID/1.md", "/userID/2.md"]))
//   //         .then((driver) => OrdoFileModel.of({ driver, logger }))
//   //         .then((model) =>
//   //           model.moveFile({ oldPath: "/userID/1.md", newPath: "/userID/2.md", issuerId }),
//   //         )
//   //         .catch((x) => x)
//   //         .then((result) => {
//   //           expect(result).toBeDefined()
//   //           expect(result).toEqual(409)
//   //         }))
//   //   })
//   // })
// })
