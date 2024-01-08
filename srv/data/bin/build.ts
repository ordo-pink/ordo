// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createDirectoryIfNotExists0, mv0 } from "@ordo-pink/fs"
import { runCommand0 } from "@ordo-pink/binutil"
import { ConsoleLogger } from "@ordo-pink/logger"
import { keysOf } from "@ordo-pink/tau"
import { getc } from "@ordo-pink/getc"

const { ORDO_DT_ENV, ORDO_DT_PORT, ORDO_DT_REGION, ORDO_DT_DOCKER_REGISTRY, ORDO_DT_VERSION } =
	getc([
		"ORDO_DT_PORT",
		"ORDO_DT_ENV",
		"ORDO_DT_REGION",
		"ORDO_DT_DOCKER_REGISTRY",
		"ORDO_DT_VERSION",
	])

const command = `sudo docker build --build-arg ORDO_DT_DOCKER_PORT=${ORDO_DT_PORT} --build-arg ORDO_DT_DOCKER_ENV=${ORDO_DT_ENV} --build-arg ORDO_DT_DOCKER_REGION=${ORDO_DT_REGION} -t ${ORDO_DT_DOCKER_REGISTRY}/dt:${ORDO_DT_VERSION} -f ./srv/data/Dockerfile .`

runCommand0(command)
	// TODO: Publish docker image
	.orElse(ConsoleLogger.error)
