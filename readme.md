# Ordo Mocks

A pseudo-backend for Ordo client (works with the file system). The goal of this spike is to understand how to shape the backend endpoints to achieve convenient communication. THIS IS NOT THE PLACE FOR CREATING THE FINAL PRODUCTION-READY BACKEND! We're doing this for the Queen and country!

## Commands

```sh
npm start
```

Starts the backend with nodemon. Don't forget to `npm i`!

## ENV

- **NODE_ENV** - if set to `production`, hides error message text from the response
- **PORT** - a port to listen to. Defaults to `5000`
- **DIR** - a place to store files. Defaults to `./files`

## Quirk

Since the API uses URL parameters (the `:blah` stuff in the routes) to refer to paths, there is a collision between URL params and the slashes in the path. You can URLEncode path before providing it as a param (**_HINT_**: `%2F` is `/`!). You are free to make changes to this idea.
