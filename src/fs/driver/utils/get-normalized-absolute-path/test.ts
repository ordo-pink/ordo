import { getNormalizedAbsolutePath } from "$fs/driver/utils/get-normalized-absolute-path"

describe("getNormalizedAbsolutePath", () => {
  it("should properly extract parent path", () => {
    const path = "/dir2/dir3/"
    const directory = "\\dir1"

    expect(getNormalizedAbsolutePath(path, directory)).toEqual("/dir1/dir2/dir3/")
  })
})
