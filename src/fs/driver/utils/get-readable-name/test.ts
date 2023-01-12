import { getReadableFileName } from "$fs/driver/utils/get-readable-name"

describe("getReadableName", () => {
  it("should extract readable name without file extension", () => {
    const path = "/directory/file.txt"

    expect(getReadableFileName(path)).toEqual("file")
  })

  it("should extract readable name for files without file extension", () => {
    const path = "/directory/file"

    expect(getReadableFileName(path)).toEqual("file")
  })
})
