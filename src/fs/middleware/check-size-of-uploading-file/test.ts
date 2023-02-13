/* eslint-disable */
import { Request, Response } from "express"
import { checkSizeOfUploadingFile } from "."

describe("check-size-of-uploading-file", () => {
  it("should fail if size of file is too large", () => {
    let code = 200

    const badReq = { headers: { "content-length": "6291456" } } as unknown as Request<any>
    const res = {
      status: (c: number) => {
        code = c
        return res
      },
      send: () => void 0,
    } as unknown as Response
    const next = () => void 0

    checkSizeOfUploadingFile(badReq, res, next)

    expect(code).toEqual(400)
  })

  it("should pass if file is ok", () => {
    let code = 200

    const goodReq = { headers: { "content-length": "4291456" } } as unknown as Request<any>
    const res = {
      status: (c: number) => {
        code = c
        return res
      },
      send: () => void 0,
    } as unknown as Response
    const next = () => void 0

    checkSizeOfUploadingFile(goodReq, res, next)

    expect(code).toEqual(200)
  })
})
