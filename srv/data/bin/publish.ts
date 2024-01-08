// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { die, runCommand0 } from "@ordo-pink/binutil"
import { getc } from "@ordo-pink/getc"

const {
	ORDO_DT_ENV,
	ORDO_DT_PORT,
	ORDO_DT_REGION,
	ORDO_DT_DOCKER_REGISTRY,
	ORDO_DT_DOCKER_REGISTRY_SCOPE,
	ORDO_DT_DOCKER_REGISTRY_USERNAME,
	ORDO_DT_DOCKER_REGISTRY_PASSWORD,
	ORDO_DT_VERSION,
} = getc([
	"ORDO_DT_PORT",
	"ORDO_DT_ENV",
	"ORDO_DT_REGION",
	"ORDO_DT_DOCKER_REGISTRY",
	"ORDO_DT_DOCKER_REGISTRY_SCOPE",
	"ORDO_DT_DOCKER_REGISTRY_USERNAME",
	"ORDO_DT_DOCKER_REGISTRY_PASSWORD",
	"ORDO_DT_VERSION",
])

const build = `docker build --build-arg ORDO_DT_DOCKER_PORT=${ORDO_DT_PORT} --build-arg ORDO_DT_DOCKER_ENV=${ORDO_DT_ENV} --build-arg ORDO_DT_DOCKER_REGION=${ORDO_DT_REGION} -t ${ORDO_DT_DOCKER_REGISTRY}/${ORDO_DT_DOCKER_REGISTRY_SCOPE}/dt:${ORDO_DT_VERSION} -f ./srv/data/Dockerfile .`
const login = `docker login --username ${ORDO_DT_DOCKER_REGISTRY_USERNAME} --password ${ORDO_DT_DOCKER_REGISTRY_PASSWORD} ${ORDO_DT_DOCKER_REGISTRY}`
const publish = `docker push ${ORDO_DT_DOCKER_REGISTRY}/${ORDO_DT_DOCKER_REGISTRY_SCOPE}/dt:${ORDO_DT_VERSION}`

runCommand0(build)
	.chain(() => runCommand0(login))
	.chain(() => runCommand0(publish))
	.orElse(die())
