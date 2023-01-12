import { getFileExtension } from "$fs/driver/utils/get-file-extension"

describe("getFileExtension", () => {
  it("should properly extract file extension", () => {
    const path = "/directory/file.txt"

    expect(getFileExtension(path)).toEqual(".txt")
  })

  it("should properly extract file extension if file does not have a name", () => {
    const path = "/directory/.gitignore"

    expect(getFileExtension(path)).toEqual(".gitignore")
  })

  it("should return empty string if the file does not have file extension", () => {
    const path = "/directory/file"

    expect(getFileExtension(path)).toEqual("")
  })

  it("should properly extract file extension if there are dots outside filename", () => {
    const path = "/directory.woops/file.wow"

    expect(getFileExtension(path)).toEqual(".wow")
  })
})
