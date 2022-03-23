import { Switch } from "or-else";

export const JsonRpcErrorCodes = [-32700, -32600, -32601, -32602, -32603] as const;
export const JsonRpcServerErrorCodes = [
	-32000, -32001, -32002, -32003, -32004, -32005, -32006, -32007, -32008, -32009, -32010, -32011, -32012, -32013, -32014,
	-32015, -32016, -32017, -32018, -32019, -32020, -32021, -32022, -32023, -32024, -32025, -32026, -32027, -32028, -32029,
	-32030, -32031, -32032, -32033, -32034, -32035, -32036, -32037, -32038, -32039, -32040, -32041, -32042, -32043, -32044,
	-32045, -32046, -32047, -32048, -32049, -32050, -32051, -32052, -32053, -32054, -32055, -32056, -32057, -32058, -32059,
	-32060, -32061, -32062, -32063, -32064, -32065, -32066, -32067, -32068, -32069, -32070, -32071, -32072, -32073, -32074,
	-32075, -32076, -32077, -32078, -32079, -32080, -32081, -32082, -32083, -32084, -32085, -32086, -32087, -32088, -32089,
	-32090, -32091, -32092, -32093, -32094, -32095, -32096, -32097, -32098, -32099,
] as const;

export type JsonRpcErrorCode = typeof JsonRpcErrorCodes[number];
export type JsonRpcServerErrorCode = typeof JsonRpcServerErrorCodes[number];

export class JsonRpcError extends Error {
	static getMessage(code: JsonRpcErrorCode, message?: string) {
		return Switch.of(code)
			.case(
				-32700,
				"Invalid JSON was recieved by the server. An error occurred on the server while parsing the JSON text.",
			)
			.case(-32600, "The JSON sent is not a valid Request object.")
			.case(-32601, "The method does not exist / is not available.")
			.case(-32602, "Invalid method parameter(s).")
			.case(-32603, "Internal JSON-RPC error.")
			.default("Server error");
	}

	public code: number;

	constructor(code: JsonRpcErrorCode | JsonRpcServerErrorCode, message?: string) {
		super(message ? message : JsonRpcError.getMessage(code as JsonRpcErrorCode));
		this.code = code;
	}
}

export class JsonRpcParseError extends JsonRpcError {
	constructor(message?: string) {
		super(-32700, message);
	}
}

export class JsonRpcInvalidRequestError extends JsonRpcError {
	constructor(message?: string) {
		super(-32600, message);
	}
}

export class JsonRpcMethodNotFoundError extends JsonRpcError {
	constructor(message?: string) {
		super(-32601, message);
	}
}

export class JsonRpcInvalidParamsError extends JsonRpcError {
	constructor(message?: string) {
		super(-32602, message);
	}
}

export class JsonRpcInternalError extends JsonRpcError {
	constructor(message?: string) {
		super(-32603, message);
	}
}

export class JsonRpcServerError extends JsonRpcError {
	constructor(code: JsonRpcServerErrorCode, message: string) {
		super(code, message);
	}
}
