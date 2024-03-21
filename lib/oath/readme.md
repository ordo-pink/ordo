# Oath (oathify)

[![license](https://img.shields.io/badge/license-The%20Unlicense-green)](https://github.com/ordo-pink/ordo)
[![license](https://img.shields.io/badge/by-ordo.pink-db2777)](https://github.com/ordo-pink/ordo)
[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)

Oath is a dependency free extension for promises that introduces laziness, comfort, and
predictability to your asynchrony.

> Can you feel your heartbeat racing?

![Underoath](https://media.tenor.com/iE19Xk9OOiwAAAAC/band-bassist.gif "Underoath")

## Quick start

Starting with oaths is as easy as

```typescript
import { Oath } from "oathify"

const resolved = Oath.resolve(1) // Or, `Oath.of(1)`
const rejected = Oath.reject(2)
```

There's a helper function included called `oathify`. It transforms any function that returns a
Promise into a function that returns an Oath:

```typescript
import { oathify } from "oathify"
import { promises } from "fs"

// The 0 at the end of the variable name is one of the ways to identify
// Oaths in your codebase. A neat trick borrowed from RxJS ($).
const readFile0 = oathify(promises.readFile)
```

## Laziness

Promises are eager. Oaths are lazy. They do not run before you tell them to.

So what? Well, the benefit here is that you do not need to bear all the params that would ever be
required for a function that returns that Promise. With Oath, you can simply enclose all the needed
values once and then trigger it wherever needed as a fancy Promise factory.

```typescript
import { Oath } from "oathify"

let i = 1
console.log(i) // 1

// This will not run before you tell it to
const wait100 = new Oath(resolve => {
	console.log(++i)
	setTimeout(resolve, 100)
})

// Like this, for example
wait100.toPromise() // 2
wait100.toPromise() // 3
wait100.toPromise() // 4
```

There are a few ways how to pull the Oath's trigger. Each of them gives you back a Promise that you
can operate with as you would normally do, including thens, async/awaits, and stuff.

### fork

The `fork` method accepts two arguments. Both of them have to be functions. If the Oath gets
rejected, the first function will be called. The second function will be called otherwise:

```typescript
import { Oath } from "oathify"

const resolved = Oath.resolve("yes")
const rejected = Oath.reject("no")

resolved.fork(console.error, console.log) // console.log("yes")
rejected.fork(console.error, console.log) // console.error("no")
```

The `fork` method returns a Promise of either the resolved, or the rejected value of the Oath. The
promise itself **always** resolves!

```typescript
import { Oath } from "oathify"

const resolved = Oath.resolve(1)
const rejected = Oath.reject(4)

resolved
	.fork(
		x => x + 1,
		y => y + 2,
	)
	.then(console.log) // 3

rejected
	.fork(
		x => x + 1,
		y => y + 2,
	)
	.then(console.log) // 5
```

### orNothing

The `orNothing` method accepts no arguments. If the Oath gets resolved, it returns the Promise of
the value from the Oath. If the Oath gets rejected, it returns a `Promise<void>` (`undefined`). The
Promise itself **always** resolves.

```typescript
import { Oath } from "oathify"

const resolved = Oath.resolve("yes")
const rejected = Oath.reject("no")

resolved.orNothing().then(console.log) // "yes"
rejected.orNothing().then(console.log) // undefined
```

### orElse

The `orElse` method accepts one argument that has to be a function. If the Oath gets resolved, it
returns the Promise of the value from the Oath. If the Oath gets rejected, it returns a Promise of
the value returned by the function provided to the `orElse` as an argument. The Promise itself
**always** resolves.

```typescript
import { Oath } from "oathify"

const resolved = Oath.resolve("yes")
const rejected = Oath.reject("no")

resolved.orElse(() => "Oops").then(console.log) // "yes"
rejected.orElse(() => "Oops").then(console.log) // "Oops"
```

### toPromise

The `toPromise` method accepts no arguments. If the Oath resolves, it returns a resolved Promise of
the Oath value. If the Oath rejects, it returns a rejected Promise of the Oath value. The Promise
**will** reject if the Oath rejected. This method may be useful if you want to try/catch an await,
whyever you would want to.

```typescript
import { Oath } from "oathify"

const resolved = Oath.resolve("yes")
const rejected = Oath.reject("no")

resolved.toPromise().then(console.log) // "yes"
rejected.toPromise().catch(console.log) // "no"
```

## Comfort

Oath comes along with extended API.

### Static methods

#### Oath.of, Oath.resolve

Creates an Oath of provided value that will resolve when triggered. `Oath.resolve` and `Oath.of` are
basically the same. `Oath.resolve` was added to provide similarity with Promise. It **does not**
await if the provided value is a Promise. You will end up having an Oath of Promise of a value.

```typescript
import { Oath } from "oathify"

Oath.of(1)
Oath.resolve("puzzles")
```

#### Oath.reject

Creates an Oath of provided value that will reject when triggered. It **does not** await if the
provided value is a Promise. You will end up having an Oath of Promise of a value.

```typescript
import { Oath } from "oathify"

Oath.reject("No-no-no-no-no")
```

#### Oath.empty

Creates an empty Oath that will resolve.

```typescript
import { Oath } from "oathify"

Oath.empty().toPromise().then(console.log) // undefined
```

#### Oath.from

Creates an Oath from provided Promise thunk. Putting the Promise into a thunk is needed to prevent
the eager behaviour of the Promise. If the Promise rejects, the Oath will reject as well. The Oath
will resolve otherwise.

```typescript
import { Oath } from "oathify"

Oath.from(() => new Promise(resolve => setTimeout(() => resolve("OK"), 300)))
	.toPromise()
	.then(console.log) // "OK"

Oath.from(() => new Promise((_, reject) => setTimeout(reject, 300)))
	.orElse(() => "Not hehe")
	.then(console.log) // "Not hehe"
```

#### Oath.try

Accepts a thunk that can throw. If the thunk throws, the Oath will reject. The Oath will resolve
with the value provided by the thunk otherwise.

```typescript
import { Oath } from "oathify"

Oath.try(() => JSON.parse('{ "a": "b" }'))
	.orNothing()
	.then(console.log) // { a: "b" }

Oath.try(() => JSON.parse("}"))
	.orElse(() => "Invalid JSON")
	.then(console.log) // "Invalid JSON"
```

It **does** work with asynchronous functions. If the provided function returns a Promise, `Oath.try`
works the same way as `Oath.from`: if the Promise rejects, the Oath will reject as well, and it will
resolve otherwise.

```typescript
import { Oath } from "oathify"

Oath.try(() => crypto.subtle.deriveKey("all", "the", "small", "things"))
	.orElse(() => "True care, truth brings")
	.then(console.log) // "True care, truth brings"
```

#### Oath.fromNullable

Creates an Oath of null that will reject if provided value is nullish (null or undefined), and an
Oath of the value that will resolve otherwise.

```typescript
import { Oath } from "oathify"

Oath.fromNullable("X").toPromise().then(console.log) // "X"

Oath.fromNullable(null)
	.fork(
		x => x,
		x => x,
	)
	.then(console.log) // null
```

#### Oath.fromBoolean

Accepts two required arguments (a predicate function and onTrue function) and an optional argument
(the onFalse function) to create an Oath that will resolve with what the onTrue function returns if
the predicate function returns `true`, and an Oath that will reject with what the onFalse function
returns (or `null` if it was not provided) otherwise.

```typescript
import { Oath } from "oathify"

Oath.fromBoolean(
	() => true,
	() => "A donut",
)
	.toPromise()
	.then(console.log) // "A donut"

Oath.fromBoolean(
	() => false,
	() => "A donut",
	() => "What da heil?!",
)
	.fork(
		x => x,
		x => x,
	)
	.then(console.log) // "What da heil?!"
```

### Instance methods

#### map

The `map` method applies provided function to the value of the Oath that will resolve. It **does
not** apply the function if the Oath will reject.

```typescript
import { Oath } from "oathify"

Oath.of(1)
	.map(num => num + 1)
	.map(num => num * 2)
	.orNothing()
	.then(console.log) // 4
```

#### rejectedMap

The `rejectedMap` method applies provided function to the value of the Oath that will reject. It
**does not** apply the function if the Oath will resolve. It **does not** switch rejecting Oath to
the rejecting Oath to a resolving Oath.

```typescript
import { Oath } from "oathify"

const jsonParse0 = (str: string) =>
	Oath.try(() => JSON.parse(str)).rejectedMap(() => "Invalid JSON")

jsonParse0("{}")
	.fork(
		x => x,
		x => x,
	)
	.then(console.log) // {}

jsonParse0("}")
	.fork(
		x => x,
		x => x,
	)
	.then(console.log) // "Invalid JSON"
```

#### bimap

The `bimap` method applies provided functions to the value of the Oath. If the Oath will reject, it
applies the first function. If the Oath will resolve, it applies the second function. It **does
not** switch rejecting Oath to the rejecting Oath to a resolving Oath.

```typescript
import { Oath } from "oathify"

// The Mortal Kombat character picks tracker
// Round 1. Fight

const picks = {} as Record<string, { name: string; value: number }>

const registerPick = (name: string) => {
	picks[name] = { name, value: 0 }
	return picks[name]
}
const updatePick = (name: string) => {
	picks[name].value++
	return picks[name]
}

const pick0 = (name: string) =>
	Oath.fromNullable(picks[name])
		.bimap(
			() => registerPick(name),
			() => updatePick(name),
		)
		.fix(x => x)

await pick0("Kitana").orNothing().then(console.log) // { name: "Kitana", value: 0 }
await pick0("Kitana").orNothing().then(console.log) // { name: "Kitana", value: 1 }
await pick0("Kitana").orNothing().then(console.log) // { name: "Kitana", value: 2 }
await pick0("Kung Lao").orNothing().then(console.log) // { name: "Kung Lao", value: 0 }
await pick0("Kung Lao").orNothing().then(console.log) // { name: "Kung Lao", value: 1 }
```

#### chain

The `chain` method applies provided function that returns an Oath to the value of the current Oath
Oath that will resolve. This method basically creates a real chain of Oaths (please, don't give long
chains of oaths in front of real people, it might make your life somewhat more complicated).

These are the rules of chaining:

- If the **current Oath will resolve** and the **provided function Oath will resolve**, the function
  **will be applied** and the **returned Oath will resolve**
- If the **current Oath will resolve** and the **provided function Oath will reject**, the function
  **will be applied** and the **returned Oath will reject**
- If the **current Oath will reject**, the function **will not be applied**

```typescript
import { Oath, oathify } from "oathify"
import { promises } from "fs"

const readFile0 = oathify(promises.readFile)
const jsonParse0 = (str: string) =>
	Oath.try(() => JSON.parse(str)).rejectedMap(() => "Invalid JSON")

const readJsonFile0 = (path: string) =>
	readFile0(path, "utf8")
		.rejectedMap(() => "File not found") // Simplified for brevity
		.chain(jsonParse0)

readJsonFile0("invalid-path.json").fork(console.error, console.log) // console.error("File not found")
readJsonFile0("data.csv").fork(console.error, console.log) // console.error("Invalid JSON")
readJsonFile0("data.json").fork(console.error, console.log) // console.log(...whatever data there was)
```

#### rejectedChain

The `rejectedChain` method applies provided function that returns an Oath to the value of the
current Oath Oath that will reject. If the **current Oath will reject**, the function **will be
applied** and the **returned Oath will reject**. If the **current Oath will resolve**, the function
**will not be applied**.

```typescript
import { Oath, oathify } from "oathify"
import { promises } from "fs"

const readFile0 = oathify(promises.readFile)
const writeFile0 = oathify(promises.writeFile)
const jsonParse0 = (str: string) =>
	Oath.try(() => JSON.parse(str)).rejectedMap(() => "Invalid JSON")

const readJsonFileOrOverwrite0 = (path: string) =>
	readFile0(path, "utf8")
		.chain(jsonParse0)
		.rejectedChain(() => writeFile0(path, "{}", "utf-8"))
		.fix(() => ({}))

// Will create the non-existent file
readJsonFileOrOverwrite0("non-existent.json").fork(console.error, console.log) // {}
// Will overwrite the file with "{}"
readJsonFileOrOverwrite0("existing.csv").fork(console.error, console.log) // {}
// Will read the contents of the file successfully
readJsonFileOrOverwrite0("existing.json").fork(console.error, console.log) // {...whatever data there was}
```

#### tap

The `tap` method applies the first provided function on the value of the Oath if the Oath will
resolve, and the second provided function (if it was provided) on the value of the Oath if the Oath
will reject. It returns an Oath of the same state, and the value of the returned Oath is unchanged.

```typescript
import { Oath } from "oathify"

Oath.of(1)
	.tap(console.log) // 1
	.map(x => x + 1)
	.tap(console.log) // 2
	.orNothing()

Oath.reject(1)
	.tap(() => void 0, console.log) // 1
	.rejectedMap(x => x + 1)
	.tap(() => void 0, console.log) // 2
	.orNothing()
```

#### swap

The `swap` method returns an Oath that will have the opposite branch. Swapping the Oath that will
resolve returns an Oath that will reject with the same value. Swapping the Oath that will reject
returns an Oath that will resolve with the same value.

```typescript
import { Oath } from "oathify"

Oath.of(1)
	.swap()
	.orElse(() => 2)
	.then(console.log) // 2

Oath.reject(1)
	.swap()
	.orElse(() => 2)
	.then(console.log) // 1
```

#### and

The `and` method is just like the `then` method on Promise. Drop whatever you wanted here. It
**does** support asynchronous functions. It is only executed if the Oath will resolve.

> This method is not called `then` and rather called `and` to avoid breaking compatibility with
> async/await. If you have an idea on how to find out at runtime whether Oath is being awaited for
> with the "await" keyword, please let me know.

Rules of "anding":

- If provided function returns an Oath, the `and` method works like `chain`
- If provided function returns a Promise, the `and` method oathifies the function, and works like
  `chain`
- The `and` method works like `map` otherwise

```typescript
import { Oath } from "oathify"

Oath.of(1)
	.and(x => x + 1)
	.and(x => Oath.of(x => x + 1))
	.and(x => Promise.resolve(x + 1))
	.orNothing()
	.then(console.log) // 4
```

#### fix

The `fix` method is just like `catch` method on Promise. Makes the Oath switch to the branch where
it will resolve. It **does** support asynchronous functions. It is only executed if the Oath will
reject.

```typescript
import { Oath } from "oathify"

Oath.reject(1)
	.fix(x => x + 1)
	.and(x => x + 1)
	.and(x => Oath.of(x => x + 1))
	.and(x => Promise.resolve(x + 1))
	.orNothing()
	.then(console.log) // 5
```

#### Trigger methods

Trigger methods were described above. They are used to transform the Oath into a Promise and fire
the execution. Oath does not run before you use one of the trigger methods. The methods include:

- `toPromise`
- `fork`
- `orElse`
- `orNothing`

## Predictability

Unlike Promise, Oath provides types for the rejected branch, as well as dedicated methods for
working with it (like `rejectedMap`, `rejectedChain` and `bimap`). This allows you to postpone any
management of errors until you are ready, or do them right in place without changing the execution
flow and "fixing" the state like it is done with `Promise.catch`.

This is especially helpful if you develop a library and you want to provide precise types of what
kind of errors might occur when the consumers of your library use your code. You can even omit
throwing errors and reject with specific strings, enum values, or just number, thus removing all the
necessity of `new Error`, stack trace collection and redundant catching all over the place.

### Cancellation

Oath can be cancelled (YES!!). To cancel an Oath, simply call `cancel()`. It works both inside and
outside Oath definition. Even if the Oath has internally got a pending Promise, it will abort that
Promise as well. If the Oath internally got a fulfilled Promise, it won't be cancelled, because
there is nothing to cancel already.

If you cancel an Oath right inside the Oath itself, make use you don't do that in a `.chain()`. If
you still need to do that in a `.chain()`, make sure you return an `Oath.of(o.cancel())` so that the
chaining itself does not break. The same rule applies to `.rejectedChain()`. It is completely fine
to return an `o.cancel()` in any other method.

The `.cancel()` method accepts an optional **reason** argument. If it is not provided, it will be
automatically set to _"Cancelled"_.

```tsx
import { Oath } from "oathify"
import { useEffect, useState } from "react"
import RenderIf from "../components/render-if"

type Item = { title: string; description: string }
type P = { id: string }
const ItemCard = ({ id }: P) => {
	const [item, setItem] = useState<Item | null>(null)

	useEffect(() => {
		const item0 = Oath.from(() => fetch(`/api/v1/items/${id}`).then(r$ => r$.json()))
			// Cancel it in place if the request was not a success
			// In this case you could also chain and reject to switch to the rejected branch
			.tap(response => response.status !== 200 && item0.cancel("Not found"))
			.map(setItem)

		item0.orElse(() => setItem(null))

		return () => {
			// Cancel it all on component unmount
			item0.cancel("Early rerender")
		}
	}, [id])

	return (
		<RenderIf condition={!!item}>
			<div className="card">
				<h1>{item.title}</h1>
				<p>{item.description}</p>
			</div>
		</RenderIf>
	)
}
```

## A benchmark of ten thousand, Mister Frisby

As the name suggests, each check was done **10,000** times. The benchmarking was done with the
`benchmark.ts` (see the repo), running with Bun (just `bun benchmark.ts`). The benchmarking was done
on a 11-nth gen Core i7 laptop with 16Gb of RAM, using Windows with Ubuntu inside WSL.

| Oath time, ms | Promise time, ms | Oath method | Promise method |
| ------------- | ---------------- | ----------- | -------------- |
| 0.0054        | 0.0028           | map         | then           |
| 0.0053        | 0.0029           | bimap       | then           |
| 0.0052        | 0.0029           | and         | then           |
| 0.0069        | 0.0018           | chain       | then           |
| 0.0052        | 0.0030           | fix         | catch          |

As you can see, Oath is about 2 times slower than Promise.

## Pst Scrptm

This package is a part of Ordo.pink monorepo. Feel free to ask for help, report bug reports,
contribute, or suggest improvements
[here on GitHub](https://github.com/ordo-pink/ordo/tree/main/lib/oath). Cheers! 🍻

The Unlicense
