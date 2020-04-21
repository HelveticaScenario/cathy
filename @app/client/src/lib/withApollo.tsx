// lib/withApollo.js
import React from 'react'
import withApollo from 'next-with-apollo'
import ApolloClient, { InMemoryCache, HttpLink } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

export default withApollo(
	({ initialState }) => {
		return new ApolloClient({
			cache: new InMemoryCache({
				dataIdFromObject: (o: any) => {
					console.log(o)
					return o.nodeId || null
				},
			}).restore(initialState || {}),
			uri:
				process.env.NODE_ENV === 'development'
					? 'http://localhost:8080/graphql'
					: 'https://cathy-prod.herokuapp.com/graphql',
		})
	},
	{
		render: ({ Page, props }) => {
			return (
				<ApolloProvider client={props.apollo}>
					<Page {...props} />
				</ApolloProvider>
			)
		},
	}
)
