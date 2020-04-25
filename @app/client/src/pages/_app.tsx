import { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import { Auth0Provider } from '../lib/react-auth0-spa'
import theme from '../../theme'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()
	// router.repl
	return (
		<Auth0Provider
			onRedirectCallback={(appState) => console.log(appState)}
			domain="cathychat.auth0.com"
			client_id="9U6VqmclxWgAjENgSBJsBnZGlo9RkVWD"
			// auth0_audience_domain="cathychat.auth0.com"
			// auth0_params={{}}
		>
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</Auth0Provider>
	)
}
