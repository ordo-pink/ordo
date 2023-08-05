// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { assertEquals } from "#std/testing/asserts.ts"
import { backendFsUserMetadataRepository } from "./impl.ts"

Deno.test("backend-fs-user-metadata-repository", () => assertEquals(backendFsUserMetadataRepository, "backend-fs-user-metadata-repository"))
