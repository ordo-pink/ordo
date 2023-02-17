import { backendS3Driver } from "./backend-s3-driver"

describe("backendS3Driver", () => {
  it("should work", () => {
    expect(backendS3Driver()).toEqual("backend-s3-driver")
  })
})
