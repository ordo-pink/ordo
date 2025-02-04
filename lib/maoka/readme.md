# Maoka

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

Maoka is a 2.3 KB library for rendering user interfaces (and annoying JavaScript devs).

## Quick start

Here's a canonical counter example but it actually discounts:

```javascript
import { Maoka } from "@ordo-pink/maoka"

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
// NOTE: onunmount is available via parameters of the component callback
const MyComponent = Maoka.create("div", ({ on_mount, onunmount }) => {
	// ON_CREATE: this part is executed ONCE the component is created

	on_mount(() => {
		// ON_MOUNT: this part is executed ONCE the component is mounted into the DOM
	})

	onunmount(() => {
		// ON_UNMOUNT: this part is executed ONCE the component is removed from the DOM
	})

	return () => {
		// ON_REFRESH: this part is executed on EVERY `refresh`
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
import { Maoka } from "@ordo-pink/maoka"

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
import { Maoka } from "@ordo-pink/maoka"

import { App } from "./app"

const root = document.querySelector("#root")
if (root) Maoka.render_dom(root, App)
```

As the name suggests, it renders a Maoka component to the DOM. The element itself remains untouched, the function does two
things:

1. It creates DOM structure of your component
2. It appends a `MutationObserver` to the root element that keeps track of unmounted nodes and calls their `onunmount` callbacks
   if they are present

If you don't want a `MutationObserver` in your code, you can reimplement `render_dom` manually from scratch - but you'll need to
track and call `onunmount`s or not use them at all.

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

Maoka supports `async/await` for both the ON_CREATE part of the component callback, and the ON_REFRESH part.

```javascript
import { Maoka } from "@ordo-pink/maoka"

const App = Maoka.create("div", async ({ refresh, onunmount }) => {
	let timeout

	// Force the component to wait for 2 seconds before loading
	// idk why tho
	await new Promise(resolve => {
		timeout = setTimeout(resolve, 2000)
	})

	onunmount(() => clearTimeout(timeout))

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
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"

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
events like `DOMNodeRemoved` and `DOMNodeInserted` to handle `on_mount` and `onunmount` events. Alternatively, you can omit
using `on_mount` and `onunmount` whatsoever - then Maoka will work evvvriwhere.

### License

The Unlicense

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
- - _Q_: Is it 2.3 KB really?
  - _A_: Here's the whole minified Maoka code in 2279 chars:

```
var E=(P,F)=>{let z=async(j,L,M)=>{let U=crypto.randomUUID(),D=j(P),O,B={get id(){return U},get element(){return D},get root_id(){return M},get root_element(){return L},use:(w)=>w(B),refresh:()=>{if(!F||!O)return;let w=new CustomEvent("refresh",{detail:{get_children:O,element:D},bubbles:!0});D.dispatchEvent(w)},onunmount:(w)=>{if(!D.onunmount)D.onunmount=[];D.onunmount.push(w)},on_mount:(w)=>{if(!D.onmount)D.onmount=[];D.onmount.push(w)}};if(z.element=D,z.id=U,z.root_id=M,z.refresh=B.refresh,!F)return D;if(O=await F(B),!O)return D;return await I(j,L,M,O,D)};return z},N=(P)=>P().then((F)=>F.default),Q=(P,F={})=>(z)=>E(P,({element:j})=>{return Object.keys(F).forEach((L)=>j.setAttribute(L,F[L])),z}),R=(P,F)=>E(P,({element:z})=>{z.innerHTML=F}),V=async(P,F)=>{let z=crypto.randomUUID(),j=P,L=document.createElement.bind(document),M=await F(L,j,z);P.appendChild(M);let U=new Map;P.addEventListener("refresh",(S)=>{S.stopPropagation();let{get_children:X,element:A}=S.detail,C=U.keys().toArray();if(~C.indexOf(A))return;for(let T=0;T<C.length;T++){if(C[T].contains(A))return;if(A.contains(C[T])){U.delete(C[T]),U.set(A,()=>I(L,j,z,X,A));return}continue}U.set(A,()=>I(L,j,z,X,A))});let D=requestIdleCallback?{timeout:1000}:void 0,O=requestIdleCallback??setTimeout,B=()=>Promise.all(U.entries().map(([S,X])=>X().then(()=>S))).then((S)=>S.map((X)=>U.delete(X))).then(()=>O(()=>void B(),D));O(()=>void B(),D);let G=(S)=>{if(J(S.onunmount)&&S.onunmount.length>0)S.onunmount.forEach((X)=>X());S.childNodes.forEach((X)=>G(X))},w=(S)=>{if(J(S.onmount)&&S.onmount.length>0)S.onmount.forEach((X)=>X());S.childNodes.forEach((X)=>w(X))};w(M),new MutationObserver((S)=>{for(let X of S){let{removedNodes:A,addedNodes:C}=X;for(let T=0;T<A.length;T++){let H=A[T];G(H)}for(let T=0;T<C.length;T++){let H=C[T];w(H)}}}).observe(P,{childList:!0,subtree:!0,attributeFilter:["onmount","onunmount"]})},I=async(P,F,z,j,L)=>{if(!j)return L;L.innerHTML="";let M=await j();if(!M)return L;if(!J(M))M=[K(M)?await M(P,F,z):M];let U=[];for(let D=0;D<M.length;D++){let O=M[D],B=K(O)?await O(P,F,z):W(O)?String(O):O;if(B)U.push(B)}return L.replaceChildren(...U),L},K=(P)=>typeof P==="function",W=(P)=>typeof P==="number",J=Array.isArray;var y={create:E,html:R,lazy:N,styled:Q,render_dom:V};export{y as Maoka};

```
