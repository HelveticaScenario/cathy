// Import FirebaseAuth and firebase.
import React, { FC } from 'react'
import Link from 'next/link'

const SignInScreen: FC<{}> = () => {
	return (
		<div>
			<Link href="/">
				<a>Home</a>
			</Link>
			<h1>My App</h1>
			<p>Please sign-in:</p>
		</div>
	)
}

export default SignInScreen
