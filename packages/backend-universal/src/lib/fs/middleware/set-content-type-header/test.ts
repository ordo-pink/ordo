/* eslint-disable */
import { Request, Response } from "express"
import { setContentTypeHeader } from "."

const logger = {
  warn: vitest.fn(),
  info: vitest.fn(),
  error: vitest.fn(),
}

describe("set-content-type-header", () => {
  it("should set content-type to response headers", () => {
    const req = { params: { path: "/test.md", logger } } as unknown as Request<any>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {}

    const res = {
      setHeader: (key: string, value: string) => (headers[key] = value),
    } as unknown as Response
    const next = () => void 0
    setContentTypeHeader(req, res, next)

    expect(headers["content-type"]).toEqual("text/markdown; charset=utf-8")
  })

  it("should fall back to octet-stream if content-type is unknown", () => {
    const req = { params: { path: "/test.asdfasdf", logger } } as unknown as Request<any>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {}

    const res = {
      setHeader: (key: string, value: string) => (headers[key] = value),
    } as unknown as Response
    const next = () => void 0
    setContentTypeHeader(req, res, next)

    expect(headers["content-type"]).toEqual("application/octet-stream")
  })
})
