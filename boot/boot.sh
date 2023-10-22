#!/usr/bin/env bash

# --- Configuration ---

set -e

# --- Variables ---

PLATFORM=$(uname -ms)

ESBUILD_VERSION="0.18.9"
BUN_VERSION="1.0.3"
TAILWIND_VERSION="v3.1.6"

# --- Internal ---

# Download Tailwind executable
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

# Download Bun executable
function download_bun {
  if [ ! -f ./opt/bun ]; then
    if ! command -v unzip >/dev/null; then
      echo "Error: unzip is required to proceed"; exit 1
    fi

    dir=$(mktemp -d)
    zip=$dir/bun-$BUN_VERSION.zip

    

    case $PLATFORM in
      'Darwin arm64') NESTED_DIR="bun-darwin-aarch64";;
      'Darwin x86_64') NESTED_DIR="bun-darwin-x64";;
      'Linux arm64' | 'Linux aarch64') NESTED_DIR="bun-linux-x64";;
      'Linux x86_64') NESTED_DIR="bun-linux-x64-baseline";;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1;;
    esac

    curl -fLo "$zip" "https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION/$NESTED_DIR.zip"

    unzip -o $zip -d opt &>/dev/null
    mv opt/$NESTED_DIR/bun opt/bun
    rm -rf opt/$NESTED_DIR
    chmod +x opt/bun
    rm $zip
  fi
}

# Download ESBuild executable
function download_esbuild {
  if [ ! -f ./opt/esbuild ]; then
    dir=$(mktemp -d)
    tgz="$dir/esbuild-$ESBUILD_VERSION.tgz"

    case $PLATFORM in
      'Darwin arm64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.18.9.tgz";;
      'Darwin x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.18.9.tgz";;
      'Linux arm64' | 'Linux aarch64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.18.9.tgz";;
      'Linux x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.18.9.tgz";;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1;;
    esac

    tar -xzf "$tgz" -C "$dir" package/bin/esbuild
    mv "$dir/package/bin/esbuild" opt
    rm "$tgz"
  fi
}

# Build a binary from given source with Bun and puts it to the bin directory.
function compile_init_script {
  if [ ! -f ./opt/esbuild ]; then
    mkdir bin
  fi

  opt/bun build boot/src/init/index.ts --compile --outfile init && mv -f init bin/init
}

# Start the init script
function start_init_script {
  bin/init
}

# --- Run ---

## Copy .env
if [ ! -f ./.env ]; then
  cp ./.env.example ./.env
fi

## Create opt directory
if [ ! -d ./opt ]; then
  mkdir ./opt
fi

## Create bin directory
if [ ! -d ./bin ]; then
  mkdir ./bin
fi

## Download ESBuild
download_esbuild

## Download TailwindCSS
download_tailwind

## Download Bun
download_bun

## Install bin dependencies
bun i

## Build init script
compile_init_script

## Start init script
start_init_script
