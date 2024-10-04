import React from 'react'

import { useAtom } from 'jotai'

import Box from '@mui/material/Box'

import Form from '@rjsf/mui'
import { FormProps } from '@rjsf/core'
import { RJSFSchema, UiSchema, RegistryFieldsType } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

import {
  SelectFolderField,
  SelectJsonField,
} from '../../components/form/customFields/selectPathField'

import { TagInputField } from '../../components/form/customFields/tagInputField'

import { Row } from '../../components/styledComponents/flexBox'
import { FormButton } from '../../components/styledComponents/button'
import { TAppSettings } from '../../types'
import { appSettingsAtom } from '../../atom'

const schema: RJSFSchema = {
  // title: 'Test form',
  type: 'object',
  properties: {
    name: {
      title: 'なまえ',
      type: 'string',
    },
    age: {
      title: '年齢',
      type: 'number',
      minimum: 18,
    },
    folder: {
      title: 'フォルダ',
      type: 'string',
    },
    jsonFile: {
      title: '設定ファイル',
      type: 'string',
    },
    date: {
      type: 'string',
      format: 'date',
    },
    tags: {
      title: 'タグ',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          color: {
            type: 'string',
          },
        },
      },
    },
  },
  required: ['name', 'age'],
}

const uiSchema: UiSchema = {
  folder: {
    'ui:field': 'folderSelector',
  },
  jsonFile: {
    'ui:field': 'jsonSelector',
  },
  tags: {
    'ui:field': 'tagInput',
  },
}
const fields: RegistryFieldsType = {
  folderSelector: SelectFolderField,
  jsonSelector: SelectJsonField,
  tagInput: TagInputField,
}

export const FormComponent = () => {
  const [appSettings, setAppSettings] = useAtom(appSettingsAtom)
  console.log(appSettings)

  return (
    <Box padding={2} maxWidth={640}>
      <Form
        formData={appSettings}
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        fields={fields}
        onChange={(e) => {
          // console.log(e.formData)
        }}
        onSubmit={(e) => {
          setAppSettings(e.formData)
          console.log('submit', e.formData)
        }}
        onError={(e) => {
          console.log(e)
        }}
        // liveValidate
      >
        <Row>
          <FormButton variant='contained' color='success' type='submit'>
            Save Settings
          </FormButton>
        </Row>
      </Form>
    </Box>
  )
}
