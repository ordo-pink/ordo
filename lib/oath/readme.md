# Oath

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

Oath is a dependency free package that introduces laziness, cancellation and rejected branch type definition support to your
asynchronous code.

> Can you feel your heartbeat racing?

![Underoath](https://media.tenor.com/iE19Xk9OOiwAAAAC/band-bassist.gif "Underoath")

## Quick Start

```typescript
import React from "react"

const Book = (id: string) => {
	const [book, set_book] = React.useState(null)

	React.useEffect(() => {
		const url = `https://test.api/books/${id}`

		const book0 = Oath.FromPromise(() => fetch(url))
			.and(res => Oath.FromPromise(() => res.json()))
			.and(book => set_book(book))

		book0.invoke(invokers0.or_else(() => set_book(null)))

		return () => {
			book0.cancel("Component refreshed")
		}
	}, [id])

	if (!book) return null

	return (
		<div>
			<h1>{book.title}</h1>
			<p>{book.description}</p>
		</div>
	)
```

## License

The Unlicense

## A benchmark of ten thousand, Mister Frisby

As the name suggests, each check was done _100,000_ times. The benchmarking was done with the `benchmark.ts` (see the repo),
running with **Bun v1.0.30** (`bun benchmark.ts`) and **Deno v2.0.0** (`deno benchmark.ts`). The benchmarking was done on an
Intel Core Ultra 5 laptop with 16Gb of RAM, using Windows with Ubuntu inside WSL 2.0.

### Bun Results

| Oath time, ms | Promise time, ms | Oath method | Promise method |
| ------------- | ---------------- | ----------- | -------------- |
| 0.0065        | 0.0021           | map         | then           |
| 0.0065        | 0.0021           | bimap       | then           |
| 0.0065        | 0.0021           | and         | then           |
| 0.0065        | 0.0021           | fix         | catch          |
| 0.0079        | 0.0011           | chain       | then           |

### Deno 2.0 Results

| Oath time, ms | Promise time, ms | Oath method | Promise method |
| ------------- | ---------------- | ----------- | -------------- |
| 0.023         | 0.018            | map         | then           |
| 0.023         | 0.018            | bimap       | then           |
| 0.023         | 0.018            | and         | then           |
| 0.023         | 0.018            | fix         | catch          |
| 0.032         | 0.013            | chain       | then           |

As you can see, Oath is about 2 times slower than Promise.

## Pst Scrptm

This package is a part of Ordo.pink monorepo. Feel free to ask for help, report bug reports, contribute, or suggest improvements
[here on GitHub](https://github.com/ordo-pink/ordo/tree/main/lib/oath). Cheers! 🍻
