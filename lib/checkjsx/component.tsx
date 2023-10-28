// import { BehaviorSubject } from "rxjs"

// export default function Component() {
// 	// const value$ = new BehaviorSubject(0)

// 	return (
// 		<div>
// 			<div>{value$.value}</div>
// 			<button onClick={() => value$.next(value$.value + 1)}>Add</button>
// 		</div>
// 	)
// }

export default function Component() {
	// const value$ = new BehaviorSubject(0)
	const hello = "Hello"

	return (
		<div>
			{hello}
			{/* <div>{value$.value}</div> */}
			{/* <button onClick={() => value$.next(value$.value + 1)}>Add</button> */}
		</div>
	)
}
