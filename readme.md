# Ordo.pink Switch

[![lint](https://github.com/ordo-pink/switch/actions/workflows/lint.yml/badge.svg)](https://github.com/ordo-pink/switch/actions/workflows/lint.yml)
[![test](https://github.com/ordo-pink/switch/actions/workflows/test.yml/badge.svg)](https://github.com/ordo-pink/switch/actions/workflows/test.yml)
[![bundlephobia](https://img.shields.io/bundlephobia/min/@ordo-pink/switch?style=flat)](https://bundlephobia.com/package/@ordo-pink/switch)
[![downloads](https://img.shields.io/npm/dt/@ordo-pink/switch?style=flat)](https://www.npmjs.com/package/@ordo-pink/switch)
[![codecov](https://img.shields.io/codecov/c/gh/ordo-pink/switch)](https://app.codecov.io/gh/ordo-pink/switch)

A light-weight, well-typed, health-checked, and dependency-free alternative to JavaScript _switch_
statement.

## Usage

To use it, you can simply lift a value into **Switch** with `Switch.of`, chain `.case` for as many
cases as you wish, and then get whatever matched by calling `.default` that accepts instructions on
what to do if nothing actually matched!

```typescript
import { Switch } from "@ordo-pink/switch"

Switch.of(true && false)
  .case(false, () => "You won!")
  .case(true, () => "Whoa, you broke JavaScript!")
  .default(() => "This is not gonna happen")
```

See examples below!

## Why **Switch**, not _switch_

- 💔 **No fallthrough**. In the conventional good (???) old _switch_ statement, you need to care
  about the `break`s. With **Switch**, every case automatically breaks the **Switch** from falling
  through to the next case.
- ⚖ **Validator functions**. Unlike _switch_ statement, where you can only use values to compare
  with the _switch_ statement argument, **Switch** allows you to use functions to validate the
  **Switch** argument value. Those functions accept the argument itself and let you decide whether
  the **Switch** should consider it a match or not. Just return a boolean.
- 🦥 **Lazy computation**. **Switch** allows you to delay computation based on the **Switch** case
  you fall into, until you fold the **Switch** by calling `.default`.
- ⛓ **Chaining**. You can dynamically extend your **Switch** which might be helpful in situations
  where the cases depend on something outside the scope of the **Switch** itself.

## API

The **Switch** is fairly straightforward.

### `Switch` Static Methods

The `Switch.of` accepts one argument:

- **x** - anything to match cases against. Returns an object that implements `ISwitch`. In
  TypeScript, `ISwitch` has two paramaters: the **TContext** which is inferred from the type of
  **x** and the **TResult** which holds all possible `ISwitch` return value types. The **TResult**
  is transformed into a Union when you fold the **Switch** with a `.default`.

### `Switch` Instance Methods

The `.case` accepts two arguments:

- **predicate** - something to validate with. It may be a value of the same type as the one lifted
  into **Switch**, or a function that accepts the value in the **Switch** as an argument, and
  returns a boolean. If the predicate is a function, the case will be considered matched if the
  function returns true. **Switch** will always validate the value against the predicate (be it a
  function or a value) at the moment it was defined. But the **onTrue** thunk will only be called
  when you unfold **Switch** by calling `.default`.
- **onTrue** - a thunk with the value that should be returned if the case matched. Keep in mind that
  **Switch** will ignore the rest of the cases defined later in the chain, if the case has already
  matched. Even if they could also potentially match. Another thing to be aware of is that
  **Switch** is a lazy little one. It does not call the **onTrue** thunk until you end the chain
  with the `.default` method.

The `.default` accepts one argument:

- **onAllFalse** - a thunk with the value that should be returned if none of the cases matched.
  **Switch** will not unfold the value until you end the `.case` chain with a `.default`. As soon as
  you call `.default`, the **Switch** will be folded into one of the **onTrue** return values (the
  one that was matched first in the chain), or the **onAllFalse** return value.

### `lazySwitch`

`lazySwitch` is a helper function that makes **Switch** even lazier. It allows you to define the
**Switch** behaviour before the context is lifted into the **Switch**. You can pack up `lazySwitch`
into a variable and then call it with the value expected by the **Switch**. Keep in mind that if you
don't call `.default`, `lazySwitch` will return you an `ISwitch`.

## Installation

```sh
npm i @ordo-pink/switch
```

## Usage

### A Lottery Game

Here is a lottery game example. Basically, you get a random number, and you get a reward string
based on how big the number is.

```typescript
import { Switch } from "@ordo-pink/switch"

const somethingUnexpected = Math.random()

const lotteryResult = Switch.of(somethingUnexpected)
  // `1` is exclusive in Math.random, by the way
  .case(1, () => "JACKPOT!")
  .case(
    (num) => num >= 0.5,
    () => "Much win!",
  )
  .case(
    (num) => num >= 0.2,
    () => "Some win",
  )
  .case(
    (num) => num > 0.125,
    () => "Here's your nickel back",
  )
  .default(() => "Loser! Loser! Na na, na-na na!")

console.log(lotteryResult)
```

Here is the same example with `lazySwitch`.

```typescript
import { lazySwitch } from "@ordo-pink/switch"

const somethingUnexpected = Math.random()

const lottery = lazySwitch<number>((s) =>
  s
    .case(1, () => "JACKPOT!")
    .case(
      (num) => num >= 0.5,
      () => "Much win!",
    )
    .case(
      (num) => num >= 0.2,
      () => "Some win",
    )
    .case(
      (num) => num > 0.125,
      () => "Here's your nickel back",
    )
    .default(() => "Loser! Loser! Na na, na-na na!"),
)

const lotteryResult = lottery(somethingUnexpected)

console.log(lotteryResult)
```
