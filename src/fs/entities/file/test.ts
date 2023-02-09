import { OrdoFile } from "./ordo-file"

describe("ordo-file", () => {
  describe("is-ordo-file", () => {
    it("should return true if it is an OrdoFile", () => {
      expect(
        OrdoFile.isOrdoFile({
          size: 0,
          path: "/test.md",
          extension: ".md",
          readableName: "test",
          updatedAt: new Date(),
        }),
      ).toBe(true)
    })

    it("should return false if it is not an OrdoFile", () => {
      expect(
        OrdoFile.isOrdoFile({
          size: 0,
          path: "/test.md/",
          extension: ".md",
          readableName: "test",
          updatedAt: new Date(),
        }),
      ).toBe(false)
    })
  })

  describe("get-file-extension", () => {
    it("should properly extract file extension", () => {
      const path = "/directory/file.txt"

      expect(OrdoFile.getFileExtension(path)).toEqual(".txt")
    })

    it("should properly extract file extension if file does not have a name", () => {
      const path = "/directory/.gitignore"

      expect(OrdoFile.getFileExtension(path)).toEqual(".gitignore")
    })

    it("should return empty string if the file does not have file extension", () => {
      const path = "/directory/file"

      expect(OrdoFile.getFileExtension(path)).toEqual("")
    })

    it("should properly extract file extension if there are dots outside filename", () => {
      const path = "/directory.woops/file.wow"

      expect(OrdoFile.getFileExtension(path)).toEqual(".wow")
    })
  })

  describe("get-parent-path", () => {
    it("should properly extract file parent path", () => {
      const path = "/dir1/dir2/dir3"
      expect(OrdoFile.getParentPath(path)).toEqual("/dir1/dir2/")
    })

    it("should properly extract directory parent path", () => {
      const path = "/dir1/dir2/dir3"
      expect(OrdoFile.getParentPath(path)).toEqual("/dir1/dir2/")
    })
  })

  describe("get-readable-name", () => {
    it("should extract readable name of files with file extension", () => {
      const path = "/directory/file.txt"

      expect(OrdoFile.getReadableName(path)).toEqual("file")
    })

    it("should extract readable name of files without file extension", () => {
      const path = "/directory/file"

      expect(OrdoFile.getReadableName(path)).toEqual("file")
    })

    it("should extract readable name of files that only have file extension", () => {
      const path = "/directory/.file"

      expect(OrdoFile.getReadableName(path)).toEqual("")
    })
  })
})
