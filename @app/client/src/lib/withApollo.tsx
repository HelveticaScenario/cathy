// lib/withApollo.js
import React from 'react'
import withApollo from 'next-with-apollo'

import { ApolloProvider } from '@apollo/react-hooks'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import ws from 'ws'
import { NextPage } from 'next'
import { hasKey } from './utils'

function WithApolloWrapper<T extends { apollo: ApolloClient<R> }, R>({
	Page,
	props,
}: {
	Page: NextPage<T>
	props: T
}) {
	return (
		<ApolloProvider client={props.apollo}>
			<Page {...props} />
		</ApolloProvider>
	)
}

export default withApollo(
	({ initialState }) => {
		const rootUrl =
			process.env.NODE_ENV === 'development'
				? 'http://localhost:8080'
				: 'https://cathy-prod.herokuapp.com'

		const authLink = setContext(async (_, { headers }) => {
			// return the headers to the context so httpLink can read them
			return {
				headers: {
					...headers,
					// Authorization: token ? `Bearer ${token}` : '',
				},
			}
		})
		const httpLink = new HttpLink({
			uri: `${rootUrl}/graphql`,
			credentials: 'same-origin',
		})

		// Create a WebSocket link:
		const wsLink = new WebSocketLink(
			new SubscriptionClient(
				`${rootUrl.replace(/^http/, 'ws')}/graphql`,
				{
					reconnect: true,
					connectionParams: async () => {
						// return the headers to the context so httpLink can read them
						return {
							// authorization: token ? `Bearer ${token}` : '',
						}
					},
				},
				typeof WebSocket !== 'undefined' ? WebSocket : ws
			)
		)

		const link = split(
			// split based on operation type
			({ query }) => {
				const definition = getMainDefinition(query)
				return (
					definition.kind === 'OperationDefinition' &&
					definition.operation === 'subscription'
				)
			},
			wsLink,
			authLink.concat(httpLink)
		)
		return new ApolloClient({
			link: ApolloLink.from([
				onError(({ graphQLErrors, networkError }) => {
					if (graphQLErrors)
						graphQLErrors.forEach(({ message, locations, path }) =>
							console.log(
								`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
							)
						)
					if (networkError) console.log(`[Network error]: ${networkError}`)
				}),
				link,
			]),
			cache: new InMemoryCache({
				dataIdFromObject: (o: unknown) => {
					if (
						typeof o === 'object' &&
						o &&
						hasKey('nodeId', o) &&
						typeof o.nodeId === 'string'
					) {
						return o.nodeId
					}
					return null
				},
			}).restore(initialState || {}),
		})
	},
	{
		render: WithApolloWrapper,
	}
)
