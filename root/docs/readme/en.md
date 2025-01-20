# Ordo.pink

> Bring Your Thoughts to ORDO

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f9131e0-14d5-42b2-8df4-36d3cad185f7/deploy-status)](https://app.netlify.com/sites/ordo-pink/deploys)
[![Lint](https://github.com/ordo-pink/ordo/actions/workflows/lint.yml/badge.svg)](https://github.com/ordo-pink/ordo/actions/workflows/lint.yml)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)
[![https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg](https://good-labs.github.io/greater-good-affirmation/assets/images/badge.svg)](https://good-labs.github.io/greater-good-affirmation)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fordo-pink%2Fordo.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fordo-pink%2Fordo?ref=badge_shield&issueType=license)

Ordo is an extensible engine for data storage.

## Features

- Local first (even sign-up is optional!)
- Rich text editor for text files
- Good old file explorer view
- Labels (a.k.a. tags) are first-class citizens here
- File linking for horizontal relations
- Embedding files into other files as if directories never existed (in Ordo, every directory is also a file!)
- Support for custom file properties
- User achievements for your leisure!
- Support for Notion-like databases, file/label relation graphs, kanban boards (~~SOON!~~), Excalidraw whiteboards, images,
  videos (~~SOON!~~), and what not (~~NOT VERY SOON!~~)!
- Custom extensions support and extension store (~~SOON!~~)
- Public sharing (~~SOON!~~)

## Core Principles

There are four principles that lay a foundation of what Ordo is striving to be:

### 1. Open Source

Ordo.pink is completely open sourced, most of the code is available under **GNU AGPL 3.0** with some libraries inside the `lib`
directory licensed under **The Unlicense**. Don't use any of this code in production, btw.

### 2. Local First

You probably didn't know that but "local first" is a fancy way to say "we don't want to pay for storing your data, dude". And
yeah, we don't want to, really. But, anyways, here's the deal:

- `FREE` without limits on space and upload size if you are not signed up (because we only store it on your current computer
  lol)
- `FREE` for **1000 files** of up to **1.5Mb** if signed up (we store it on your current computer and in the cloud so that you
  can get the info from your other computers if you sign in there). What goes beyond the limit is only stored on your current
  computer
- `PAID` if you want to store your belongings of bigger sizes and amounts (pricing section to be defined)
- `PAID` for team access because you can share the bill you know
- `PAID` for enterprises because the proletarians told us to show you Kuzkina Mat'

### 3. Security

The data you store on our end is encrypted both in transit and at rest. Finding content is also obfuscated since files are never
persisted by their name or path and bad guys would need to find keys first, and the keys are stored discretely. As for local
content - security is not an issue, just don't leave your laptop at computer shops too much.

### 4. Extensibility

Ordo works as an engine that allows providing custom extensions - functions - that can bring new features to Ordo, including
support for new content types, dynamic editor components and views, smart-contract/AI/LLM/blockchain/KGB/USSR commands for
automation, and even full-featured apps inside Ordo! Don't run Doom in the browser, run Doom in Ordo in the browser!

#### The state of extensibility

- As of now, you can add functions via pull requests here on GitHub (yes, meh)
- We are planning to add DevTools function and support for bringing in custom functions as files in your Ordo storage
  **shortly**
- We are planning to function store for publishing custom functions **longly?**

## License

Most of the Ordo.pink code is licensed under **GNU AGPL 3.0**, and some of the libraries residing in `lib` are licensed under
**The Unlicense**. See individual packages inside `lib` for more details.

## Starting the project

To start `ordo`, you need to clone the repo and then run `boot/boot.sh`. The script will download required binaries, compile
`bin/*` files, link all the necessary files, and what not.

```sh
boot/boot.sh
```

You can then make it all up and running with

```sh
bin/run
```

## Contribution Guide

Not yet established. Sincerely yours, lunch club.

## Roadmap

Coming soon.

## Points of Interest

- `lib/oath` - dependency free promise extension that brings laziness, error branch type definitions, simple cancellation and
  extended API
- `lib/result` - a sane alternative to try/catch in synchronous code flows
- `lib/option` - a nice way to say something is undefined
- `lib/switch` - switch operator gone wild
- `lib/maoka` - a 900-ish-byte renderer Ordo front-end is built with (imagine a world where React is 900-ish bytes)

## How to Get Started with Creating Functions

The best place to start is `lib/core` where all types reside. Those types are available globally, so you can
`Ordo.Metadata.Query` go brrr. We'll add some guides as soon as custom function development becomes possible.

## Cheers?

Cheers 🍻
