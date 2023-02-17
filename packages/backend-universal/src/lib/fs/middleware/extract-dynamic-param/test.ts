/* eslint-disable */
import { Request, Response } from "express"
import { extractDynamicParam } from "."

const logger = {
  warn: vitest.fn(),
  info: vitest.fn(),
  error: vitest.fn(),
}

describe("extract-dynamic-param", () => {
  it("should properly provide the dynamic param in the params object", () => {
    const keys = ["path"]

    const req = { params: { path: "1", 0: "/2/test", logger } } as unknown as Request<any>

    const extractPath = extractDynamicParam(keys)

    const res = {} as Response
    const next = () => void 0
    extractPath(req, res, next)

    expect(req.params.path).toEqual("/1/2/test")
  })

  it("should extract params for 1 character long path", () => {
    const keys = ["path"]

    const req = { params: { path: "1", logger } } as unknown as Request<any>

    const extractPath = extractDynamicParam(keys)

    const res = {} as Response
    const next = () => void 0
    extractPath(req, res, next)

    expect(req.params.path).toEqual("/1")
  })

  it("should work with multiple dynamic params inside the same route", () => {
    const keys = ["oldPath", "newPath"]

    const req = {
      params: { oldPath: "1", 0: "/2/test", newPath: "4", 1: "/test", logger },
    } as unknown as Request<any>

    const extractPath = extractDynamicParam(keys)

    const res = {} as Response
    const next = () => void 0
    extractPath(req, res, next)

    expect(req.params.oldPath).toEqual("/1/2/test")
    expect(req.params.newPath).toEqual("/4/test")
  })

  it("should not break other params", () => {
    const keys = ["oldPath", "newPath"]

    const req = {
      params: { oldPath: "1", 0: "/2/test", userId: "123", logger },
    } as unknown as Request<any>

    const extractPath = extractDynamicParam(keys)

    const res = {} as Response
    const next = () => void 0
    extractPath(req, res, next)

    expect(req.params.oldPath).toEqual("/1/2/test")
    expect(req.params.userId).toEqual("123")
  })
})
