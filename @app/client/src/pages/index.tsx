import { FC } from 'react'
import { getDataFromTree } from '@apollo/react-ssr'
import withApollo from '../lib/withApollo'
// import SharedLayout from '../components'
// import { useAuth } from 'react-use-auth'
import { stringifyCyclical } from '../lib/utils'
import withAuth from '../lib/withAuth'
import { useAuth0 } from '../lib/react-auth0-spa'

interface IndexPageProps {}
const IndexPage: FC<IndexPageProps> = ({}) => {
	const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
	return (
		<div>
			{!isAuthenticated && (
				<button onClick={() => loginWithRedirect({})}>Log in</button>
			)}

			{isAuthenticated && <button onClick={() => logout()}>Log out</button>}
			{stringifyCyclical(user)}
		</div>
	)
}

export default withAuth(withApollo(IndexPage, { getDataFromTree }))
