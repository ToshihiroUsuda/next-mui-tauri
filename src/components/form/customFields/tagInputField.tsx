import { useEffect, useState } from 'react'

import { FieldProps } from '@rjsf/utils'

import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircleIcon from '@mui/icons-material/Circle'
import Dialog from '@mui/material/Dialog'

import Form from '@rjsf/mui'
import { RJSFSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

import { TTag } from '../../../types'
import { Row } from '../../styledComponents/flexBox'
import { Box } from '@mui/material'

const ColorCode = {
  '#ff0000': 'Red',
  '#00ff00': 'Green',
  '#0000ff': 'Blue',
  '#000000': 'Black',
}

const schema: RJSFSchema = {
  title: 'Tag',
  type: 'object',
  properties: {
    name: {
      title: 'Name',
      type: 'string',
    },
    color: {
      type: 'string',
      title: 'Color',
      anyOf: Object.keys(ColorCode).map((key) => {
        return { type: 'string', title: ColorCode[key], enum: [key] }
      }),
    },
  },
  required: ['name', 'color'],
}

const TextFieldStyled = styled(TextField)((props) => {
  return `
    max-width: 100%;

    .MuiInputBase-root {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      row-gap: 5px;
      padding-top: ${props.size === 'small' ? '5px' : '9px'};
      padding-right: ${props.InputProps?.endAdornment ? '30px' : '9px'};
      padding-bottom: ${props.size === 'small' ? '5px' : '9px'};
      padding-left: 10px;

      input {
        min-width: 30px;
        width: auto;
        flex-grow: 1;
        text-overflow: ellipsis;
        padding: ${props.size === 'small' ? '3.5px 4px' : '7.5px 4px'};
        align-self: center;
      }
    }
  `
})

type TagChipProps = {
  tag: TTag
  onDelete: () => void
  onTagChange: (tag: TTag) => void
}

const TagChip = ({ tag, onDelete, onTagChange }: TagChipProps) => {
  const [open, setOpen] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    if ((e.ctrlKey && !e.metaKey) || (!e.ctrlKey && e.metaKey)) {
      setOpen(true)
    }
  }
  return (
    <>
      <Chip
        label={tag.name}
        variant='filled'
        onDelete={() => {
          onDelete()
        }}
        onClick={handleClick}
        sx={{ mr: 0.5 }}
        icon={<CircleIcon sx={{ fill: tag.color }} />}
      />
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <Box padding={2} width={480}>
          <Form
            formData={tag}
            schema={schema}
            validator={validator}
            onSubmit={(e) => {
              setOpen(false)
              onTagChange(e.formData)
            }}
            onError={(e) => {
              console.log(e)
            }}
            // liveValidate
          >
            <Row>
              <Button color='success' type='submit'>
                Save
              </Button>
              <Button
                color='error'
                onClick={() => {
                  setOpen(false)
                }}
              >
                cancel
              </Button>
            </Row>
          </Form>
        </Box>
      </Dialog>
    </>
  )
}

export const TagInputField = (props: FieldProps<TTag[]>) => {
  const [tags, setTags] = useState<TTag[]>(props.formData)
  const [text, setText] = useState('')

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.key === 'Enter' && text !== '' && tags.filter((t) => t.name === text).length === 0) {
      setTags([...tags, { name: text, color: '#000000' }])
      setText('')
    }
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setText(e.target.value)
  }

  const handleValueDelete = (tagName: string) => {
    setTags(tags.filter((t) => t.name !== tagName))
  }

  useEffect(() => {
    props.onChange(tags)
  }, [tags, props.onChange])

  return (
    <TextFieldStyled
      label={props.schema.title || props.name}
      fullWidth
      onKeyUp={handleEnter}
      value={text}
      placeholder={'Type and Press ENTER'}
      onChange={handleValueChange}
      InputProps={{
        startAdornment:
          tags.length === 0 ? null : (
            <>
              {tags.map((tag, index) => {
                return (
                  <TagChip
                    key={index}
                    tag={tag}
                    onDelete={() => {
                      handleValueDelete(tag.name)
                    }}
                    onTagChange={(tag: TTag) => {
                      const newTags = tags.map((t, i) => {
                        return i == index ? tag : t
                      })
                      setTags(newTags)
                    }}
                  />
                )
              })}
            </>
          ),
      }}
    />
  )
}
