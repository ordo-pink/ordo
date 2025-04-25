# @ordo-pink/zags

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

A full-featured implementation of [zigzag](https://en.wikipedia.org/wiki/Zigzag) written without Zig. It is also a minimalistic
state manager, but it is not that important.

## Quick Start

```typescript
import { create_zags } from "@ordo-pink/zags"

const zags = create_zags({ counter: 0 })
const partner = console.log

zags.marry(partner) // { counter: 0 }, false

zags.update("counter", i => i + 1) // { counter: 1 }, true
zags.update("counter", i => i + 1) // { counter: 2 }, true
zags.update("counter", i => i + 1) // { counter: 3 }, true
zags.update("counter", i => i + 1) // { counter: 4 }, true

zags.divorce(partner)

zags.update("counter", i => i + 1)
zags.update("counter", i => i + 1)

const divorce = zags.marry(partner) // { counter: 6 }, false
divorce()

zags.update("counter", i => i + 1)
```
