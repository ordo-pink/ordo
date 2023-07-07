#!/usr/bin/env bash

# Configuration ---------------------------------------------------------------

set -eu

# Variables -------------------------------------------------------------------

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
DEFAULT='\033[0m'
EOL='\n'

PLATFORM=$(uname -ms)

ESBUILD_VERSION='0.18.9'
DENO_VERSION='v1.35.0'

ln -nf etc/init/deno.json deno.json

# Internal --------------------------------------------------------------------

function download_deno {
  if [ ! -f ./opt/deno ]; then
    if ! command -v unzip >/dev/null; then
      echo "Error: unzip is required to install Deno"; exit 1
    fi

    dir=$(mktemp -d)
    zip=$dir/deno-$DENO_VERSION.zip

    # Download the binary executable for the current platform
    case $PLATFORM in
      'Darwin arm64') curl -fLo "$zip" "https://github.com/denoland/deno/releases/download/$DENO_VERSION/deno-aarch64-apple-darwin.zip" &>/dev/null;;
      'Darwin x86_64') curl -fLo "$zip" "https://github.com/denoland/deno/releases/download/$DENO_VERSION/deno-x86_64-apple-darwin.zip" &>/dev/null;;
      'Linux x86_64') curl -fLo "$zip" "https://github.com/denoland/deno/releases/download/$DENO_VERSION/deno-x86_64-unknown-linux-gnu.zip" &>/dev/null;;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1
    esac

  # Extract the binary executable to the opt directory
    unzip -o $zip -d opt &>/dev/null
    chmod +x opt/deno
    rm $zip
  fi
}

# Download the ESBuild executable
function download_esbuild {
  if [ ! -f ./opt/esbuild ]; then
    dir=$(mktemp -d)
    tgz="$dir/esbuild-$ESBUILD_VERSION.tgz"

    # Download the binary executable for the current platform
    case $PLATFORM in
      'Darwin arm64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.18.9.tgz" &>/dev/null;;
      'Darwin x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.18.9.tgz" &>/dev/null;;
      'Linux arm64' | 'Linux aarch64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.18.9.tgz" &>/dev/null;;
      'Linux x86_64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.18.9.tgz" &>/dev/null;;
      'NetBSD amd64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.18.9.tgz" &>/dev/null;;
      'OpenBSD amd64') curl -fo "$tgz" "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.18.9.tgz" &>/dev/null;;
      *) echo "Error: Unsupported platform: $PLATFORM"; exit 1
    esac

    # Extract the binary executable to the opt directory
    tar -xzf "$tgz" -C "$dir" package/bin/esbuild
    mv "$dir/package/bin/esbuild" opt
    rm "$tgz"
  fi
}

# Build a binary from given source with Deno and puts it to the bin directory.
function compile_init_script {
  opt/deno compile \
    --allow-read \
    --allow-write \
    --allow-run \
    -o bin/init \
    boot/src/init/mod.ts \
    &>/dev/null
}

function start_init_script {
  bin/init
}

# Download opt binaries -------------------------------------------------------

## Download ESBuild -----------------------------------------------------------

printf "$BLUE→$DEFAULT Downloading "esbuild"... "

download_esbuild

printf "$GREEN✓$DEFAULT $EOL"

## Download Deno --------------------------------------------------------------

printf "$BLUE→$DEFAULT Downloading "deno", this might take a while... "

download_deno

printf "$GREEN✓$DEFAULT $EOL"

# TODO Move to separate scripts
# TODO Build deno compiler script and run it
# TODO Add go to opt
# TODO Add node to opt
# TODO Creating separate repositories (git subtree) 

# Build init script -----------------------------------------------------------

printf "$BLUE→$DEFAULT Compiling init executable... "

compile_init_script

printf "$GREEN✓$DEFAULT $EOL"

# Start init script -----------------------------------------------------------

start_init_script
