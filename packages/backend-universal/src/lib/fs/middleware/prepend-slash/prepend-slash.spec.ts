/* eslint-disable */
import { Request, Response } from "express"
import { prependOldPathAndNewPathSlashes, prependPathSlash } from "."
import { IgnoreLogger } from "@ordo-pink/logger"

const logger = IgnoreLogger

describe("prepend-slash", () => {
  it("should prepend slash in the params object", () => {
    const req = { params: { path: "1/2/test", logger } } as unknown as Request<any>

    const res = {} as Response
    const next = () => void 0
    prependPathSlash(req, res, next)

    expect(req.params.path).toEqual("/1/2/test")
  })

  it("should work with multiple params inside the same route", () => {
    const req = {
      params: { oldPath: "1/2/test", newPath: "4/test", logger },
    } as unknown as Request<any>

    const res = {} as Response
    const next = () => void 0
    prependOldPathAndNewPathSlashes(req, res, next)

    expect(req.params.oldPath).toEqual("/1/2/test")
    expect(req.params.newPath).toEqual("/4/test")
  })
})
