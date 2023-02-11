import { OrdoFilePath, disallowedCharacters } from "@ordo-pink/core"
import { Request, Response } from "express"
import { validateDirectoryPath, validateFilePath } from "."

describe("validate-path", () => {
  describe("validate-directory-path", () => {
    it("should work on valid path", () => {
      const req = { params: { path: "/test/" } } as unknown as Request<{
        path: OrdoFilePath
      }>

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
        const req = { params: { path: "/test.md" } } as unknown as Request<{ path: OrdoFilePath }>

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
        const req = { params: { path: "test.md/" } } as unknown as Request<{ path: OrdoFilePath }>

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
          const req = { params: { path: `/${character}/test/` } } as unknown as Request<{
            path: OrdoFilePath
          }>

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
        const req = { params: { oldPath: "/test.md" } } as unknown as Request<{
          oldPath: OrdoFilePath
        }>

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
        const req = { params: { oldPath: "test.md/" } } as unknown as Request<{
          oldPath: OrdoFilePath
        }>

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
        it(`should fail with "${character}" in oldPath`, () => {
          const req = { params: { oldPath: `/${character}/test/` } } as unknown as Request<{
            oldPath: OrdoFilePath
          }>

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

    describe("new-path", () => {
      it("should fail without trailing slash", () => {
        const req = { params: { newPath: "/test.md" } } as unknown as Request<{
          newPath: OrdoFilePath
        }>

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
        const req = { params: { newPath: "test.md/" } } as unknown as Request<{
          newPath: OrdoFilePath
        }>

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
        it(`should fail with "${character}" in newPath`, () => {
          const req = { params: { newPath: `/${character}/test/` } } as unknown as Request<{
            newPath: OrdoFilePath
          }>

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

  describe("validate-file-path", () => {
    it("should work on valid path", () => {
      const req = { params: { path: "/test.md" } } as unknown as Request<{
        path: OrdoFilePath
      }>

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
        const req = { params: { path: "/test/" } } as unknown as Request<{ path: OrdoFilePath }>

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
        const req = { params: { path: "test.md" } } as unknown as Request<{ path: OrdoFilePath }>

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
          const req = { params: { path: `/${character}/test/` } } as unknown as Request<{
            path: OrdoFilePath
          }>

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
        const req = { params: { oldPath: "/test/" } } as unknown as Request<{
          oldPath: OrdoFilePath
        }>

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
        const req = { params: { oldPath: "test.md" } } as unknown as Request<{
          oldPath: OrdoFilePath
        }>

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
        it(`should fail with "${character}" in oldPath`, () => {
          const req = { params: { oldPath: `/${character}/test/` } } as unknown as Request<{
            oldPath: OrdoFilePath
          }>

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

    describe("new-path", () => {
      it("should fail with trailing slash", () => {
        const req = { params: { newPath: "/test/" } } as unknown as Request<{
          newPath: OrdoFilePath
        }>

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
        const req = { params: { newPath: "test.md" } } as unknown as Request<{
          newPath: OrdoFilePath
        }>

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
        it(`should fail with "${character}" in newPath`, () => {
          const req = { params: { newPath: `/${character}/test/` } } as unknown as Request<{
            newPath: OrdoFilePath
          }>

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
