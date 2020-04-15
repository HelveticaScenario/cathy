import { NextPage } from 'next'
import { GetDrawingsDocument } from '../gen/graphql'
console.log(GetDrawingsDocument)

const Index: NextPage = () => {
	return <div>It works</div>
}

Index.getInitialProps = async ({ req }) => {
	return {}
}

export default Index
