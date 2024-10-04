import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'

export const FlexBox = styled(Box)({
  display: 'flex',
})

export const Column = styled(FlexBox)({
  flexDirection: 'column',
})

export const Row = styled(FlexBox)({
  flexDirection: 'row',
})
