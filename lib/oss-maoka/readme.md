# Maoka

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)

Maoka is a 4.69KB (nice!) library for rendering user interfaces (and annoying JavaScript devs).

## Quick start

Here's a canonical counter example but it actually discounts:

```javascript
import { maoka } from "@ordo-pink/maoka"

const discounter = maoka.create("button", ({ use, node }) => {
	let counter_state = 0

	const element = node.value

	element.onclick = () => {
		counter_state--
		use(maoka.dom.jabs.refresh$)
	}

	return () => String(counter_state)
})

const app = document.getElementById("app")

if (app) maoka.dom.render(app, discounter, () => crypto.randomUUID())
```

## Component Lifecycle

```javascript
import { maoka } from "@ordo-pink/maoka"

const component = maoka.create(
	"div",
	/* can be async */ ({ use }) => {
		// ON_CREATE: this part is executed when the component is created.

		use(
			maoka.dom.jabs.onmount((node /* Here you get the maoka node */) => {
				// ON_MOUNT: this part is executed when the component is mounted into the DOM.

				return () => {
					// ON_UNMOUNT: this part is executed when the component is unmounted from the DOM.
				}
			}),
		)

		use(
			MaokaDOM.Jabs.onunmount(() => {
				// ON_UNMOUNT: alternatively, you can assign onunmount handler with a dedicated jab
				// if you do not need access to what you did onmount.
			}),
		)

		// Returning is optional. If nothing is returned, the DOM content does not change.
		// Return `null` to purge current DOM node content.
		return /* can be async */ () => {
			// ON_REFRESH: this part is executed on first render and on every refresh.
			// Whatever is returned here will become the DOM node children.
			// Returning is optional. If nothing is returned, the DOM content does not change.
			// Return `null` to purge current DOM node content.
		}
	},
)
```

> Keep in mind that whenever a component is refreshed, all its child components are unmounted and mounted again.

## Provision of arguments

```typescript
import { maoka } from "@ordo-pink/maoka"

type Args = { str: string }
const greeter = maoka.create<Args>(
	"div",
	({ str }) =>
		() =>
			`Hello, ${str}!`,
)

const wrapper = maoka.create("div", () => () => greeter({ str: "world" }))
```

## Maoka Component

People always ask me - what a perfect component is? And here is a pro tip - make sure you hit the like button and subscribe to
the channel - a perfect component is a function. When you call `maoka.create`, it actually returns a function that lazily
expects the `root` - the top level node in the Maoka rendering hierarchy. The root element is created by the renderer of your
choice - be it `maoka.dom`, `maoka.string` or a renderer of your own!

This function then waits until you pass it to a render function that first creates the root for you and passes it to your top
level component, to then pass it to its children which in turn pass them to their children, and the circle of life continues
until they reach you and me sitting here in this document. A good example of such render function is

## maoka.dom.render

```javascript
import { maoka } from "@ordo-pink/maoka"

import { app } from "./app"

const root = document.querySelector("#root")
if (root) maoka.dom.render(root, app, () => crypto.randomUUID())
```

As the name suggests, it renders a Maoka component to the DOM. The element itself remains untouched, the function does three
things:

1. It creates DOM structure of your component from the lazy tree you define with the component structure
2. It appends a `MutationObserver` to the root element that keeps track of mounted and unmounted nodes and executes their
   `onmount` and `onunmount` jab callbacks if they are present
3. It listens for the `maoka.dom.jabs.refresh$` calls in components and rerenders them. Yes, the gotcha moment! Maoka does not
   refresh components by itself, it only notifies the root that they intend to do so. It is in the area of responsibility of the
   root to do the rerendering (or avoid rerendering if it is nested inside rerendering of a higher order)

If you don't want a `MutationObserver` in your code, you can reimplement `maoka.dom.render` manually from scratch - but you'll
need to consider what those three steps described above adress yourself.

In fact, you can render your root Maoka component as simply as:

```javascript
import { maoka } from "@ordo-pink/maoka"

import { app } from "./app"

const root_element = document.querySelector("#root")
const create_id = () => crypto.randomUUID()
const create_value = document.createElement.bind(document)

if (root) app({ id: create_id(), create_id, create_value })
```

Keep in mind that in this scenario Maoka components will not rerender when you call `maoka.dom.jabs.refresh$`.

## What Else

### Asynchrony & Lazy Loading

Maoka supports `async/await` for both the ON_CREATE part of the component callback, and the ON_REFRESH part. It is also
supported by `maoka.dom` in `maoka.dom.jabs.onmount` and `maoka.dom.jabs.onunmount`.

```javascript
import { maoka } from "@ordo-pink/maoka"

const app = maoka.create("div", async ({ use }) => {
	let timeout

	await new Promise(resolve => void (timeout = setTimeout(resolve, 2000)))

	use(maoka.dom.jabs.onunmount(onunmount(() => clearTimeout(timeout))))

	return async () => {
		const module = await import("./my-component")

		return module.default
	}
})
```

### Jabs

Jabs are like hooks in React because they start with `use`. Similarities end here. A jab is a function that accepts base
arguments of the Maoka component callback. You can then pass a jab to the `use` function, which is also available via Maoka
component callback props. It basically sets you free from the necessity of providing the callback params manually.

```typescript
import { type Maoka, maoka } from "@ordo-pink/maoka"

const set_attribute: Maoka.Jab<{ class: string }> = ({ class: cls, use }) =>
	use(maoka.dom.jabs.hit_if_dom(node => node.value.setAttribute("class", cls)))

const component = maoka.create("div", ({ use }) => {
	use(set_attribute({ class: "baby" }))

	return () => "shark do-do do-do do-do"
})
```

### Browser Compatibility

Maoka only works in modern browsers (like, IE11+ modern).

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
- - _Q_: Is it 0.84KB unzipped really?
  - _A_: Here's the whole minified Maoka code in 840 chars:

```
var u=(r,o,n)=>{let e=o();return{create_id:o,create_element:n,refresh_queue:new Map,get element(){return r},get id(){return e}}},p=(r,o)=>{let n=async(e)=>{let i=e.create_id(),t=e.create_element(r),a,s={get id(){return i},get element(){return t},get root(){return e},use:(l)=>l(s),refresh:()=>t.dispatchEvent(new CustomEvent("refresh",{detail:[i,t,()=>c(e,a,t)],bubbles:!0}))};if(n.element=t,n.id=i,n.refresh=s.refresh,!o)return t;if(a=await o(s),!a)return t;return await c(e,a,t)};return n},c=async(r,o,n)=>{if(!o)return n;let e=await o();if(!e)return n;if(!d(e))e=[T(e)?await e(r):e];let i=[];for(let t=0;t<e.length;t++){let a=e[t],s=T(a)?await a(r):m(a)?String(a):a;if(s)i.push(s)}return n.replaceChildren(...i),n},T=(r)=>typeof r==="function",m=(r)=>typeof r==="number",d=Array.isArray;var y={create:p,create_root:u};export{y as Maoka};
```

    - _A_: And here's the whole minified Maoka + MaokaDOM code in 2467 chars:

```
var y=(e,a,m)=>{let r=a();return{create_id:a,create_element:m,refresh_queue:new Map,get element(){return e},get id(){return r}}},b=(e,a)=>{let m=async(r)=>{let n=r.create_id(),s=r.create_element(e),i,d={get id(){return n},get element(){return s},get root(){return r},use:(T)=>T(d),refresh:()=>s.dispatchEvent(new CustomEvent("refresh",{detail:[n,s,()=>M(r,i,s)],bubbles:!0}))};if(m.element=s,m.id=n,m.refresh=d.refresh,!a)return s;if(i=await a(d),!i)return s;return await M(r,i,s)};return m},M=async(e,a,m)=>{if(!a)return m;let r=await a();if(!r)return m;if(!w(r))r=[_(r)?await r(e):r];let n=[];for(let s=0;s<r.length;s++){let i=r[s],d=_(i)?await i(e):x(i)?String(i):i;if(d)n.push(d)}return m.replaceChildren(...n),m},_=(e)=>typeof e==="function",x=(e)=>typeof e==="number",w=Array.isArray;var E={create:b,create_root:y};var p=(e)=>{try{return e instanceof HTMLElement}catch(a){return!1}},C=(e)=>({element:a})=>p(a)?void(a.onmount=e):void 0,g=(e)=>({element:a})=>p(a)?void(a.onunmount=e):void 0,D=({element:e})=>p(e),v=async(e,a,m)=>{let r=document.createElement.bind(document),n=E.create_root(e,m,r),s=await a(n),i;try{if(i=requestIdleCallback,!i)throw""}catch(t){i=setTimeout}let d=()=>n.refresh_queue.size?Promise.all(n.refresh_queue.entries().map(([t,o])=>{return n.refresh_queue.delete(t),o.render()})).then(()=>i(()=>void d())):i(()=>void d());if(i(()=>void d()),n.element.addEventListener("refresh",(t)=>{t.stopPropagation();let[o,l,f]=t.detail,u=n.refresh_queue.keys().toArray();if(n.refresh_queue.has(o))return;for(let c=0;c<u.length;c++){let h=n.refresh_queue.get(u[c])?.element;if(h&&h instanceof Element&&l instanceof Element&&l.contains?.(h)){n.refresh_queue.delete(u[c]);break}}n.refresh_queue.set(o,{element:l,render:f})}),!p(s))throw new TypeError("Could not create a DOM element from provided component");n.element.appendChild(s);let T=(t)=>{if(t.onunmount)t.onunmount();if(t.children)for(let o=0;o<t.children.length;o++)T(t.children[o])},k=(t)=>{if(t.onmount){let o=t.onmount();if(o&&typeof o==="function")t.onunmount=o}if(t.children)for(let o=0;o<t.children.length;o++)k(t.children[o])};k(s),new MutationObserver((t)=>{for(let o of t){let{removedNodes:l,addedNodes:f}=o;for(let u=0;u<l.length;u++){let c=l[u];T(c)}for(let u=0;u<f.length;u++){let c=f[u];k(c)}}}).observe(n.element,{childList:!0,subtree:!0,attributeFilter:["onmount","onunmount"]})};var I={Jabs:{onmount:C,onunmount:g,is_dom:D},is_maoka_dom_element:p,render:v};export{I as MaokaDOM};
```

    - _A_: Yes, I did the marketing. It's not <1KB, it's actually 2.5KB unzipped. Cheers 🍻
