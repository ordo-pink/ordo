/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Server } from "@ordo-pink/sdk-server"

export type Args = [access_key: string, secret_key: string, region: string, bucket: string, endpoint?: string]
export type Instance = Server.Data.Repository

export type Create = (...args: Args) => Instance
