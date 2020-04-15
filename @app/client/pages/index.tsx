import { NextPage } from 'next'
import { GetDrawingsDocument } from '../gen/graphql'
console.log(GetDrawingsDocument)

const Index: NextPage = () => {
	return <div>Hello</div>
}

Index.getInitialProps = async ({ req }) => {
	return {}
}

export default Index
