import axios, { AxiosError } from "axios"

const token = process.env.BACKEND_LOCAL_TOKEN ?? "BOOP"
const authorisation = `Bearer ${token}`
const headers = { authorisation }

describe("ordo-backend", () =>
  it("should work", () =>
    axios.get("/").catch((error: AxiosError) => {
      expect(error.response.status).toEqual(404)
      expect(error.response.data).toContain("Cannot GET /")
    })))

describe("directories", () => {
  describe("create-directory", () => {
    it("should create a directory", () =>
      axios.post(`/fs/directories/${token}/e2e/`, { headers }).then((res) => {
        expect(res.status).toEqual(201)
        expect(res.data).toEqual({
          path: "/e2e/",
          children: [],
        })
      }))

    it("should create a nested directory when path exists", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/`, { headers }).then(() =>
        axios.post(`/fs/directories/${token}/e2e/dir1/dir2/`, { headers }).then((res) => {
          expect(res.status).toEqual(201)
          expect(res.data).toEqual({ path: "/e2e/dir1/dir2/", children: [] })
        }),
      ))

    it("should create a nested directory when path does not exist", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/dir2/`, { headers }).then((res) => {
        expect(res.status).toEqual(201)
        expect(res.data).toEqual({
          path: "/e2e/",
          children: [{ path: "/e2e/dir1/", children: [{ path: "/e2e/dir1/dir2/", children: [] }] }],
        })
      }))

    it("should return 409 if a directory already exists", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/`, { headers }).then(() =>
        axios.post(`/fs/directories/${token}/e2e/dir1/`, { headers }).catch((error: AxiosError) => {
          expect(error.response.status).toEqual(409)
          expect(error.response.data).toEqual("")
        }),
      ))
  })

  describe("remove-directory", () => {
    it("should remove a directory", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/`, { headers }).then(() =>
        axios.delete(`/fs/directories/${token}/e2e/dir1/`, { headers }).then((res) => {
          expect(res.status).toEqual(200)
          expect(res.data).toEqual({ path: "/e2e/dir1/", children: [] })
        }),
      ))

    it("should remove a directory with nested directories", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/dir2/`, { headers }).then(() =>
        axios.delete(`/fs/directories/${token}/e2e/dir1/`, { headers }).then((res) => {
          expect(res.status).toEqual(200)
          expect(res.data).toEqual({ path: "/e2e/dir1/", children: [] })
        }),
      ))

    it("should remove a directory with nested files", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/dir2/`, { headers }).then(() =>
        axios.post(`/fs/files/${token}/e2e/dir1/dir2/test.md`, { headers }).then(() =>
          axios.delete(`/fs/directories/${token}/e2e/dir1/`, { headers }).then((res) => {
            expect(res.status).toEqual(200)
            expect(res.data).toEqual({ path: "/e2e/dir1/", children: [] })
          }),
        ),
      ))

    it("should return 404 if a directory does not exist", () =>
      axios.post(`/fs/directories/${token}/e2e/dir1/`, { headers }).then(() =>
        axios
          .delete(`/fs/directories/${token}/e2e/dir1/dir2`, { headers })
          .catch((error: AxiosError) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data).toEqual("")
          }),
      ))
  })

  afterEach(() => axios.delete(`/fs/directories/${token}/e2e/`, { headers }))
})
