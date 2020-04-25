import React, { useEffect, FC } from 'react'
import { useAuth0 } from '../lib/react-auth0-spa'
interface RequireAuthProps {}
const RequireAuth: FC<RequireAuthProps> = ({ children }) => {
	const { loading, isAuthenticated, loginWithRedirect } = useAuth0()

	useEffect(() => {
		if (loading || isAuthenticated) {
			return
		}
		const fn = async () => {
			await loginWithRedirect({
				appState: { targetUrl: window.location.pathname },
			})
		}
		fn()
	}, [loading, isAuthenticated, loginWithRedirect])

	return isAuthenticated === true ? <>{children}</> : null
}

export default RequireAuth
