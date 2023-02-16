/* eslint-disable */
import { OrdoDirectory, IOrdoDirectory, OrdoDirectoryPath } from "."
import { disallowedCharacters } from "../common"
import { OrdoFile } from "../ordo-file"

describe("ordo-directory", () => {
  describe("of", () => {
    it("should throw on invalid path provided", () =>
      expect(() =>
        OrdoDirectory.of({
          path: "",
          children: [],
        } as unknown as IOrdoDirectory)
      ).toThrow("Invalid directory path"))
  })

  describe("is-ordo-directory", () => {
    it("should return true if it is an OrdoDirectory", () =>
      expect(
        OrdoDirectory.isOrdoDirectory(OrdoDirectory.from({ path: "/123/", children: [] }))
      ).toBe(true))

    it("should return false if it is not an OrdoDirectory", () => {
      expect(
        OrdoDirectory.isOrdoDirectory({
          path: "/test.md",
          children: [],
          readableName: "test",
        })
      ).toBe(false)

      expect(
        OrdoDirectory.isOrdoDirectory({
          path: "/test/",
          readableName: "test",
        })
      ).toBe(false)
    })
  })

  describe("get-readable-name", () => {
    it("should extract readable name of directories", () =>
      expect(OrdoDirectory.getReadableName("/directory/dir1/")).toEqual("dir1"))

    it("should throw on invalid path provided", () =>
      expect(() => OrdoDirectory.getReadableName("" as unknown as OrdoDirectoryPath)).toThrow(
        "Invalid directory path"
      ))
  })

  describe("sort", () => {
    it("should correctly sort items in the directory", () => {
      const file1 = OrdoFile.empty("/test1.md")
      const file2 = OrdoFile.empty("/test2.md")
      const directory1 = OrdoDirectory.empty("/boo1/")
      const directory2 = OrdoDirectory.empty("/boo2/")

      const root1 = OrdoDirectory.from({
        path: "/",
        children: [file1, directory1, file2, directory2],
      })

      const root2 = OrdoDirectory.from({
        path: "/",
        children: [directory2, directory1, file2, file1],
      })

      expect(root1.children[0]?.readableName).toBe("boo1")
      expect(root1.children[1]?.readableName).toBe("boo2")
      expect(root1.children[2]?.readableName).toBe("test1")
      expect(root1.children[3]?.readableName).toBe("test2")
      expect(root2.children[0]?.readableName).toBe("boo1")
      expect(root2.children[1]?.readableName).toBe("boo2")
      expect(root2.children[2]?.readableName).toBe("test1")
      expect(root2.children[3]?.readableName).toBe("test2")
    })
  })

  describe("get-parent-path", () => {
    it("should properly extract file parent path", () => {
      const path = "/dir1/dir2/dir3/"
      expect(OrdoDirectory.getParentPath(path)).toEqual("/dir1/dir2/")
    })

    it("should properly extract directory parent path", () => {
      const path = "/"
      expect(OrdoDirectory.getParentPath(path)).toEqual("/")
    })

    it("should throw on invalid path provided", () =>
      expect(() => OrdoDirectory.getParentPath("" as unknown as OrdoDirectoryPath)).toThrow(
        "Invalid directory path"
      ))
  })

  disallowedCharacters.forEach((character) => {
    it(`should fail with "${character}" in path`, () => {
      expect(() => OrdoDirectory.from({ path: `/${character}/test` } as any)).toThrow(
        "Invalid directory path"
      )
    })
  })
})
