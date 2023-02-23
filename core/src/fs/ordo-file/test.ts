import { IOrdoFile, OrdoFile, OrdoFilePath } from "."
import { disallowedCharacters } from "../common"

describe("ordo-file", () => {
  describe("of", () => {
    it("should throw on invalid path provided", () =>
      expect(() => OrdoFile.of({ path: "", children: [] } as unknown as IOrdoFile)).toThrow(
        "Invalid file path",
      ))
  })

  describe("is-ordo-file", () => {
    it("should return true if it is an OrdoFile", () => {
      const file = OrdoFile.from({ path: "/123.md", size: 0 })

      expect(OrdoFile.isOrdoFile(file)).toBe(true)
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

  describe("from", () => {
    it("should create an OrdoFile with the least amount of initial data", () => {
      const updatedAt = new Date()
      const file = OrdoFile.from({ path: "/123.md", size: 0, updatedAt })

      expect(file.extension).toBe(".md")
      expect(file.readableName).toBe("123")
      expect(file.path).toBe("/123.md")
      expect(file.size).toBe(0)
      expect(file.updatedAt.toISOString()).toBe(updatedAt.toISOString())
    })
  })

  describe("get-file-extension", () => {
    it("should properly extract file extension", () => {
      const path = "/directory/file.txt"

      expect(OrdoFile.getFileExtension(path)).toEqual(".txt")
    })

    it("should throw on invalid path", () =>
      expect(() =>
        OrdoFile.getFileExtension("/directory/dir1/" as unknown as OrdoFilePath),
      ).toThrow("Invalid file path"))

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

    it("should throw on invalid path", () =>
      expect(() => OrdoFile.getParentPath("/directory/dir1/" as unknown as OrdoFilePath)).toThrow(
        "Invalid file path",
      ))

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

    it("should throw on invalid path", () =>
      expect(() => OrdoFile.getReadableName("/directory/dir1/" as unknown as OrdoFilePath)).toThrow(
        "Invalid file path",
      ))

    it("should extract readable name of files without file extension", () => {
      const path = "/directory/file"

      expect(OrdoFile.getReadableName(path)).toEqual("file")
    })

    it("should extract readable name of files that only have file extension", () => {
      const path = "/directory/.file"

      expect(OrdoFile.getReadableName(path)).toEqual("")
    })
  })

  disallowedCharacters.forEach((character) => {
    it(`should fail with "${character}" in path`, () => {
      expect(() => OrdoFile.from({ path: `/${character}/test.md`, size: 0 })).toThrow(
        "Invalid file path",
      )
    })
  })
})
