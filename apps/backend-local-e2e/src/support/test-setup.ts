/* eslint-disable */

import axios from "axios"

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? "localhost"
  const port = process.env.BACKEND_LOCAL_PORT ?? "5000"
  axios.defaults.baseURL = `http://${host}:${port}`
}
