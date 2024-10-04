import { useEffect, useState } from 'react'

import { FieldProps } from '@rjsf/utils'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { open, OpenDialogOptions } from '@tauri-apps/api/dialog'

import { FormButton } from '../../styledComponents/button'

type SelectPathFieldProps = {
  fieldProps: FieldProps<string>
  buttonLabel: string
  openDialogOptions: OpenDialogOptions
}

const SelectPathField = ({ fieldProps, buttonLabel, openDialogOptions }: SelectPathFieldProps) => {
  const [path, setPath] = useState('')

  const handleClick = async () => {
    const selected = await open({ ...openDialogOptions, multiple: false })

    if (typeof selected === 'string') {
      setPath(selected)
    }
  }

  useEffect(() => {
    fieldProps.onChange(path)
  }, [path, fieldProps.onChange])

  return (
    <Box display='flex'>
      <Box sx={{ flexGrow: 1 }}>
        <TextField value={path} label={fieldProps.schema.title || fieldProps.name} fullWidth />
      </Box>
      <FormButton variant='contained' onClick={handleClick}>
        {buttonLabel}
      </FormButton>
    </Box>
  )
}

export const SelectFolderField = (props: FieldProps) => (
  <SelectPathField
    fieldProps={props}
    openDialogOptions={{ directory: true }}
    buttonLabel='Select Folder'
  />
)

export const SelectJsonField = (props: FieldProps) => (
  <SelectPathField
    fieldProps={props}
    openDialogOptions={{
      directory: false,
      filters: [
        {
          name: 'Json',
          extensions: ['json'],
        },
      ],
    }}
    buttonLabel='Select File'
  />
)
