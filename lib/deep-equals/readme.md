# deep_equals

Checks deep equality of two provided elements. Recursively checks equality for objects and arrays.

## Usage

```typescript
import { deep_equals } from "@ordo-pink/deep-equals"

const a = { hello: "world" }
const b = { hello: "world" }

console.log(deep_equals(a, b)) // true
```
