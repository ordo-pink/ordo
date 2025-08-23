# Ordo.pink sweech

A light-weight, well-typed, health-checked, and dependency-free alternative to JavaScript _switch_ statement.

## Usage

To use it, you can simply lift a value into **sweech** with `sweech.match`, chain `.case` for as many cases as you wish, and
then get whatever matched by calling `.default` that accepts instructions on what to do if nothing actually matched!

### Example

```typescript
import { sweech } from "@ordo-pink/switch"

sweech
	.match(true && false)
	.case(false, () => "You won!")
	.case(true, () => "Whoa, you broke JavaScript!")
	.default(() => "This is not gonna happen")
```

See examples below!

## Why **sweech**, not _switch_

- 💔 **No fallthrough**. In the conventional good (???) old _switch_ statement, you need to care about the `break`s. With
  **sweech**, every case automatically breaks the **sweech** from falling through to the next case.
- ⚖ **Validator functions**. Unlike _switch_ statement, where you can only use values to compare with the _switch_ statement
  argument, **sweech** allows you to use functions to validate the **sweech** argument value. Those functions accept the
  argument itself and let you decide whether the **sweech** should consider it a match or not. Just return a boolean.
- 🦥 **Lazy computation**. **sweech** allows you to delay computation based on the **sweech** case you fall into, until you fold
  the **sweech** by calling `.default`.
- ⛓ **Chaining**. You can dynamically extend your **sweech** which might be helpful in situations where the cases depend on
  something outside the scope of the **sweech** itself.

## API

The **sweech** is fairly straightforward.

### `sweech` Static Methods

The `sweech.match` accepts one argument:

- **x** - anything to match cases against. Returns an object that implements `Sweech.Instance`. In TypeScript, `Sweech.Instance`
  has two paramaters: the **TContext** which is inferred from the type of **x** and the **TResult** which holds all possible
  `Sweech.Instance` return value types. The **TResult** is transformed into a Union when you fold the **sweech** with a
  `.default`.

### `sweech` Instance Methods

The `.case` accepts two arguments:

- **predicate** - something to validate with. It may be a value of the same type as the one lifted into **sweech**, or a
  function that accepts the value in the **sweech** as an argument, and returns a boolean. If the predicate is a function, the
  case will be considered matched if the function returns true. **sweech** will always validate the value against the predicate
  (be it a function or a value) at the moment it was defined. But the **on_true** function will only be called when you unfold
  **sweech** by calling `.default`.
- **on_true** - a function that accepts the `x` and returns the value that should be returned if the case matched. Keep in mind
  that **sweech** will ignore the rest of the cases defined later in the chain, if the case has already matched. Even if they
  could also potentially match. Another thing to be aware of is that **sweech** is a lazy little one. It does not call the
  **on_true** function until you end the chain with the `.default` method.

The `.default` accepts one argument:

- **on_none_matched** -a function that accepts the `x` and returns the value that should be returned if none of the cases
  matched. **sweech** will not unfold the value until you end the `.case` chain with a `.default`. As soon as you call
  `.default`, the **sweech** will be folded into one of the **on_true** return values (the one that was matched first in the
  chain), or the **onAllFalse** return value.

## Extensions

The `@ordo-pink/sweech/extensions` package includes some helper methods that are not mandatory within the package but you may
find them useful in certain situations.

The `sweech_helpers.of_true` accepts no arguments and compares all case predicates against `true`.

The `sweech_helpers.of_false` accepts no arguments and compares all case predicates against `false`.

## Usage

### A Lottery Game

Here is a lottery game example. Basically, you get a random number, and you get a reward string based on how big the number is.

```typescript
import { sweech } from "@ordo-pink/switch"

const num = Math.random()
const gte = min => num => num >= min

const result = sweech
	.match(num)
	.case(1, () => "JACKPOT!!!") // `1` is exclusive in Math.random, by the way
	.case(gte(0.9), () => "Much win!")
	.case(gte(0.5), () => "Some win")
	.case(gte(0.125), () => "Here's your nickel back")
	.default(() => "Loser! Loser! Na na, na-na na!")

console.log(result)
```
