/* eslint-disable */
import { Request, Response } from "express"
import { appendLogger } from "."
import { IgnoreLogger } from "@ordo-pink/logger"

const logger = IgnoreLogger

describe("append-logger", () => {
  it("should add logger to request params", () => {
    const req = { params: {} } as Request<any>
    const res = {} as Response
    const next = jest.fn()

    appendLogger(logger)(req, res, next)

    expect(req.params.logger).toBe(logger)
    expect(next).toHaveBeenCalled()
  })
})
