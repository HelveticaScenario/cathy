import React, { FC, useEffect, useState } from 'react'
import { getDataFromTree } from '@apollo/react-ssr'
import withApollo from '../lib/withApollo'
import {
	useGetMessagesQuery,
	SubscribeToNewMessagesDocument,
	SubscribeToNewMessagesSubscriptionVariables,
	SubscribeToNewMessagesSubscription,
	useCreateMessageMutation,
} from '../gen/graphql'
import Link from 'next/link'
import { useRouter } from 'next/router'

function last<T>(arr: T[]): T | undefined {
	if (arr.length === 0) {
		return undefined
	}
	return arr[arr.length - 1]
}

function* transform<T, R>(transformer: (val: T) => R, arr: T[]) {
	for (const el of arr) {
		yield transformer(el)
	}
}

function mapIterable<T, R>(
	iterable: Iterable<T>,
	fn: (val: T) => R
): Iterable<R> {
	return {
		[Symbol.iterator]() {
			const iterator = iterable[Symbol.iterator]()
			return {
				next(...args) {
					const val = iterator.next(...args)
					if (val.done === true) {
						return val
					} else {
						return {
							value: fn(val.value),
							done: val.done,
						}
					}
				},
			}
		},
	}
}

interface IndexPageProps {}
const IndexPage: FC<IndexPageProps> = ({}) => {
	const router = useRouter()
	const [content, updateContent] = useState('')
	const { loading, data, subscribeToMore, fetchMore } = useGetMessagesQuery({
		variables: {
			limit: 3,
		},
	})
	const [createMessage] = useCreateMessageMutation()
	useEffect(
		() =>
			subscribeToMore<
				SubscribeToNewMessagesSubscription,
				SubscribeToNewMessagesSubscriptionVariables
			>({
				document: SubscribeToNewMessagesDocument,
				updateQuery: (previousResults, { subscriptionData }) => {
					const previousMessages = previousResults.messages
					const message = subscriptionData.data.listen.relatedNode

					if (
						!message ||
						!previousMessages ||
						message.__typename !== 'Message'
					) {
						return previousResults
					}
					return {
						...previousResults,
						messages: {
							__typename: 'MessagesConnection',
							edges: [
								...previousMessages.edges,
								{
									__typename: 'MessagesEdge',
									cursor: last(previousMessages.edges)?.node.nodeId,
									node: message,
								},
							],
						},
					}
				},
			}),
		[subscribeToMore]
	)

	const more = () =>
		fetchMore({
			updateQuery: (previousResults, { fetchMoreResult }) => {
				const previousMessages = previousResults.messages?.edges
				const messages = fetchMoreResult?.messages?.edges
				if (!previousMessages || !messages) {
					return previousResults
				}

				return {
					...previousResults,
					messages: {
						__typename: 'MessagesConnection',
						edges: [...messages, ...previousMessages],
					},
				}
			},
			variables: {
				limit: 3,
				cursor: data?.messages?.edges[0]?.cursor,
			},
		})

	const messages = Array.from(
		mapIterable(
			transform((edge) => {
				return {
					...edge.node,
				}
			}, data?.messages?.edges || []),
			({ id, content, nodeId }) => (
				<div key={nodeId} className="message">
					<div className="message__meta">message id: {id}</div>
					<div className="message__content">{content}</div>
				</div>
			)
		)
	)

	return (
		<div>
			<div>
				<button onClick={more}>more</button>
			</div>
			<div>
				<h1>My App</h1>
				<div>{messages}</div>
			</div>
			<div>
				<input
					value={content}
					onChange={(e) => updateContent(e.target.value)}
					type="text"
				/>
				<button
					disabled={content === ''}
					onClick={() => {
						createMessage({
							variables: {
								content,
							},
						})
						updateContent('')
					}}
				>
					submit
				</button>
			</div>
		</div>
	)
}

// export default withApollo(IndexPage, { getDataFromTree })
export default withApollo(IndexPage, {})
