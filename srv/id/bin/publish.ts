// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { die, runCommand0 } from "@ordo-pink/binutil"
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

runCommand0(build)
	.chain(() => runCommand0(login))
	.chain(() => runCommand0(publish))
	.orElse(die())
