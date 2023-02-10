import { OrdoDirectory, IOrdoDirectory } from "."
import { disallowedCharacters } from "../common"
import { OrdoFile } from "../ordo-file"

describe("ordo-directory", () => {
  describe("is-ordo-directory", () => {
    it("should return true if it is an OrdoDirectory", () => {
      const directory = OrdoDirectory.from({ path: "/123/" })

      expect(OrdoDirectory.isOrdoDirectory(directory)).toBe(true)
    })

    it("should prepend missing leading slash", () => {
      const directory = OrdoDirectory.from({ path: "123/" })

      expect(OrdoDirectory.isOrdoDirectory(directory)).toBe(true)
    })

    it("should append missing trailing slash", () => {
      const directory = OrdoDirectory.from({ path: "/123" })

      expect(OrdoDirectory.isOrdoDirectory(directory)).toBe(true)
    })

    it("should return false if it is not an OrdoDirectory", () => {
      expect(
        OrdoDirectory.isOrdoDirectory({
          path: "/test.md/",
          extension: ".md",
          readableName: "test",
        } as unknown as IOrdoDirectory),
      ).toBe(false)

      expect(
        OrdoDirectory.isOrdoDirectory({
          path: "/test/",
          children: [],
          readableName: "test",
        } as unknown as IOrdoDirectory),
      ).toBe(false)
    })
  })

  describe("get-readable-name", () => {
    it("should extract readable name of directories", () => {
      const path = "/directory/dir1/"

      expect(OrdoDirectory.getReadableName(path)).toEqual("dir1")
    })
  })

  describe("sort", () => {
    it("should correctly sort items in the directory", () => {
      const file1 = OrdoFile.raw({ path: "/test1.md", size: 0 })
      const file2 = OrdoFile.raw({ path: "/test2.md", size: 0 })
      const directory1 = OrdoDirectory.raw({ path: "/boo1" })
      const directory2 = OrdoDirectory.raw({ path: "/boo2" })
      const root1 = OrdoDirectory.from({
        path: "/",
        children: [file1, directory1, file2, directory2],
      })
      const root2 = OrdoDirectory.from({
        path: "/",
        children: [directory2, directory1, file2, file1],
      })

      expect(root1.children[0]?.readableName).toBe("boo1")
      expect(root2.children[0]?.readableName).toBe("boo1")
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
  })

  disallowedCharacters.forEach((character) => {
    it(`should fail with "${character}" in path`, () => {
      const directory = OrdoDirectory.from({ path: `/${character}/test` })

      expect(OrdoDirectory.isValidPath(directory.raw.path)).toBe(false)
    })
  })
})
