// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { runCommand0 } from "@ordo-pink/binutil"
import { ConsoleLogger } from "@ordo-pink/logger"
import { getc } from "@ordo-pink/getc"

const { ORDO_ID_ENV, ORDO_ID_PORT, ORDO_ID_REGION, ORDO_ID_DOCKER_REGISTRY, ORDO_ID_VERSION } =
	getc([
		"ORDO_ID_PORT",
		"ORDO_ID_ENV",
		"ORDO_ID_REGION",
		"ORDO_ID_DOCKER_REGISTRY",
		"ORDO_ID_VERSION",
	])

const command = `sudo docker build --build-arg ORDO_ID_DOCKER_PORT=${ORDO_ID_PORT} --build-arg ORDO_ID_DOCKER_ENV=${ORDO_ID_ENV} --build-arg ORDO_ID_DOCKER_REGION=${ORDO_ID_REGION} -t ${ORDO_ID_DOCKER_REGISTRY}/id:${ORDO_ID_VERSION} -f ./srv/id/Dockerfile .`

runCommand0(command)
	// TODO: Publish docker image
	.orElse(ConsoleLogger.error)
