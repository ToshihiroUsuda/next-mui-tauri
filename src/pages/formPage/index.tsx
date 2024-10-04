import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import Layout from '../../components/layout'
import { FormComponent } from './form'

import { Button } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

const FormPage: NextPage = () => {
  const router = useRouter()
  return (
    <>
      <Layout>
        <h1>Form</h1>
        <FormComponent />
        <Button
          onClick={() => {
            router.back()
          }}
        >
          <ArrowBack />
          Back
        </Button>
      </Layout>
    </>
  )
}

export default FormPage
