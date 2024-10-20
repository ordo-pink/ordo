# Oath

[![license](https://img.shields.io/badge/license-The%20Unlicense-green)](https://github.com/ordo-pink/ordo)
[![license](https://img.shields.io/badge/by-ordo.pink-db2777)](https://github.com/ordo-pink/ordo)
[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)

Oath is a dependency free package that introduces laziness, cancellation and rejected branch type
definition support to your asynchronous code.

> Can you feel your heartbeat racing?

![Underoath](https://media.tenor.com/iE19Xk9OOiwAAAAC/band-bassist.gif "Underoath")

## License

The Unlicense

## A benchmark of ten thousand, Mister Frisby

As the name suggests, each check was done _100,000_ times. The benchmarking was done with the
`benchmark.ts` (see the repo), running with **Bun v1.0.30** (`bun benchmark.ts`) and **Deno v2.0.0**
(`deno benchmark.ts`). The benchmarking was done on an Intel Core Ultra 5 laptop with 16Gb of RAM,
using Windows with Ubuntu inside WSL 2.0.

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

This package is a part of Ordo.pink monorepo. Feel free to ask for help, report bug reports,
contribute, or suggest improvements
[here on GitHub](https://github.com/ordo-pink/ordo/tree/main/lib/oath). Cheers! 🍻
