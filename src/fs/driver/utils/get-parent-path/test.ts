import { getParentPath } from "$fs/driver/utils/get-parent-path"

describe("getParentPath", () => {
  it("should properly extract parent path", () => {
    const path = "/dir1/dir2/dir3"
    expect(getParentPath(path)).toEqual("/dir1/dir2/")
  })
})
