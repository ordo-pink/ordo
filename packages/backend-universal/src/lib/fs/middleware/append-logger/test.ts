/* eslint-disable */
import { Request, Response } from "express"
import { appendLogger } from "."

const logger = {
  info: vitest.fn(),
  warn: vitest.fn(),
  error: vitest.fn(),
}

describe("append-logger", () => {
  it("should add logger to request params", () => {
    const req = { params: {} } as Request<any>
    const res = {} as Response
    const next = vitest.fn()

    appendLogger(logger)(req, res, next)

    expect(req.params.logger).toBe(logger)
    expect(next).toHaveBeenCalled()
  })
})
