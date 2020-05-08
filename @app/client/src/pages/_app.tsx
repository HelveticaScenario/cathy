import React from 'react'
import { AppProps } from 'next/app'
import { ThemeProvider } from 'theme-ui'
import theme from '../../theme'

import './style-index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<ThemeProvider theme={theme}>
				<Component {...pageProps} />
			</ThemeProvider>
		</>
	)
}
