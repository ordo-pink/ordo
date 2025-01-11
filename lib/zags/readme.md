# ZAGS

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

A full-featured implementation of [zigzag](https://en.wikipedia.org/wiki/Zigzag) written without Zig. It is also a minimalistic
state manager, but it is not that important.

## Quick Start

```typescript
import { ZAGS } from "@ordo-pink/zags"

const zags = ZAGS.Of({ counter: 0 })
const partner = console.log

zags.marry(partner) // { counter: 0 }, false

zags.update({ counter: 1 }) // { counter: 1 }, true
zags.update({ counter: 2 }) // { counter: 2 }, true
zags.update({ counter: 3 }) // { counter: 3 }, true
zags.update({ counter: 4 }) // { counter: 4 }, true

zags.divorce(partner)

zags.update({ counter: 5 })
zags.update({ counter: 6 })

zags.marry(partner) // { counter: 6 }, false
```

## License

The Unlicense

## FAQ

- - _Q_: Why snake_case? No semicolons? Tabs?
  - _A_: To annoy people
- - _Q_: What is ZAGS?
  - _A_: It's a common abbreviation for a registry office in Russian (отдел Записи Актов Гражданского Состояния) where the state
    of marriage, among other `Records<string, unknown>` is updated.
- - _Q_: Can I use this in production?
  - _A_: No
- - _Q_: What about performance?
  - _A_: What about performance?
- - _Q_: Cheers?
  - _A_: Cheers 🍻
- - _Q_: Is it really 200B?
  - _A_: Here's the whole minified ZAGS code in 199 chars:

```
var u={Of:(i,S=[])=>({marry:(o)=>{S.push(o),o(i,!1)},divorce:(o)=>void S.splice(S.indexOf(o),1),update:(o)=>{i={...i,...o},S.forEach((p)=>p(i,!0))},unwrap:()=>structuredClone(i)})};export{u as ZAGS};
```
