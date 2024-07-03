// TODO: Put all RRRs here
// TODO: Reduce the amount of rrrs, reuse across apps
export enum RRR {
	EPERM, // Permission denied
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

	MR_EAGAIN,
	MR_EPERM,

	UR_EAGAIN,

	MQ_ENOENT,
	MQ_ENOENT_FSID,

	MC_FSID_CONFLICT,
	MC_NAME_CONFLICT,
	MC_ENOENT_PARENT,

	MV_EINVAL_FSID,
	MV_EINVAL_NAME,
	MV_EINVAL_PARENT,
	MV_EINVAL_ANCESTOR,
	MQ_INVALID_DESCENDENT,
	MQ_INVALID_CHILD,
	MQ_LINK_DOES_NOT_EXIST,
	MQ_CIRCULAR_PARENT_REFERENCE,
	MQ_INVALID_LINK,
	MQ_INVALID_LABEL,
	MQ_INVALID_SIZE,
	MQ_INVALID_TYPE,
	MQ_INVALID_PROPS,
}

export const rrr = <_TKey extends keyof typeof RRR>(key: _TKey) => RRR[key] as const

export const rrrThunk =
	<_TKey extends keyof typeof RRR>(key: _TKey) =>
	() =>
		RRR[key] as const
