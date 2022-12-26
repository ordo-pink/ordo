# Terms

`$host` = application host (e.g. http://localhost:1337)

`$token` = `Bearer $JWT`

# Conditions

The API has a limit of 20 requests per second for API requests. Sending too many requests will result in **429** response.

The API is protected with JWT authentication and authorisation. If there is no Bearer token provided, the requests will result in **401** response.

If the token is present but it is not allowed to execute the action, the requests will result in **403** response.

# Ordo FS API

File system API for storing and retreiving user data. User credentials are stored separately.

> Available at `${host}/api/fs`

## Directories

Directory management API.

> Available at `${host}/api/fs/directories`

### Create

Creates a directory. Can create directories recursively. If a single directory is created, it will be returned in the response. If the directory was created recursively, the first created directory will be returned in the response, including nested newly created directories.

| Method | URL                        |
| ------ | -------------------------- |
| POST   | ${host}/api/fs/directories |

#### Required Headers

- `ordo-path` - path to the directory being created. Must be absolute path where "/" is the root of the user's directory, e.g. **/some directory/another directory**.
- `authorization` - $token

#### Body

NONE

#### Parameters

NONE

#### Query Parameters

NONE

#### Errors

- **400** No ordo-path header
- **409** Directory already exists

#### Examples

##### Request (non-recursive):

| Headers                                                       | Query Parameters |
| ------------------------------------------------------------- | ---------------- |
| `ordo-path`: /this directory exists/this is the new directory |                  |
| `authorization`: $token                                       |                  |


##### Response (non-recursive):

Status code: **201**

```json
{
  "accessedAt": "2022-12-20T14:25:56.096Z",
  "createdAt": "2022-12-20T14:25:56.096Z",
  "updatedAt": "2022-12-20T14:25:56.096Z",
  "depth": 2,
  "path": "/this directory exists/this is the new directory",
  "readableName": "this is the new directory"
  "children": [],
}
```

##### Request (recursive):

| Headers                                                                                        | Query Parameters |
| ---------------------------------------------------------------------------------------------- | ---------------- |
| `ordo-path`: /this directory exists/this is the new directory/this is the nested new directory |                  |
| `authorization`: $token                                                                        |                  |

##### Response (recursive):

Status code: **201**

```json
{
  "accessedAt": "2022-12-20T14:25:56.096Z",
  "createdAt": "2022-12-20T14:25:56.096Z",
  "updatedAt": "2022-12-20T14:25:56.096Z",
  "depth": 2,
  "path": "/this directory exists/this is the new directory",
  "readableName": "this is the new directory",
  "children": [
    {
      "accessedAt": "2022-12-20T14:25:56.096Z",
      "createdAt": "2022-12-20T14:25:56.096Z",
      "updatedAt": "2022-12-20T14:25:56.096Z",
      "children": [],
      "depth": 3,
      "path": "/this directory exists/this is the new directory/this is the nested new directory",
      "readableName": "this is the nested new directory"
    }
  ]
}
```
### Get

Retrieves directory content. Can retrieve directories recursively. Can be configured via query parameters. The content of the tree is always sorted by entity type (directories first, files second) and alphabetically.

| Method | URL                        |
| ------ | -------------------------- |
| GET    | ${host}/api/fs/directories |

#### Required Headers

- `ordo-path` - path to the directory being retrieved. Must be absolute path where "/" is the root of the user's directory, e.g. **/some directory/another directory**.
- `authorization` - $token

#### Body

NONE

#### Parameters

NONE

#### Query Parameters

- `depth` (positive iteger) - how deep the directory tree should go. Providing `0` will remove the limit, forcing the API to return the full tree starting with the requested directory. **Defaults to `1`**: only the directory and its direct children are provided.


#### Errors

- **400** No ordo-path header or invalid depth query parameter value (non-number, negative number, fractional number, etc.)
- **404** Directory not found

#### Examples

##### Request (nested directory):

| Headers                         | Query Parameters |
| ------------------------------- | ---------------- |
| `ordo-path`: /dir 1/dir 2/dir 3 | ?depth=1         |
| `authorization`: $token         |                  |

##### Response (nested directory):

Status code: **200**

```json
{
  "accessedAt": "2022-12-20T14:25:56.096Z",
  "createdAt": "2022-12-20T14:25:56.096Z",
  "updatedAt": "2022-12-20T14:25:56.096Z",
  "depth": 3,
  "path": "/dir 1/dir 2/dir 3",
  "readableName": "dir 3",
  "children": [
    {
      "accessedAt": "2022-12-20T14:25:56.096Z",
      "createdAt": "2022-12-20T14:25:56.096Z",
      "updatedAt": "2022-12-20T14:25:56.096Z",
      "depth": 4,
      "path": "/dir 1/dir 2/dir 3/dir 4",
      "readableName": "dir 4"
      "children": [],
    }
  ]
}
```

##### Request (nested directory):

| Headers                 | Query Parameters |
| ----------------------- | ---------------- |
| `ordo-path`: /          | ?depth=0         |
| `authorization`: $token |                  |


##### Response (nested directory):

Status code: 200

```json
{
  "accessedAt": "2022-12-20T14:25:56.096Z",
  "createdAt": "2022-12-20T14:25:56.096Z",
  "updatedAt": "2022-12-20T14:25:56.096Z",
  "depth": 0,
  "path": "/",
  "readableName": "",
  "children": [
    {
      "accessedAt": "2022-12-20T14:25:56.096Z",
      "createdAt": "2022-12-20T14:25:56.096Z",
      "updatedAt": "2022-12-20T14:25:56.096Z",
      "depth": 1,
      "path": "/dir 1",
      "readableName": "dir 1"
      "children": [
        {
          "accessedAt": "2022-12-20T14:25:56.096Z",
          "createdAt": "2022-12-20T14:25:56.096Z",
          "updatedAt": "2022-12-20T14:25:56.096Z",
          "depth": 2,
          "path": "/dir 1/dir 2",
          "readableName": "dir 2",
          "children": [
            {
              "accessedAt": "2022-12-20T14:25:56.096Z",
              "createdAt": "2022-12-20T14:25:56.096Z",
              "updatedAt": "2022-12-20T14:25:56.096Z",
              "depth": 3,
              "path": "/dir 1/dir 2/dir 3",
              "readableName": "dir 3"
              "children": [
                {
                  "accessedAt": "2022-12-20T14:25:56.096Z",
                  "createdAt": "2022-12-20T14:25:56.096Z",
                  "updatedAt": "2022-12-20T14:25:56.096Z",
                  "depth": 4,
                  "path": "/dir 1/dir 2/dir 3/dir 4",
                  "readableName": "dir 4"
                  "children": [],
                }
              ],
            }
          ],
        }
      ],
    }
  ],
}
```

### Move

Moves directory. Returns the directory object with the new path (and other properties, if needed), with its direct descendants (depth 1) listed in the `children` array.

| Method | URL                        |
| ------ | -------------------------- |
| PATCH  | ${host}/api/fs/directories |

#### Required Headers

- `ordo-path-from` - path to the directory being moved. Must be absolute path where "/" is the root of the user's directory, e.g. **/some directory/another directory**.
- `ordo-path-to` - path to where the directory should be moved. Must be absolute path where "/" is the root of the user's directory, e.g. **/some directory/another directory**.
- `authorization` - $token

#### Body

NONE

#### Parameters

NONE

#### Query Parameters

NONE

#### Errors

- **400** No ordo-path-to or ordo-path-from header
- **404** Directory (from) not found
- **409** Directory (to) already exists

#### Examples

##### Request

| Headers                                                         | Query Parameters |
| --------------------------------------------------------------- | ---------------- |
| `ordo-path-from`: /dir 1/dir 2/this is wrong                    |                  |
| `ordo-path-to`: /dir 1/dir 2//dir 1/dir 2/dir 3/this is correct |                  |
| `authorization`: $token                                         |                  |

##### Response

Status code: 201

```json
{
  "accessedAt": "2022-12-20T14:25:56.096Z",
  "createdAt": "2022-12-20T14:25:56.096Z",
  "updatedAt": "2022-12-20T14:25:56.096Z",
  "depth": 4,
  "path": "/dir 1/dir 2/dir 3/this is correct",
  "readableName": "this is correct",
  "children": [
    {
      "accessedAt": "2022-12-20T14:25:56.096Z",
      "createdAt": "2022-12-20T14:25:56.096Z",
      "updatedAt": "2022-12-20T14:25:56.096Z",
      "depth": 5,
      "path": "/dir 1/dir 2/dir 3/this is correct/dir 5",
      "readableName": "dir 5"
      "children": [],
    }
  ]
}
```

### Delete

Archives directory or removes it completely. Returns the directory object, updated properties, and an empty children array.

| Method | URL                        |
| ------ | -------------------------- |
| DELETE | ${host}/api/fs/directories |

#### Required Headers

- `ordo-path` - path to the directory being куmoved. Must be absolute path where "/" is the root of the user's directory, e.g. **/some directory/another directory**.
- `authorization` - $token

#### Body

NONE

#### Parameters

NONE

#### Query Parameters

- `unlink` (enum 0|1) - completely remove directory without any possibility to restore it. `0` means archive only, `1` means unlinking. Defaults to `0`.

#### Errors

- **400** No ordo-path header or invalid unlink query parameter value (not 0 or 1)
- **404** Directory (from) not found

#### Examples

##### Request


| Headers                               | Query Parameters     |
| ------------------------------------- | -------------------- |
| `ordo-path`: /dir 1/dir 2/remove this | ?unlink=0, ?unlink=1 |
| `authorization`: $token               |                      |


##### Response

Status code: 200

```json
{
  "accessedAt": "2022-12-20T14:25:56.096Z",
  "createdAt": "2022-12-20T14:25:56.096Z",
  "updatedAt": "2022-12-20T14:25:56.096Z",
  "depth": 3,
  "path": "/dir 1/dir 2/remove this",
  "readableName": "remove this",
  "children": []
}
```
