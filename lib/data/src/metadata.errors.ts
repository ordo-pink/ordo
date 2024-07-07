// TODO: Put all RRRs here
// TODO: Reduce the amount of rrrs, reuse across apps
export enum RRR {
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

export type TRrr<_TKey extends keyof typeof RRR = keyof typeof RRR> = {
	key: _TKey
	code: (typeof RRR)[_TKey]
	location: string
	debug?: string
}

export const composeRrr =
	(location: string) =>
	<_TKey extends keyof typeof RRR>(key: _TKey, debug?: string): TRrr<_TKey> => ({
		key,
		code: RRR[key] as const,
		debug,
		location,
	})

export const composeRrrThunk =
	(location: string) =>
	<_TKey extends keyof typeof RRR>(key: _TKey, debug?: string) =>
	(): TRrr<_TKey> => ({
		key,
		code: RRR[key] as const,
		debug,
		location,
	})
