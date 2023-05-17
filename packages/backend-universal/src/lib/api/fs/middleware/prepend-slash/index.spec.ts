/* eslint-disable */
import { Request, Response } from "express"
import { prependPathSlash } from "."
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
})
