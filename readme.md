# Ordo.pink Universal Backend

[![lint](https://github.com/ordo-pink/ordo-backend-universal/actions/workflows/lint.yml/badge.svg)](https://github.com/ordo-pink/ordo-backend-universal/actions/workflows/lint.yml)
[![test](https://github.com/ordo-pink/ordo-backend-universal/actions/workflows/test.yml/badge.svg)](https://github.com/ordo-pink/ordo-backend-universal/actions/workflows/test.yml)
[![codecov](https://img.shields.io/codecov/c/gh/ordo-pink/ordo-backend-universal)](https://app.codecov.io/gh/ordo-pink/ordo-backend-universal)

This is Ordo.pink universal backend. It provides the contract for the API Ordo.pink client uses, and
uses the hard disk to store the data.

You can use it as a server for personal deployment of Ordo.pink, though it is not recommended right
now.

## Installation

1. Clone this repository (make sure you have Node.js installed)
2. Run `npm i` to install dependencies
3. Optional: define env variables (see below)
4. Run `npm start` to start the app

## Env variables

### ORDO_BACKEND_UNIVERSAL_PORT

The port the server should listen to. Defaults to `5000`.

### ORDO_BACKEND_UNIVERSAL_DIRECTORY

The directory the application will save files to. Defaults to `<projectRoot>/dist/files`.

## API

There is a Postman collection in the root directory of the project that you can use as a place to
start.
