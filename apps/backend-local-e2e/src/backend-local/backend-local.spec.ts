import axios from "axios"

describe("GET /", () => {
  it("should return a message", async () => {
    const res = await axios.get(`/`)

    expect(res.status).toBe(404)
    expect(res.data).toEqual({ message: "Cannot GET /" })
  })
})
