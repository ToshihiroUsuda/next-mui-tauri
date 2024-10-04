import React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'
import { FlexBox } from './flexBox'

export const FormButton = (props: ButtonProps) => {
  return (
    <FlexBox alignItems={'center'}>
      <Button sx={{ height: 52, mx: 0.5 }} {...props} />
    </FlexBox>
  )
}
