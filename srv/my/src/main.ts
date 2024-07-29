import { ConsoleLogger } from "@ordo-pink/logger"
import { create_client } from "@ordo-pink/frontend-client"

const logger = ConsoleLogger
const is_dev = import.meta.env.DEV

const hosts = {
	id: import.meta.env.VITE_ORDO_ID_HOST,
	website: import.meta.env.VITE_ORDO_WEBSITE_HOST,
	static: import.meta.env.VITE_ORDO_STATIC_HOST,
	dt: import.meta.env.VITE_ORDO_DT_HOST,
	my: import.meta.env.VITE_ORDO_WORKSPACE_HOST,
}

create_client({
	logger,
	hosts,
	is_dev,
})
