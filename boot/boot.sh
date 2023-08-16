#!/usr/bin/env bash

# Configuration

set -e

# Variables

EOL="\n"

PLATFORM=$(uname -ms)

ESBUILD_VERSION="0.18.9" # TODO: Move to init script
BUN_VERSION="0.7.3" # TODO: Replace with bun
TAILWIND_VERSION="v3.1.6" # TODO: Move to init script

if [ ! -f ./.env ]; then
  cp .env.example .env
fi

if [ ! -d ./opt ]; then
  mkdir ./opt
fi

# Internal

# TODO: Move to init script
function download_tailwind {
  if [ ! -f ./opt/tailwind ]; then
    dir=$(mktemp -d)
    file=$dir/tailwind-$TAILWIND_VERSION

    case $PLATFORM in
      'Darwin arm64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-macos-arm64";;
      'Darwin x86_64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-macos-x64";;
      'Linux arm64' | 'Linux aarch64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-linux-arm64";;
      'Linux x86_64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-linux-x64";;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1;;
    esac

    mv $dir/tailwind-$TAILWIND_VERSION opt/tailwind
    chmod +x opt/tailwind
  fi
}

function download_bun {
  if [ ! -f ./opt/bun ]; then
    if ! command -v unzip >/dev/null; then
      echo "Error: unzip is required to proceed"; exit 1
    fi

    dir=$(mktemp -d)
    zip=$dir/bun-$BUN_VERSION.zip

    # Download the binary executable for the current platform
    case $PLATFORM in
      'Darwin arm64') curl -fLo "$zip" "https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION/bun-darwin-aarch64.zip";;
      'Darwin x86_64') curl -fLo "$zip" "https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION/bun-darwin-x64.zip";;
      'Linux aarch64' | 'Linux arm64') "https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION/bun-linux-x64.zip";;
      'Linux x86_64') curl -fLo "$zip" "https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION/bun-linux-x64-baseline.zip";;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1;;
    esac

  # Extract the binary executable to the opt directory
    unzip -o $zip -d opt &>/dev/null
    chmod +x opt/bun
    rm $zip
  fi
}

# TODO: Move to init script
# Download the ESBuild executable
function download_esbuild {
  if [ ! -f ./opt/esbuild ]; then
    dir=$(mktemp -d)
    tgz="$dir/esbuild-$ESBUILD_VERSION.tgz"

    # Download the binary executable for the current platform
    case $PLATFORM in
      'Darwin arm64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.18.9.tgz";;
      'Darwin x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.18.9.tgz";;
      'Linux arm64' | 'Linux aarch64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.18.9.tgz";;
      'Linux x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.18.9.tgz";;
      'NetBSD amd64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.18.9.tgz";;
      'OpenBSD amd64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.18.9.tgz";;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1;;
    esac

    # Extract the binary executable to the opt directory
    tar -xzf "$tgz" -C "$dir" package/bin/esbuild
    mv "$dir/package/bin/esbuild" opt
    rm "$tgz"
  fi
}

# Build a binary from given source with Bun and puts it to the bin directory.
function compile_init_script {
  opt/bun build boot/src/init/index.ts --compile --outfile init && mv -f init bin/init
}

function start_init_script {
  bin/init
}

# Download opt binaries

## Download ESBuild

download_esbuild

## Download TailwindCSS

download_tailwind

## Download Bun

download_bun

# Build init script

compile_init_script

# Start init script

start_init_script
