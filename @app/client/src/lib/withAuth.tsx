import { FC } from 'react'
import RequireAuth from '../components/RequireAuth'

const withAuth: <T>(Component: FC<T>) => FC<T> = (Component) => (props) => (
	<RequireAuth>
		<Component {...props} />
	</RequireAuth>
)

export default withAuth
