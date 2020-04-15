module.exports = {
	client: {
		includes: [`${__dirname}/@app/client/graphql/**/*.graphql`],
		service: {
			name: 'postgraphile',
			localSchemaFile: `${__dirname}/data/schema.graphql`,
		},
	},
}
