import { Request, Response } from "express"
import { authorisationStub } from "./authorisation-stub"

describe("authorisationStub", () => {
  it("should work", () => {
    const req = {} as Request
    const res = {} as Response
    const next = vitest.fn()

    const authorise = authorisationStub("asdf")

    authorise(req, res, next)

    expect(next).toHaveBeenCalled()
  })
})
