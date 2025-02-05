# S3 Persistence Strategy for User Data

This strategy implements storing user data in S3. The strategy is used by `backend-dt` for storing user files in S3.

NOTE: This implementation relies on Bun S3 client. Make sure you run your `backend-dt` instance with Bun to make it work
properly.

## Installation

```sh
bunx jsr add @ordo-pink/backend-persistence-strategy-data-s3 @ordo-pink/oath @ordo-pink/tau @ordo-pink/core
```

## Usage

```typescript
import { PersistenceStrategyDataS3 } from "@ordo-pink/backend-persistence-strategy-data-s3"

const data_persistence_strategy = PersistenceStrategyDataS3.Of({
	access_key: process.env.S3_ACCESS_KEY_ID,
	bucket: process.env.S3_BUCKET_NAME,
	endpoint: process.env.S3_ENDPOINT,
	region: process.env.S3_REGION,
	secret_key: process.env.S3_SECRET_ACCESS_KEY,
})

// Provide `data_persistence_strategy` to `create_backend_dt`. See more in "@ordo-pink/backend-dt".
```
