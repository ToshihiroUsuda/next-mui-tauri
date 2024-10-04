import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button } from '@mui/material'

import Layout from '../components/layout'
import { TauriFunctions } from '../components/test'

const Home: NextPage = () => {
  const router = useRouter()

  const handleClick = (e) => {
    e.preventDefault()
    router.push('/formPage')
  }
  return (
    <>
      <Layout>
        <h1>Hello World</h1>
        <TauriFunctions />
        <Button onClick={handleClick}>Form</Button>
      </Layout>
    </>
  )
}

export default Home
