export const InvalidRequestBodyErrorCode = 400

export const InvalidAPIKeyErrorCode = 401

export const BalanceDrainedErrorCode = 402

export const DomainVerificationFailedErrorCode = 403

export const UserDomainApiKeyNotFoundErrorCode = 404

export const UserUnsubscribedErrorCode = 422

export const ServiceTemporaryUnavailableErrorCode = 503

export type EmailStrategyRusenderError =
	| typeof InvalidRequestBodyErrorCode
	| typeof InvalidAPIKeyErrorCode
	| typeof BalanceDrainedErrorCode
	| typeof DomainVerificationFailedErrorCode
	| typeof UserDomainApiKeyNotFoundErrorCode
	| typeof UserUnsubscribedErrorCode
	| typeof ServiceTemporaryUnavailableErrorCode
