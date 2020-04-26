// lib/withApollo.js
import React from 'react'
import withApollo from 'next-with-apollo'

import { ApolloProvider } from '@apollo/react-hooks'

import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { onError } from 'apollo-link-error'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import ws from 'ws'

export default withApollo(
	({ initialState }) => {
		const httpLink = new HttpLink({
			uri:
				process.env.NODE_ENV === 'development'
					? 'http://localhost:8080/graphql'
					: 'https://cathy-prod.herokuapp.com/graphql',
			credentials: 'same-origin',
		})

		// Create a WebSocket link:
		const wsLink = new WebSocketLink(
			new SubscriptionClient(
				process.env.NODE_ENV === 'development'
					? 'ws://localhost:8080/graphql'
					: 'ws://cathy-prod.herokuapp.com/graphql',
				{
					reconnect: true,
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
			httpLink
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
				dataIdFromObject: (o: any) => {
					return o.nodeId || null
				},
			}).restore(initialState || {}),
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
