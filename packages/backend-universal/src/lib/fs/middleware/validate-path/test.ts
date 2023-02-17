/* eslint-disable */
import { Request, Response } from "express"
import { disallowedCharacters } from "@ordo-pink/fs-entity"
import {
  validateDirectoryPath,
  validateFilePath,
  validateDirectoryOldPathAndNewPath,
  validateFileOldPathAndNewPath,
} from "."
import { IgnoreLogger } from "@ordo-pink/logger"

const logger = IgnoreLogger

describe("validate-path", () => {
  describe("validate-directory-path", () => {
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

    describe("path", () => {
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

      disallowedCharacters.forEach((character) => {
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
    })

    describe("old-path", () => {
      it("should fail without trailing slash", () => {
        const req = { params: { logger, oldPath: "/test.md" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail without leading slash", () => {
        const req = { params: { logger, oldPath: "test.md/" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      disallowedCharacters.forEach((character) => {
        it(`should fail with "${character}" in oldPath`, () => {
          const req = {
            params: { logger, oldPath: `/${character}/test/` },
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

          validateDirectoryOldPathAndNewPath(req, res, next)

          expect(status).toEqual(400)
        })
      })
    })

    describe("new-path", () => {
      it("should fail on newPath slash", () => {
        const req = {
          params: { logger, newPath: "/", oldPath: "/test/" },
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
        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail on oldPath slash", () => {
        const req = {
          params: { logger, oldPath: "/", newPath: "/test/" },
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
        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail no path", () => {
        const req = {
          params: { logger, newPath: "", oldPath: "/test/" },
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
        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail on the same path", () => {
        const req = {
          params: { logger, newPath: "/test/", oldPath: "/test/" },
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
        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should not fail if everything is fine", () => {
        const req = {
          params: { logger, newPath: "/test/", oldPath: "/1/test/" },
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
        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(0)
      })

      it("should fail without trailing slash", () => {
        const req = { params: { logger, newPath: "/test.md" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail without leading slash", () => {
        const req = { params: { logger, newPath: "test.md/" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateDirectoryOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      disallowedCharacters.forEach((character) => {
        it(`should fail with "${character}" in newPath`, () => {
          const req = {
            params: { logger, newPath: `/${character}/test/` },
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

          validateDirectoryOldPathAndNewPath(req, res, next)

          expect(status).toEqual(400)
        })
      })
    })
  })

  describe("validate-file-path", () => {
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

    describe("path", () => {
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

      disallowedCharacters.forEach((character) => {
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
    })

    describe("old-path", () => {
      it("should fail with trailing slash", () => {
        const req = { params: { logger, oldPath: "/test/" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0
        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail without leading slash", () => {
        const req = { params: { logger, oldPath: "test.md" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      disallowedCharacters.forEach((character) => {
        it(`should fail with "${character}" in oldPath`, () => {
          const req = {
            params: { logger, oldPath: `/${character}/test/` },
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

          validateFileOldPathAndNewPath(req, res, next)

          expect(status).toEqual(400)
        })
      })
    })

    describe("new-path", () => {
      it("should fail with trailing slash", () => {
        const req = { params: { logger, newPath: "/test/" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0
        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail no path", () => {
        const req = {
          params: { logger, newPath: "", oldPath: "/test.md" },
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
        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should fail on the same path", () => {
        const req = {
          params: { logger, newPath: "/test.md", oldPath: "/test.md" },
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
        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      it("should not fail if everything is fine", () => {
        const req = {
          params: { logger, newPath: "/test.md", oldPath: "/1/test.md" },
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
        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(0)
      })

      it("should fail without leading slash", () => {
        const req = { params: { logger, newPath: "test.md" } } as unknown as Request<any>

        let status = 0

        const res = {
          status: (n: number) => {
            status = n
            return res
          },
          send: () => void 0,
        } as unknown as Response
        const next = () => void 0

        validateFileOldPathAndNewPath(req, res, next)

        expect(status).toEqual(400)
      })

      disallowedCharacters.forEach((character) => {
        it(`should fail with "${character}" in newPath`, () => {
          const req = {
            params: { logger, newPath: `/${character}/test/` },
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

          validateFileOldPathAndNewPath(req, res, next)

          expect(status).toEqual(400)
        })
      })
    })
  })
})
