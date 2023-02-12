import { ReadStream } from "fs"
import { OrdoDirectoryPath, OrdoFilePath } from "@ordo-pink/core"
import { OrdoDirectoryModel } from "./directory"
import { FSDriver } from "../types"

const getDriver = (tree: (OrdoFilePath | OrdoDirectoryPath)[]): FSDriver => ({
  createDirectory: (path) => {
    tree.push(path)
    return Promise.resolve(path)
  },
  checkDirectoryExists: (path) => Promise.resolve(tree.includes(path)),
  checkFileExists: (path) => Promise.resolve(tree.includes(path)),
  createFile: (params) => {
    tree.push(params.path)
    return Promise.resolve(params.path)
  },
  deleteDirectory: (path) => {
    tree.splice(tree.indexOf(path), 1)
    return Promise.resolve(path)
  },
  deleteFile: (path) => {
    tree.splice(tree.indexOf(path), 1)
    return Promise.resolve(path)
  },
  getDirectoryChildren: (path) =>
    Promise.resolve(tree.filter((child) => child.startsWith(path) && child !== path)),
  getFile: () => Promise.resolve(new ReadStream()),
  getFileDescriptor: (path) => Promise.resolve({ path, size: 123 }),
  moveDirectory: (params) => {
    const oldIndex = tree.indexOf(params.oldPath)
    tree.splice(oldIndex, 1, params.newPath)
    return Promise.resolve(params.newPath)
  },
  moveFile: (params) => {
    const oldIndex = tree.indexOf(params.oldPath)
    tree.splice(oldIndex, 1, params.newPath)
    return Promise.resolve(params.newPath)
  },
  updateFile: (params) => Promise.resolve(params.path),
})

describe("directory-model", () => {
  describe("create-directory", () => {
    it("should create an empty directory if all is good", () =>
      Promise.resolve(getDriver(["/"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.createDirectory("/1/"))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/1/")
          expect(result.children).toEqual([])
        }))

    it("should throw 409 if the directory already exists", () =>
      Promise.resolve(getDriver(["/", "/1/"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.createDirectory("/1/"))
        .catch((x) => x)
        .then((result) => {
          expect(result).toEqual(409)
        }))

    it("should create root if it does not exist", () => {
      const tree = [] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.createDirectory("/1/"))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/1/")
          expect(tree).toContain("/")
          expect(tree).toContain("/1/")
        })
    })

    it("should recursively create directories", () => {
      const tree = [] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.createDirectory("/1/2/3/4/5/"))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/1/")
          expect(tree).toContain("/")
          expect(tree).toContain("/1/")
          expect(tree).toContain("/1/2/")
          expect(tree).toContain("/1/2/3/")
          expect(tree).toContain("/1/2/3/4/")
          expect(tree).toContain("/1/2/3/4/5/")
        })
    })
  })

  describe("get-directory", () => {
    it("should return children of given directory", () =>
      Promise.resolve(getDriver(["/", "/1/", "/1/2/", "/1/2/3/", "/1/2/3/test.md"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.getDirectory("/1/"))
        .then((directory: any) => {
          expect(directory.path).toEqual("/1/")
          expect(directory.children[0].path).toEqual("/1/2/")
          expect(directory.children[0].children[0].path).toEqual("/1/2/3/")
          expect(directory.children[0].children[0].children[0].path).toEqual("/1/2/3/test.md")
        }))

    it("should create root if it does not exist", () => {
      const tree = [] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.getDirectory("/"))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/")
          expect(tree).toContain("/")
        })
    })

    it("should throw 404 if directory does not exist", () =>
      Promise.resolve(getDriver(["/"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.getDirectory("/1/"))
        .catch((x) => x)
        .then((result) => {
          expect(result).toEqual(404)
        }))
  })

  describe("delete-directory", () => {
    it("should properly delete directory", () =>
      Promise.resolve(getDriver(["/", "/1/"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.deleteDirectory("/1/"))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/1/")
        }))

    it("should throw 404 if the directory does not exist", () =>
      Promise.resolve(getDriver(["/"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.deleteDirectory("/1/"))
        .catch((x) => x)
        .then((result) => {
          expect(result).toBeDefined()
          expect(result).toEqual(404)
        }))

    it("should throw 409 on attempt to remove root", () =>
      Promise.resolve(getDriver(["/"]))
        .then(OrdoDirectoryModel.of)
        .then((model) => model.deleteDirectory("/"))
        .catch((x) => x)
        .then((result) => {
          expect(result).toBeDefined()
          expect(result).toEqual(409)
        }))
  })

  describe("move-directory", () => {
    it("should correctly move if all is ok", () => {
      const tree = ["/", "/1/"] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.moveDirectory({ oldPath: "/1/", newPath: "/2/" }))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/2/")
          expect(tree).toContain("/2/")
          expect(tree).not.toContain("/1/")
        })
    })

    it("should recursively create directories", () => {
      const tree = ["/", "/1/"] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.moveDirectory({ oldPath: "/1/", newPath: "/2/3/4/" }))
        .then((result) => {
          expect(result).toBeDefined()
          expect(result.path).toEqual("/2/")
          expect(tree).toContain("/2/")
          expect(tree).toContain("/2/3/")
          expect(tree).toContain("/2/3/4/")
          expect(tree).not.toContain("/1/")
        })
    })

    it("should throw 404 if oldPath directory does not exist", () => {
      const tree = ["/"] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.moveDirectory({ oldPath: "/1/", newPath: "/2/" }))
        .catch((x) => x)
        .then((result) => {
          expect(result).toBeDefined()
          expect(result).toEqual(404)
        })
    })

    it("should throw 409 if oldPath and newPath are the same", () => {
      const tree = ["/", "/1/"] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.moveDirectory({ oldPath: "/1/", newPath: "/1/" }))
        .catch((x) => x)
        .then((result) => {
          expect(result).toBeDefined()
          expect(result).toEqual(409)
          expect(tree).toContain("/1/")
        })
    })

    it("should throw 409 if newPath is already taken", () => {
      const tree = ["/", "/1/", "/2/"] as any[]

      return Promise.resolve(tree)
        .then(getDriver)
        .then(OrdoDirectoryModel.of)
        .then((model) => model.moveDirectory({ oldPath: "/1/", newPath: "/1/" }))
        .catch((x) => x)
        .then((result) => {
          expect(result).toBeDefined()
          expect(result).toEqual(409)
          expect(tree).toContain("/1/")
          expect(tree).toContain("/2/")
        })
    })
  })
})
