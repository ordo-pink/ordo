/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { die, run_command } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"

const {
	ORDO_ID_ENV,
	ORDO_ID_PORT,
	ORDO_ID_REGION,
	ORDO_ID_DOCKER_REGISTRY,
	ORDO_ID_DOCKER_REGISTRY_SCOPE,
	ORDO_ID_DOCKER_REGISTRY_USERNAME,
	ORDO_ID_DOCKER_REGISTRY_PASSWORD,
	ORDO_ID_VERSION,
} = getc([
	"ORDO_ID_PORT",
	"ORDO_ID_ENV",
	"ORDO_ID_REGION",
	"ORDO_ID_DOCKER_REGISTRY",
	"ORDO_ID_DOCKER_REGISTRY_SCOPE",
	"ORDO_ID_DOCKER_REGISTRY_USERNAME",
	"ORDO_ID_DOCKER_REGISTRY_PASSWORD",
	"ORDO_ID_VERSION",
])

const build = `docker build --build-arg ORDO_ID_DOCKER_PORT=${ORDO_ID_PORT} --build-arg ORDO_ID_DOCKER_ENV=${ORDO_ID_ENV} --build-arg ORDO_ID_DOCKER_REGION=${ORDO_ID_REGION} -t ${ORDO_ID_DOCKER_REGISTRY}/${ORDO_ID_DOCKER_REGISTRY_SCOPE}/id:${ORDO_ID_VERSION} -f ./srv/id/Dockerfile .`
const login = `docker login --username ${ORDO_ID_DOCKER_REGISTRY_USERNAME} --password ${ORDO_ID_DOCKER_REGISTRY_PASSWORD} ${ORDO_ID_DOCKER_REGISTRY}`
const publish = `docker push ${ORDO_ID_DOCKER_REGISTRY}/${ORDO_ID_DOCKER_REGISTRY_SCOPE}/id:${ORDO_ID_VERSION}`

void run_command(build)
	.chain(() => run_command(login))
	.chain(() => run_command(publish))
	.orElse(die())
