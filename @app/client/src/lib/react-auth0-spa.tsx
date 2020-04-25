import React, { useState, useEffect, useContext, FC } from 'react'
import createAuth0Client, {
	Auth0ClientOptions,
	Auth0Client,
	GetIdTokenClaimsOptions,
	RedirectLoginOptions,
	GetTokenSilentlyOptions,
	GetTokenWithPopupOptions,
	PopupConfigOptions,
	LogoutOptions,
	IdToken,
} from '@auth0/auth0-spa-js'

const DEFAULT_REDIRECT_CALLBACK = () =>
	window.history.replaceState({}, document.title, window.location.pathname)
interface IAuth0Context {
	isAuthenticated: boolean
	user: unknown
	loading: boolean
	popupOpen: boolean
	loginWithPopup: (params?: {}) => Promise<void>
	handleRedirectCallback: () => Promise<void>
	getIdTokenClaims: (
		options?: GetIdTokenClaimsOptions | undefined
	) => Promise<IdToken> | undefined
	loginWithRedirect: (
		options?: RedirectLoginOptions | undefined
	) => Promise<void> | undefined
	getTokenSilently: (
		options?: GetTokenSilentlyOptions | undefined
	) => Promise<any> | undefined
	getTokenWithPopup: (
		options?: GetTokenWithPopupOptions | undefined,
		config?: PopupConfigOptions | undefined
	) => Promise<string> | undefined
	logout: (options?: LogoutOptions | undefined) => void | undefined
}
export const Auth0Context = React.createContext<IAuth0Context>({
	isAuthenticated: false,
	user: null,
	loading: false,
	popupOpen: false,
	loginWithPopup: async () => {},
	handleRedirectCallback: async () => {},
	getIdTokenClaims: () => undefined,
	loginWithRedirect: () => undefined,
	getTokenSilently: () => undefined,
	getTokenWithPopup: () => undefined,
	logout: () => {},
})
export const useAuth0 = () => useContext(Auth0Context)
interface Auth0ProviderProps extends Auth0ClientOptions {
	onRedirectCallback: (appState?: any) => void
}
export const Auth0Provider: FC<Auth0ProviderProps> = ({
	children,
	onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
	...initOptions
}) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
	const [user, setUser] = useState<unknown>()
	const [auth0Client, setAuth0] = useState<Auth0Client>()
	const [loading, setLoading] = useState(true)
	const [popupOpen, setPopupOpen] = useState(false)

	useEffect(() => {
		const initAuth0 = async () => {
			const auth0FromHook = await createAuth0Client(initOptions)
			setAuth0(auth0FromHook)

			if (
				window.location.search.includes('code=') &&
				window.location.search.includes('state=')
			) {
				const { appState } = await auth0FromHook.handleRedirectCallback()
				onRedirectCallback(appState)
			}

			const isAuthenticated = await auth0FromHook.isAuthenticated()

			setIsAuthenticated(isAuthenticated)

			if (isAuthenticated) {
				const user = await auth0FromHook.getUser()
				setUser(user)
			}

			setLoading(false)
		}
		initAuth0()
		// eslint-disable-next-line
	}, [])

	const loginWithPopup = async (params = {}) => {
		setPopupOpen(true)
		try {
			await auth0Client?.loginWithPopup(params)
		} catch (error) {
			console.error(error)
		} finally {
			setPopupOpen(false)
		}
		const user = await auth0Client?.getUser()
		setUser(user)
		setIsAuthenticated(true)
	}

	const handleRedirectCallback = async () => {
		setLoading(true)
		await auth0Client?.handleRedirectCallback()
		const user = await auth0Client?.getUser()
		setLoading(false)
		setIsAuthenticated(true)
		setUser(user)
	}
	return (
		<Auth0Context.Provider
			value={{
				isAuthenticated,
				user,
				loading,
				popupOpen,
				loginWithPopup,
				handleRedirectCallback,
				getIdTokenClaims: (options?: GetIdTokenClaimsOptions) =>
					auth0Client?.getIdTokenClaims(options),
				loginWithRedirect: (options?: RedirectLoginOptions) =>
					auth0Client?.loginWithRedirect(options),
				getTokenSilently: (options?: GetTokenSilentlyOptions) =>
					auth0Client?.getTokenSilently(options),
				getTokenWithPopup: (
					options?: GetTokenWithPopupOptions,
					config?: PopupConfigOptions
				) => auth0Client?.getTokenWithPopup(options, config),
				logout: (options?: LogoutOptions) => auth0Client?.logout(options),
			}}
		>
			{children}
		</Auth0Context.Provider>
	)
}
