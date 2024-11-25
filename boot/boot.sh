#!/usr/bin/env bash

# --- Configuration ---

set -e

# --- Variables ---

PLATFORM=$(uname -ms)

BUN_VERSION="1.0.30"
DENO_VERSION="2.0.0"
TAILWIND_VERSION="v3.1.6"

# --- Internal ---

# Download Tailwind executable
function download_tailwind {
  if [ ! -f ./opt/tailwind ]; then
    dir=$(mktemp -d)
    file=$dir/tailwind-$TAILWIND_VERSION

    case $PLATFORM in
    'Darwin arm64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-macos-arm64" ;;
    'Darwin x86_64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-macos-x64" ;;
    'Linux arm64' | 'Linux aarch64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-linux-arm64" ;;
    'Linux x86_64') curl -fLo $file "https://github.com/tailwindlabs/tailwindcss/releases/download/$TAILWIND_VERSION/tailwindcss-linux-x64" ;;
    *)
      echo "Error: Unsupported platform: $PLATFORM"
      exit 1
      ;;
    esac

    mv $dir/tailwind-$TAILWIND_VERSION opt/tailwind
    chmod +x opt/tailwind
  fi
}

# Download Bun executable
function download_bun {
  if [ ! -f ./opt/bun ]; then
    if ! command -v unzip >/dev/null; then
      echo "Error: unzip is required to proceed"
      exit 1
    fi

    dir=$(mktemp -d)
    zip=$dir/bun-$BUN_VERSION.zip

    case $PLATFORM in
    'Darwin arm64') NESTED_DIR="bun-darwin-aarch64" ;;
    'Darwin x86_64') NESTED_DIR="bun-darwin-x64" ;;
    'Linux arm64' | 'Linux aarch64') NESTED_DIR="bun-linux-x64" ;;
    'Linux x86_64') NESTED_DIR="bun-linux-x64-baseline" ;;
    *)
      echo "Error: Unsupported platform: $PLATFORM"
      exit 1
      ;;
    esac

    curl -fLo "$zip" "https://github.com/oven-sh/bun/releases/download/bun-v$BUN_VERSION/$NESTED_DIR.zip"

    unzip -o $zip -d opt &>/dev/null
    mv opt/$NESTED_DIR/bun opt/bun
    rm -rf opt/$NESTED_DIR
    chmod +x opt/bun
    rm $zip
  fi
}

function download_deno {
  if [ ! -f ./opt/deno ]; then
    if ! command -v unzip >/dev/null; then
      echo "Error: unzip is required to proceed"
      exit 1
    fi

    dir=$(mktemp -d)
    zip=$dir/bun-$DENO_VERSION.zip

    case $PLATFORM in
    'Darwin arm64') NESTED_DIR="deno-aarch64-apple-darwin" ;;
    'Darwin x86_64') NESTED_DIR="deno-x86_64-apple-darwin" ;;
    'Linux arm64' | 'Linux aarch64') NESTED_DIR="deno-aarch64-unknown-linux-gnu" ;;
    'Linux x86_64') NESTED_DIR="deno-x86_64-unknown-linux-gnu" ;;
    *)
      echo "Error: Unsupported platform: $PLATFORM"
      exit 1
      ;;
    esac

    curl -fLo "$zip" "https://github.com/denoland/deno/releases/download/v$DENO_VERSION/$NESTED_DIR.zip"

    unzip -o $zip -d opt &>/dev/null
    mv opt/$NESTED_DIR/deno opt/deno
    rm -rf opt/$NESTED_DIR
    chmod +x opt/deno
    rm $zip
  fi
}

# Build a binary from given source with Bun and puts it to the bin directory.
function compile_init_script {
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

download_tailwind

download_bun

# download_deno

## Install bin dependencies
opt/bun i

## Build init script
compile_init_script

## Start init script
start_init_script
