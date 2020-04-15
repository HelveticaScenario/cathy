// This script is called from scripts/generate-cache
require('../server/config/env')
const { createPostGraphileSchema } = require('postgraphile')
const exportPostGraphileSchema = require('postgraphile/build-turbo/postgraphile/schema/exportPostGraphileSchema')
	.default
const { Pool } = require('pg')

const schemas = process.env.DATABASE_SCHEMAS
	? process.env.DATABASE_SCHEMAS.split(',')
	: ['app_public']

console.log(exportPostGraphileSchema)

async function main() {
	const pgPool = new Pool({
		connectionString: process.env.DATABASE_URL,
	})
	const gqlSchema = await createPostGraphileSchema(pgPool, schemas)
	await exportPostGraphileSchema(gqlSchema, {
		exportGqlSchemaPath: `${__dirname}/../data/schema.graphql`,
	})

	await pgPool.end()
}

main().then(null, (e) => {
	// eslint-disable-next-line no-console
	console.error(e)
	process.exit(1)
})
