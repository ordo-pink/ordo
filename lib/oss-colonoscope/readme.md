# Colonoscope

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-success.svg)](http://unlicense.org/)

Colonoscope is a warm and welcoming party where a **doctor** (i.e. a parameterized string representing enpoint url, e.g.
`/hello/:what`) does **colonoscopy** (i.e. checking for presence of colons and extracting associated parameters) to a
**patient** (i.e. an actual url). Unlike some other libraries out there, `colonoscope` does not use regular expressions (and
other AI stuff), it just inspects the patient limb by limb instead.

## Usage

```typescript
import { colonoscope } from "@ordo-pink/colonoscope"

const route = "/api/:version/users/:user_id"

console.log(colonoscope.check(route, "/api/v1/users/1")) // { version: "v1", user_id: "1" }
```
