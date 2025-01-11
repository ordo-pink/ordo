# Maoka

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

Maoka is a 1.5Kb library for rendering user interfaces (and annoying JavaScript devs).

## Quick start

Here's a canonical counter example but it actually discounts:

```javascript
import { Maoka } from "maoka"

const Discounter = Maoka.create("button", ({ refresh, element }) => {
	let counter_state = 0

	element.onclick = () => {
		counter_state--
		refresh()
	}

	return () => String(counter_state)
})

const app = document.getElementById("app")

if (app) Maoka.render_dom(app, Discounter)
```

### Quick Start Explained

It all starts with importing the entirety of Maoka. Since it's ridiculously small, it's ok to pick it up all together.

Maoka components are created with `Maoka.create` that accepts a tag and a callback function. The whole point of Maoka rendering
is that it does exactly zero automagic tricks for detecting if anything needs to be rerendered - instead you get a good old
`refresh` function in callback params that you call when you want something to be rerendered. You also get a reference to the
HTML element created for your Maoka component, and some other stuff we'll discuss a bit later.

Inside the callback we create a `let` variable of the counter state. YES! A `let` variable! For the state! Not an entire RxJS
bundle, not a tuple of a getter and a setter, not even a class method - a simple `let` variable! Yay, innit?

We then assign a click listener to the element where we decrement the `counter_state` and call `refresh` to update the state of
the component.

At the end of the component declaration we return a thunk of a string representation of the `counter_state`. This thunk thing is
very important, we'll discuss it in a second.

Finally, we go get a div with an id of **app** and `Maoka.render_dom` our component there. And that's it - if you create an HTML
page with this `<div id="app"></div>` and refer to this script there, it will count af.

Capital letters in component names are completely optional, btw. It's not react. 😏

Now, regarding the `refresh` and the thunk... Let's talk about

## Component Lifecycle

```javascript
// NOTE: on_unmount is available via parameters of the component callback
const MyComponent = Maoka.create("div", ({ on_unmount }) => {
	// ON_MOUNT: this part is only executed when the component is mounted into the DOM
	// Put initialisers, subscriptions, fetches, and addEventListeners here

	on_unmount(() => {
		// ON_UNMOUNT: this part is executed when the component is removed from the DOM
		// Put unsubscriptions, cancellations, and removeEventListeners here
	})

	return () => {
		// ON_REFRESH: this is the part that is refreshed when `refresh` is called
		// Put here whatever you want your DOM to contain and update with `refresh`
	}
})
```

> Keep in mind that whenever a component is refreshed, all its child components are unmounted and mounted again.

If you want to pass additional parameters to a component, you can wrap it into a function:

```javascript
const my_component = my_params =>
	Maoka.create("div", () => {
		return () => my_params.dont_touch_them.they_are_not_yours
	})
```

## Maoka.styled

Maoka is shipped with a helper function that creates styled components. Styled components cannot be rerendered, and they are
only updated when their parents refresh (do your parents refresh?). Since they are built that way, they have a slightly
different API to make their reuse easier - they accept a tag string and an optional `Record<string, string>` of HTML attributes,
and return a function that accepts a thunk of children:

```javascript
import { Maoka } from "maoka"

const StyledCard = Maoka.styled("div", { class: "card" })
const StyledCardTitle = Maoka.styled("h1", { class: "card-title" })
const StyledCardText = Maoka.styled("p", { class: "card-text" })
const StyledCardFooter = Maoka.styled("div", { class: "card-footer" })

const UndeadScourgeButton = Maoka.create("button", ({ element }) => {
	element.onclick = () => alert("Right click for hot undead action!")

	return () => "This better be good"
})

// Maoka children can be Maoka components, strings, numbers, undefined,
// null, or arrays of any combinations of those
const UndeadScourgeCard = StyledCard(() => [
	StyledCardTitle(() => "Necromancers say"),
	StyledCardText(() => "The shadows beacon."),
	StyledCardFooter(() => UndeadScourgeButton),
])
```

Now that you know what Necromancers say, let's take a look at the internals:

## Maoka Component

People always ask me - what a perfect component is? And here is a pro tip - make sure you hit the like button and subscribe to
the channel - a perfect component is a function. When you call `Maoka.create`, it actually returns a function that accepts the
following arguments:

- `create_element: TMaokaCreateMaokaElementFn<$TElement>` - a function that creates actual elements. With `render_dom` bundled
  with Maoka, it is the `document.createElement`. Yes, it doesn't work with SVGs. Dirty hacks to the resque!
- `root_element: TMaokaElement` - a root element of the tree where current element belongs. You usually provide it via render
  functions like `render_dom`.
- `root_id: string`, - a unique string identifier of the root element. It is safer to use this identifier than the
  `root_element` itself because, unlike the element, this identifier is unreachable outside the scope of the component tree.
  Might be useful for separating scopes in scenarios where you have multiple roots reusing the same components (e.g.
  microfrontends, routing, and other wars of nutrition).

This function then waits until you pass it to a render function that passes those parameters, and then pass them to their
children which in turn pass them to their children, and the circle of life continues until they reach you and me sitting here
and reading this document. A good example of such render function is

## Maoka.render_dom

```javascript
import { Maoka } from "maoka"

import { App } from "./app"

const root = document.querySelector("#root")
if (root) Maoka.render_dom(root, App)
```

As the name suggests, it renders a Maoka component to the DOM. The element itself remains untouched, the function does two
things:

1. It creates DOM structure of your component
2. It appends a `MutationObserver` to the root element that keeps track of unmounted nodes and calls their `on_unmount`
   callbacks if they are present

If you don't want a `MutationObserver` in your code, you can reimplement `render_dom` manually from scratch - but you'll need to
track and call `on_unmount`s or not use them at all.

In fact, you can render your root Maoka component as simply as:

```javascript
import { App } from "./app"

const create_element = document.createElement.bind(document)
const root = document.querySelector("#root")
const root_id = "what a root id!"

if (root) App(create_element, root, root_id)
```

## What Else

### Asynchrony & Lazy Loading

Maoka supports `async/await` for both the ON_MOUNT part of the component callback, and the ON_REFRESH part.

```javascript
import { Maoka } from "maoka"

const App = Maoka.create("div", async ({ refresh, on_unmount }) => {
	let timeout

	// Force the component to wait for 2 seconds before loading
	// idk why tho
	await new Promise(resolve => {
		timeout = setTimeout(resolve, 2000)
	})

	on_unmount(() => clearTimeout(timeout))

	return async () => {
		// There is a helper function in Maoka, called `lazy`.
		// You can use it as follows to get the same result as in the current block:
		//
		// return `Maoka.lazy(() => import("./my-component"))`
		const module = await import("./my-component")

		return module.default
	}
})
```

### Jabs

Jabs are like hooks in React because they start with `use`. Similarities end here. A jab is a function that accepts props of the
Maoka component callback. You can then pass a jab to the `use` function, which is also available via Maoka component callback
props. It basically sets you free from the necessity of providing the callback params manually.

```typescript
import { Maoka, type TMaokaJab } from "maoka"

const jab_class =
	(cls: string): TMaokaJab =>
	({ element }) => {
		element.setAttribute("class", cls)
	}

const MyComponent = Maoka.create("div", ({ use }) => {
	use(jab_class("my-component"))

	return () => "Baby Shark do-do do-do do-do"
})
```

### Browser Compatibility

Maoka only works in modern browsers, but there are a few tricks you can use to extend compat with older browsers.

#### Adding Support for IE11, Chrome < 92, Edge < 92, Safari < 15.4, Firefox < 95, Opera < 78

Since Maoka uses `crypto.randomUUID()` for generating root and element IDs, browsers from 2021 don't know how to work that out.

To fix that, you can polyfill `crypto.randomUUID()` globally:

```javascript
// Replace `window` with `self` or `global` depending on your needs
if (!window.crypto) window.crypto = {}
if (!window.crypto.randomUUID) {
	var i = 0
	window.crypto.randomUUID = function () {
		return String(i++) // It ain't much but it's honest work
	}
}
```

#### Adding Support for Mesozoic Era

If you fancy letting dinosaurs see your website, simply do not use `Maoka.render_dom` (see the
[Maoka.render_dom](#maokarender_dom) section of the readme for reference). If IE9+ is ok for you, you can listen for mutation
events like `DOMNodeRemoved` to handle `on_unmount` events. Alternatively, you can omit using `on_unmount` whatsoever - then
Maoka will work evvvriwhere.

### License

The Unlicense

## TODO

- Examples
- `render_str` that renders Maoka components into HTML
- `render_json` (maybe)
- Maoka state manager (maybe). It feels like it should be called Moana
- Maoka router (maybe). It feels like it should be called Mazay

## FAQ

- - _Q_: Why snake_case? No semicolons? Tabs?
  - _A_: To annoy people
- - _Q_: What is Maoka?
  - _A_: It's in 樺太廳
- - _Q_: Can I use this in production?
  - _A_: No
- - _Q_: What about performance?
  - _A_: What about performance?
- - _Q_: Cheers?
  - _A_: Cheers 🍻
- - _Q_: Is it 1.5Kb really?
  - _A_: Here's the whole minified Maoka code in 1272 chars:

```
var B=(M,A)=>async(j,q,v)=>{const N=crypto.randomUUID(),C=j(M);let T;const P={get id(){return N},get element(){return C},get root_id(){return v},get root_element(){return q},use:(w)=>w(P),refresh:async()=>{if(!A||!T)return;await D(j,q,v,T,C)},on_unmount:(w)=>{if(!C.onunmount)C.onunmount=[];C.onunmount.push(w)}};if(!A)return C;if(T=await A(P),!T)return C;return D(j,q,v,T,C)},F=(M)=>M().then((A)=>A.default),G=(M,A={})=>(j)=>B(M,({element:q})=>{return Object.keys(A).forEach((v)=>q.setAttribute(v,A[v])),j}),H=async(M,A)=>{const j=crypto.randomUUID(),q=A(document.createElement.bind(document),M,j);M.appendChild(await q);const v=(C)=>{if(I(C.onunmount)&&C.onunmount.length>0)C.onunmount.forEach((T)=>T());C.childNodes.forEach((T)=>v(T))};new MutationObserver((C)=>{for(let T of C){const P=T.removedNodes;for(let w=0;w<P.length;w++){const J=P[w];v(J)}}}).observe(M,{childList:!0,subtree:!0})},D=async(M,A,j,q,v)=>{if(!q)return v;let N=await q();if(!N)return v;if(!I(N))N=[E(N)?await N(M,A,j):N];const C=[];for(let T=0;T<N.length;T++){const P=N[T],w=E(P)?await P(M,A,j):K(P)?String(P):P;if(w)C.push(w)}return v.replaceChildren(...C),v},E=(M)=>typeof M==="function",K=(M)=>typeof M==="number",I=Array.isArray;var Q={create:B,lazy:F,styled:G,render_dom:H};export{Q as Maoka};
```
