import { getDepth } from "."

describe("getDepth", () => {
  it("should properly extract path depth", () => {
    const path = "/1/2/3"

    expect(getDepth(path)).toEqual(3)
  })

  it("should return 0 for / path", () => {
    expect(getDepth("/")).toEqual(0)
  })
})
