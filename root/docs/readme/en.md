# Ordo.pink

An open source

[![Lint](https://github.com/ordo-pink/ordo/actions/workflows/lint.yml/badge.svg)](https://github.com/ordo-pink/ordo/actions/workflows/lint.yml)

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)

[🇺🇸](/root/docs/readme/en.md) |
[Add translation](/root/docs/guides/adding-readme-translations/en.md)

## About

Ordo.pink

## Features

#### Horizontal references

- Ordo.pink

## License

Most of the Ordo.pink code is licensed under **GNU AGPL 3.0**, and some of the libraries residing in
`lib` are licensed under **The Unlicense**. See individual packages inside `lib` for more details.

## Starting the project

To start `ordo`, you need to clone the repo and then run `boot/boot.sh`. The script will download
required binaries, compile `bin/*` files, link all the necessary files, and what not.

```sh
boot/boot.sh
```

> Ordo lives in a handmade monorepo created from scratch just for Ordo. No reusability in mind. You
> can find out more about the structure of the project in **Repository Structure** section below.

After the script has finished, you can `bin/run` the whole `ordo` ecosystem locally and start
editing. By default, the app will start in **local** mode which means that your users, auth tokens,
data and content will be stored locally in files. You can find all that info in `var/*` directory
that will be created and prepopulated after you run `boot/boot.sh`.

```sh
bin/run
```

## Repository Structure

### BOOT

The `/boot` directory contains repo source code and initialisation scripts that are intended to be
executed when you fetch the repository. The `/bin` apps are created from here.

After you fetch the repository, run the `boot/boot.sh` script.

```sh
boot/boot.sh
```

### BIN

The `/bin` directory contains executables improve the developer experience while working with Ordo
monorepo. After you initialise the repository with a **boot** script, check out the commands in the
`/bin` directory with the _--help_ option.

```sh
bin/run --help
```

#### Creating a new bin

```sh
bin/mkbin NAME [options]
```

### LIB

The `/lib` directory contains library code. Put the source code of publishable and non-publishable
libraries here.

#### Creating a new lib

```sh
bin/mklib NAME [options]
```

### OPT

The `/opt` directory contains third-party applications.

### ROOT

The `/root` directory contains root owned things like repo assets and docs.

### SRV

The `/srv` directory contains application code. Client apps and backend services live here.

#### Creating a new srv

```sh
bin/mksrv NAME [options]
```

### VAR

The `/var` directory contains variable data such as build results, cache, backups, etc.
