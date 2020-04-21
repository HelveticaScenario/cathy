import { FC } from 'react'
import { getDataFromTree } from '@apollo/react-ssr'
import withApollo from '../lib/withApollo'
import SharedLayout from '../components/SharedLayout'

interface IndexPageProps {}
const IndexPage: FC<IndexPageProps> = ({}) => (
	<SharedLayout>
		<div>
			<h1>Hello</h1>
		</div>
	</SharedLayout>
)

export default withApollo(IndexPage, { getDataFromTree })
