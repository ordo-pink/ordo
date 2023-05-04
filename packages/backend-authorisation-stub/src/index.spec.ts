import { Params } from "@ordo-pink/backend-universal"
import { Request, Response } from "express"
import { createAuthorisationStub } from "."

describe("createAuthorisationStub", () => {
  it("should work", () => {
    const req = { params: { userId: "asdf" } } as Request<Params>
    const res = {} as Response
    const next = vitest.fn()

    const authorise = createAuthorisationStub("asdf")

    authorise(req, res, next)

    expect(req.params.tokenParsed.sub).toEqual("asdf")
    expect(next).toHaveBeenCalled()
  })
})
