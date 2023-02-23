/* eslint-disable */
import { Request, Response } from "express"
import { addUserIdToOldPathAndNewPath, addUserIdToPath } from "."
import { NEW_PATH_PARAM, OLD_PATH_PARAM, PATH_PARAM, USER_ID_PARAM } from "../../constants"

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

describe("add-user-id-to-path", () => {
  it("should prepend user ID from the URL to path", () => {
    const req = { params: { [USER_ID_PARAM]: "123", [PATH_PARAM]: "/123", logger } } as Request<any>
    const res = {} as Response

    const next = jest.fn()

    addUserIdToPath(req, res, next)

    expect(req.params[PATH_PARAM]).toEqual("/123/123")
    expect(next).toHaveBeenCalled()
  })

  it("should prepend user ID from the URL to old path and new path", () => {
    const req = {
      params: {
        [USER_ID_PARAM]: "123",
        [OLD_PATH_PARAM]: "/123",
        [NEW_PATH_PARAM]: "/123",
        logger,
      },
    } as Request<any>
    const res = {} as Response
    const next = jest.fn()

    addUserIdToOldPathAndNewPath(req, res, next)

    expect(req.params[OLD_PATH_PARAM]).toEqual("/123/123")
    expect(req.params[NEW_PATH_PARAM]).toEqual("/123/123")
    expect(next).toHaveBeenCalled()
  })
})
