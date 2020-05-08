import React, { FC } from 'react'
import { useRouter } from 'next/router'
import NextLink, { LinkProps } from 'next/link'
import { Flex, Text, Link as RebassLink } from 'rebass'

const Link: FC<LinkProps> = ({ children, href, ...props }) => {
	const router = useRouter()

	return (
		<NextLink passHref={true} href={href} {...props}>
			<RebassLink
				sx={{
					paddingRight: 10,
				}}
				variant={router.pathname === href ? 'navActive' : 'nav'}
			>
				{children}
			</RebassLink>
		</NextLink>
	)
}

export interface SharedLayoutProps {}
const SharedLayout: FC<SharedLayoutProps> = ({ children }) => {
	const router = useRouter()
	// const client = useApolloClient()
	return (
		<>
			<Flex
				px={2}
				color="white"
				bg="wheat"
				alignItems="center"
				justifyContent="space-between"
			>
				<Text p={2} fontWeight="bold">
					Cathy
				</Text>
				<Flex>
					<Link href="/">Home</Link>
				</Flex>
			</Flex>
			{children}
		</>
	)
}

export default SharedLayout
