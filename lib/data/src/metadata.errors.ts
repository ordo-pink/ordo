// TODO: Put all RRRs here
// TODO: Reduce the amount of rrrs, reuse across apps
export enum RrrEnum {
	EPERM = 1, // Permission denied
	ENOENT, // Not found
	EINTR, // Interrupted
	EIO, // I/O error
	ENXIO, // Invalid address
	EAGAIN, // Loading
	EACCES, // Access denied
	EEXIST, // Already exists
	EINVAL, // Invalid
	EMFILE, // Too many open files
	EFBIG, // File too big
	ENOSPC, // Out of memory
}

export const eperm = (location: string) => (debug?: string) => composeRrr(location)("EPERM", debug)
export const enoent = (location: string) => (debug?: string) =>
	composeRrr(location)("ENOENT", debug)
export const eintr = (location: string) => (debug?: string) => composeRrr(location)("EINTR", debug)
export const eio = (location: string) => (debug?: string) => composeRrr(location)("EIO", debug)
export const enxio = (location: string) => (debug?: string) => composeRrr(location)("ENXIO", debug)
export const eagain = (location: string) => (debug?: string) =>
	composeRrr(location)("EAGAIN", debug)
export const eacces = (location: string) => (debug?: string) =>
	composeRrr(location)("EACCES", debug)
export const eexist = (location: string) => (debug?: string) =>
	composeRrr(location)("EEXIST", debug)
export const einval = (location: string) => (debug?: string) =>
	composeRrr(location)("EINVAL", debug)
export const emfile = (location: string) => (debug?: string) =>
	composeRrr(location)("EMFILE", debug)
export const efbig = (location: string) => (debug?: string) => composeRrr(location)("EFBIG", debug)
export const enospc = (location: string) => (debug?: string) =>
	composeRrr(location)("ENOSPC", debug)

export type TRrr<_TKey extends keyof typeof RrrEnum = keyof typeof RrrEnum> = {
	key: _TKey
	code: (typeof RrrEnum)[_TKey]
	location: string
	debug?: string
}

export const composeRrr =
	(location: string) =>
	<_TKey extends keyof typeof RrrEnum>(key: _TKey, debug?: string): TRrr<_TKey> => ({
		key,
		code: RrrEnum[key] as const,
		debug,
		location,
	})

export const composeRrrThunk =
	(location: string) =>
	<_TKey extends keyof typeof RrrEnum>(key: _TKey, debug?: string) =>
	(): TRrr<_TKey> => ({
		key,
		code: RrrEnum[key] as const,
		debug,
		location,
	})

export const RRR = {
	enum: RrrEnum,
	compose: composeRrr,
	composeT: composeRrrThunk,
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
