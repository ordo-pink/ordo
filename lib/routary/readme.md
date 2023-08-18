# Routary Engine

> Zoom-Zoom © Mazda

Routary is a router written in TypeScript. It can be used in any environment including browser, but
it was mainly designed to be used with [Bun](https://bun.sh) or [Deno](https://deno.land) and their
cool `serve` feature. Routary is into cars jargon (just like me), so if you find the names
confusing, here is a reference of what is what in common language:

- `Crankshaft` is the

## Advantages of Routary

- **Increased cooling**: If you use something rotary, you're super cool.
- **Weight benefit**: Router walls and cooling fins are very light. Just TODO kb compiled.
- **Smooth running**: Using Routary is as simple as:

### Bun

```typescript
import { Router } from "routary"

const fetch = Router()
	.get("/", () => new Response("Welcome Home (Sanitarium)"))
	.orElse(() => new Response(404, "Not found"))

Bun.serve({ fetch })
```

## Disadvantages of Routary

Although you might have heard that rotary engines have issues with fuel waste and apex seals
wearing, Routary is just a piece of code - not a real rotary engine - so it's effectively flawless.
