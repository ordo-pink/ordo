import { JsonRpcError } from "./error";

export interface JsonRpcMessage {
	jsonrpc: "2.0";
}

export type JsonRpcMessageId = int | string;

export interface JsonRpcRequestMessage<Event extends OrdoEvent, Method extends keyof Event> extends JsonRpcMessage {
	id: JsonRpcMessageId;
	method: Method;
	params: OrdoEventRequest<Event, Method>;
}

export interface JsonRpcResponseMessage<Event extends OrdoEvent, Method extends keyof Event> extends JsonRpcMessage {
	id: JsonRpcMessageId;
	result: OrdoEventResponse<Event, Method>;
}

export interface JsonRpcNotificationMessage<Event extends OrdoEvent, Method extends keyof Event>
	extends JsonRpcMessage {
	method: Method;
	params: OrdoEventRequest<Event, Method>;
}

export interface JsonRpcErrorMessage {
	id: JsonRpcMessageId;
	error: JsonRpcError;
}

export interface CancelRequestMessage {
	method: "$/cancelRequest";
	params: {
		id: JsonRpcMessageId;
	};
}
