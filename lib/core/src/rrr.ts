import { ErrorType } from "@ordo-pink/core"

export const eperm =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EPERM", debug)
export const enoent =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("ENOENT", debug)
export const eintr =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EINTR", debug)
export const eio =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EIO", debug)
export const enxio =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("ENXIO", debug)
export const eagain =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EAGAIN", debug)
export const eacces =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EACCES", debug)
export const eexist =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EEXIST", debug)
export const einval =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EINVAL", debug)
export const emfile =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EMFILE", debug)
export const efbig =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EFBIG", debug)
export const enospc =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("ENOSPC", debug)

export const compose_rrr =
	(location: string) =>
	<$TKey extends keyof typeof ErrorType>(key: $TKey, ...debug: any[]): Ordo.Rrr<$TKey> => ({
		key,
		code: ErrorType[key] as const,
		debug,
		location,
	})

export const compose_rrr_thunk =
	(location: string) =>
	<$TKey extends keyof typeof ErrorType>(key: $TKey, ...debug: any[]) =>
	(): Ordo.Rrr<$TKey> => ({
		key,
		code: ErrorType[key] as const,
		debug,
		location,
	})

export const RRR = {
	enum: ErrorType,
	compose: compose_rrr,
	compose_thunk: compose_rrr_thunk,
	codes: {
		eperm,
		enoent,
		eintr,
		eio,
		enxio,
		eagain,
		eacces,
		eexist,
		einval,
		emfile,
		efbig,
		enospc,
	},
}
