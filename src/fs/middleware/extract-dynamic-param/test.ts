import { Request, Response } from "express"
import { extractDynamicParam } from "./index"

describe("extract-dynamic-param", () => {
  it("should properly provide the dynamic param in the params object", () => {
    const keys = ["path"]

    const req = { params: { path: "1", 0: "/2/test" } } as unknown as Request

    const extractPath = extractDynamicParam(keys)

    const res = {} as Response
    const next = () => void 0
    extractPath(req, res, next)

    expect(req.params.path).toEqual("/1/2/test")
  })

  it("should work with multiple dynamic params inside the same route", () => {
    const keys = ["oldPath", "newPath"]

    const req = {
      params: { oldPath: "1", 0: "/2/test", newPath: "4", 1: "/test" },
    } as unknown as Request

    const extractPath = extractDynamicParam(keys)

    const res = {} as Response
    const next = () => void 0
    extractPath(req, res, next)

    expect(req.params.oldPath).toEqual("/1/2/test")
    expect(req.params.newPath).toEqual("/4/test")
  })
})
