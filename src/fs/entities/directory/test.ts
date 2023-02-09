import { OrdoDirectory } from "./ordo-directory"
import { IOrdoDirectory } from "../../types"

describe("ordo-directory", () => {
  describe("is-ordo-directory", () => {
    it("should return true if it is an OrdoDirectory", () => {
      expect(
        OrdoDirectory.isOrdoDirectory({
          children: [],
          path: "/test/",
          readableName: "test",
        }),
      ).toBe(true)
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
        } as unknown as IOrdoDirectory),
      ).toBe(false)
    })
  })

  describe("get-parent-path", () => {
    it("should properly extract file parent path", () => {
      const path = "/dir1/dir2/dir3/"
      expect(OrdoDirectory.getParentPath(path)).toEqual("/dir1/dir2/")
    })

    it("should properly extract directory parent path", () => {
      const path = "/dir1/dir2/dir3/"
      expect(OrdoDirectory.getParentPath(path)).toEqual("/dir1/dir2/")
    })
  })

  describe("get-readable-name", () => {
    it("should extract readable name of directories", () => {
      const path = "/directory/file/"

      expect(OrdoDirectory.getReadableName(path)).toEqual("file")
    })
  })
})
