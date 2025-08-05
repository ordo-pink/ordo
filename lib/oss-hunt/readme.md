# @ordo-pink/hunt

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

> Let the hunt begin.

Hunt is command manager for implementing your own ~~S.P.Q.R.~~ CQRS.

## Getting Started

```typescript
import { hunt } from "@ordo-pink/hunt"

type Preys = {
	// The key becomes the command name
	// To provide the expected command payload, wrap it { args: %PAYLOAD_TYPE% }
	replace_str: { args: string }
	// The keys can be nested, which will create dot-separated command names ("maths.add_one")
	maths: {
		// If you want the command to have no payload, assign args to be `void`
		add_one: { args: void }
	}
}

// Let the hunt begin
const hunter = hunt.begin<Preys>()

let num = 0
let str = "Hello, world"

// Register handlers for commands
// Every command may have multiple handlers
// When the command is emitted, they will be called in the order they were registered.
const putdown = hunter.track("maths.add_one", () => num++)
hunter.track("replace_str", new_str => void (str = new_str))

// Call the commands
hunter.shoot("maths.add_one")
hunter.shoot("maths.add_one")

putdown()

hunter.shoot("maths.add_one") // Ignored since tracking ended

hunter.shoot("replace_str", "Goodbye, world")

// Check the result
console.log(num) // 2
console.log(str) // "Goodbye, world"

hunter.track("maths.add_one", () => num++)

// The ignored shot is now applied since tracking was reenabled
console.log(num) // 3
```
