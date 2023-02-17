import { s3Driver } from "./s3-driver"

describe("s3Driver", () => {
  it("should work", () => {
    expect(s3Driver()).toEqual("s3-driver")
  })
})
