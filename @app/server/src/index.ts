import './config/env'
import AWS from 'aws-sdk'
import express from 'express'
import { postgraphile, PostGraphileOptions } from 'postgraphile'
import { PoolConfig } from 'pg'
import { bar } from './foo'

const app = express()

var env = process.env.NODE_ENV || 'development'

const pgConfig = {
	host: process.env.DATABASE_HOST || 'localhost',
	port: Number(process.env.DATABASE_PORT) || 5432,
	user: process.env.DATABASE_OWNER,
	database: process.env.DATABASE_NAME,
	password: process.env.DATABASE_OWNER_PASSWORD,
}

// Your PostGraphile config:
// https://www.graphile.org/postgraphile/usage-library/#api-postgraphilepgconfig-schemaname-options
const postgraphileOptions: PostGraphileOptions = {
	enableCors: true,
	dynamicJson: true,
	/* ... */
}

if (env === 'development') {
	postgraphileOptions.exportGqlSchemaPath = '../../data/schema.graphql'
}
app.use(postgraphile(pgConfig, ['public', 'app_public'], postgraphileOptions))

app.listen(Number(process.env.PORT) || 3000)
