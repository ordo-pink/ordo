# Maoka

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

Maoka is a 4KB library for on-demand rendering of user interfaces (and annoying JavaScript devs).

## Quick start

Here's a canonical counter example for the browser, but it actually discounts:

```javascript
// Maoka libary is tiny. To make it even smaller, it is split into separate
// parts - the component factory and renderers.
import maoka from "maoka" // ~700b unzipped
import maoka_dom from "maoka/dom" // ~3.7Kb unzipped

// Maoka does not react to anything you do, like in other UI frameworks and
// libraries. Instead, you need to manually instruct the renderer that it has
// to rerender the thing. You do that with a jab (maoka alternative to hooks)
// that may vary for different renderers.
const discounter = maoka.create(
	// The first argument is a string that represents maoka component type.
	"button",
	// The second argument is a callback function that describes the behavior of
	// the component.
	({ use }) => {
		let state = 0

		// Always check if you are under the right renderer. Adding a click
		// listener would make no sense if this component was rendered to markdown
		// instead of the DOM.
		use(
			maoka_dom.jabs.if_dom(node => {
				const element = node.value

				element.onclick = () => {
					// Don't forget to make state changes **before** you refresh the
					// component.
					state--

					// This is how you instruct DOM renderer that it needs to rerender the
					// current node. The `$` at the end is a visual hint for developers
					// that the jab may rerender the component. Use it as a convention to
					// be sure you don't fool anyone with unexpected rerenders.
					use(maoka_dom.jabs.refresh$)
				}
			}),
		)

		// Every time refresh$ is called, this part is executed and the returned
		// value is rendered to the DOM.
		return () => {
			// NOTE: Avoid using rerendering jabs (the ones with the $) here because
			// you may put yourself into an infinite rerendering loop.

			return String(state)
		}
	},
)

// Get a DOM node to mount to.
const app = document.getElementById("app")

// Render the component to the DOM node with `maoka_dom`.
app && maoka_dom.render(app, discounter(), () => crypto.randomUUID())
```

## Maoka

### Maoka Component

People always ask me - what a perfect component is? And here is a pro tip - make sure you hit the like button and subscribe to
the channel - a perfect component is a function. Technically, `maoka` just creates an extra-lazy tree where every node is packed
into a function, including the root node.

If you come from a functional programming realm, you certainly know that the best thing a function can return is another
function. Ideally, an application you create should never interfere with all that data and business logic stuff - just throw as
many functions as you can at the call stack. Being heavily inspired by this approach, your defenition of `maoka.create` not only
accepts a function as a second argument, it also _returns_ a function - that one expects the arguments (or no arguments if your
component does not require any). This one you need to call yourself. Guess what it returns after you call it? A function, of
course! It will then be used by the renderer - be it `maoka_dom`, `maoka_str` (WIP), or a renderer of your own!

### Provision of arguments

```typescript
import maoka from "maoka"

type Args = { str: string }
const greeter = maoka.create<Args /* This way you extend the component callback arguments type */>(
	"div",
	// Get the value to use in the component
	({ str }) => {
		return () => `Hello, ${str}!`
	},
)

const wrapper = maoka.create("div", () => {
	// Provide the value to the component
	return () => greeter({ str: "world" })
})
```

### Universal Component Lifecycle

```javascript
import maoka from "maoka"

const component = maoka.create(
	"div",
	/* can be async */ () => {
		// ON_CREATE: this part is executed when the component is created.

		// Returning is optional. If nothing is returned, the DOM content does not change.
		// Return `null` to purge previous DOM node content.
		return /* can be async */ () => {
			// ON_REFRESH: this part is executed on first render and on every refresh.
			// Whatever is returned here will become the DOM node children.
			// Returning is optional. If nothing is returned, the DOM content does not change.
			// Return `null` to purge previous DOM node content.
		}
	},
)
```

### Jabs

Jabs are like hooks in React because they start with `use`. Similarities end here. A jab is a function that accepts base
arguments of the Maoka component callback. You can then pass a jab to the `use` function, which is also available via Maoka
component callback props. It basically sets you free from the necessity of providing the callback params manually. This way you
can enable horizontal reuse of the behavior between your components.

```typescript
import { type Maoka, maoka } from "maoka"
import maoka_dom from "maoka/dom"

// Here's how you can create a jab.
const set_class: Maoka.Jab =
	(cls: string) =>
	// Reference to the node and the `use` function are provided to the jab
	// automatically from the component they are used in. NOTE: Component
	// arguments are **not** provided due to security reasons and bad design of
	// the library.
	({ use }) => {
		use(maoka_dom.jabs.if_dom(node => node.value.setAttribute("class", cls)))
	}

// Jabs can return values. The return type may be provided via the generic
// type `Maoka.Jab` accepts.
const count: Maoka.Jab<() => number> = (initial_state: number) => () => {
	// The state will be unique for every component you use this jab in, but it
	// will persist after refreshes because jabs are initialized at component
	// creation stage.
	let state = initial_state

	return () => state++
}

const component = maoka.create("div", ({ use }) => {
	use(set_class("baby"))
	const inc = use(count(1))

	inc() // 1

	return () => {
		inc() // 2
		const three = inc()

		return "shark".concat(" do-do".repeat(three))
	}
})
```

### Asynchrony & Lazy Loading

Maoka supports `async/await` for both the ON_CREATE part of the component callback, and the ON_REFRESH part.

```javascript
import maoka from "maoka"

const app = maoka.create("div", async ({ use }) => {
	let timeout

	await new Promise(resolve => void (timeout = setTimeout(resolve, 2000)))

	use(maoka_dom.jabs.onunmount(onunmount(() => clearTimeout(timeout))))

	return async () => {
		const module = await import("./my-component")

		return module.default
	}
})
```

## Maoka DOM

### Render function

```javascript
import maoka from "maoka"

import { app } from "./app"

const root = document.querySelector("#root")
if (root) maoka_dom.render(root, app(), () => crypto.randomUUID())
```

As the name suggests, it renders a Maoka component to the DOM. The DOM element itself remains untouched (except for the
children). The function does three things:

1. It creates DOM structure of your component from the lazy tree you define with the component structure
2. It appends a `MutationObserver` to the root element that keeps track of mounted and unmounted nodes and executes their
   `if_dom`, `onmount` and `onunmount` jab callbacks if they are present
3. It listens for the `maoka_dom.jabs.refresh$` calls in components and rerenders them.

### DOM Component Lifecycle

When you use DOM renderer, the lifecycle of the component is extended due to the fact that it now also mounts to (and unmounts
from) the DOM. The `onmount` and `onunmount` behavior can be described in dedicated jabs.

```javascript
import maoka from "maoka"
import maoka_dom from "maoka/dom"

const component = maoka.create("div", ({ use }) => {
	use(
		maoka_dom.jabs.if_dom(node => {
			// ON_CREATE_IN_DOM: Only happens during component creation if it was
			// initiated by the DOM renderer.
		}),
	)

	use(
		maoka_dom.jabs.onmount((node /* Here you get the maoka node */) => {
			// ON_MOUNT: this part is executed when the component is mounted into the
			// DOM.

			return () => {
				// ON_UNMOUNT: this part is executed when the component is unmounted
				// from the DOM.
			}
		}),
	)

	use(
		maoka_dom.jabs.onunmount(() => {
			// ON_UNMOUNT: alternatively, you can assign onunmount handler with a
			// dedicated jab if you do not need access to what you did onmount.
		}),
	)

	return () => {}
})
```

## FAQ

- - _Q_: Why snake_case? No semicolons? Tabs?
  - _A_: To annoy people
- - _Q_: What browsers is it compatible with?
  - _A_: Maoka only works in modern browsers (like, IE11+ modern).
- - _Q_: What is it licensed under?
  - _A_: The Unlicense
- - _Q_: What is Maoka?
  - _A_: It's in 樺太廳
- - _Q_: Can I use this in production?
  - _A_: No
- - _Q_: What about performance?
  - _A_: What about performance?
- - _Q_: Cheers?
  - _A_: Cheers 🍻
