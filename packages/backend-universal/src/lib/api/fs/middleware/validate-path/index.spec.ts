/* eslint-disable */
import { Request, Response } from "express"
import { validateDirectoryPath, validateFilePath } from "."
import { IgnoreLogger } from "@ordo-pink/logger"
import { FORBIDDEN_PATH_SYMBOLS } from "@ordo-pink/common-types"

const logger = IgnoreLogger

describe("Path validation middleware", () => {
  describe(validateDirectoryPath, () => {
    it("should work on valid path", () => {
      const req = { params: { logger, path: "/test/" } } as unknown as Request<any>

      let status = 0

      const res = {
        status: (n: number) => {
          status = n
          return res
        },
        send: () => void 0,
      } as unknown as Response
      const next = () => void 0

      validateDirectoryPath(req, res, next)

      expect(status).toEqual(0)
    })

    it("should fail without trailing slash", () => {
      const req = { params: { logger, path: "/test.md" } } as unknown as Request<any>

      let status = 0

      const res = {
        status: (n: number) => {
          status = n
          return res
        },
        send: () => void 0,
      } as unknown as Response
      const next = () => void 0

      validateDirectoryPath(req, res, next)

      expect(status).toEqual(400)
    })

    it("should fail without leading slash", () => {
      const req = { params: { logger, path: "test.md/" } } as unknown as Request<any>

      let status = 0

      const res = {
        status: (n: number) => {
          status = n
          return res
        },
        send: () => void 0,
      } as unknown as Response
      const next = () => void 0

      validateDirectoryPath(req, res, next)

      expect(status).toEqual(400)
    })

    FORBIDDEN_PATH_SYMBOLS.forEach((character) => {
      it(`should fail with "${character}" in path`, () => {
        const req = { params: { logger, path: `/${character}/test/` } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateDirectoryPath(req, res, next)

        expect(status).toEqual(400)
      })
    })

    describe(validateFilePath, () => {
      it("should work on valid path", () => {
        const req = { params: { logger, path: "/test.md" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateFilePath(req, res, next)

        expect(status).toEqual(0)
      })

      it("should fail with trailing slash", () => {
        const req = { params: { logger, path: "/test/" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0
        validateFilePath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail without leading slash", () => {
        const req = { params: { logger, path: "test.md" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateDirectoryPath(req, res, next)

        expect(status).toEqual(400)
      })

      FORBIDDEN_PATH_SYMBOLS.forEach((character) => {
        it(`should fail with "${character}" in path`, () => {
          const req = {
            params: { logger, path: `/${character}/test/` },
          } as unknown as Request<any>

          let status = 0

          const res = {
            status: (n: number) => {
              status = n
              return res
            },
            send: () => void 0,
          } as unknown as Response
          const next = () => void 0

          validateDirectoryPath(req, res, next)

          expect(status).toEqual(400)
        })
      })
    })
  })
})
