export const registerEvents =
	<T extends Partial<OrdoEvent>>(handlers: { [K in keyof T]: OrdoEventHandler<T[K]> }) =>
	(store: GlobalStore) =>
		Object.keys(handlers).forEach((key) =>
			store.on(key as keyof OrdoEvent, (handlers as unknown as Record<string, OrdoEventHandler<unknown>>)[key]),
		);

export const registerCommands = (commands: Command[]) => (store: GlobalStore) =>
	commands.forEach((command) => (store as unknown as { state: WindowState }).state.commands.push(command));
