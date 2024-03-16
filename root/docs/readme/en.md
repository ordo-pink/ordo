# Ordo Monorepo

[![CI](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml/badge.svg)](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml)

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)

[🇺🇸](/root/docs/readme/en.md) |
[Add translation](/root/docs/guides/adding-readme-translations/en.md)

## Repository Structure

### BIN

The `/bin` directory contains executables improve the developer experience while working with Ordo
monorepo. After you initialise the repository with a **boot** script, check out the commands in the
`/bin` directory with the _--help_ option.

```sh
bin/mkbin --help
```

### BOOT

The `/boot` directory contains repo source code and initialisation scripts that are intended to be
executed when you fetch the repository. The `/bin` apps are created from here.

After you fetch the repository, run the `boot/boot.sh` script.

```sh
boot/boot.sh
```

### LIB

The `/lib` directory contains library code. Put the source code of publishable and non-publishable
libraries here.

### OPT

The `/opt` directory contains third-party applications.

### ROOT

The `/root` directory contains root owned things like repo assets and docs.

### SRV

The `/srv` directory contains application code. Put your servable apps here.

### VAR

The `/var` directory contains variable data such as build results, cache, backups, etc.
