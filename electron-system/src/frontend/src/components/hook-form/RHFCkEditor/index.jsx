import PropTypes from 'prop-types'
// form
import {useFormContext, Controller} from 'react-hook-form'
// @mui
import {IconButton, InputAdornment, TextField} from '@mui/material'
import {separateNumberWithComma} from '../../../utils/index'
import persianToEnglishNumber from '../../../utils/persianToEnglishNumber'
import Iconify from '../../Iconify'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditorCustom from 'src/utils/ClassicEditorCustom'
import MyUploadAdapterPlugin from './MyUploadAdapter'

// ----------------------------------------------------------------------

RHFCkEditor.propTypes = {
  name: PropTypes.string,
}

export default function RHFCkEditor({name, type, min, max, label, required, ...other}) {
  const {control} = useFormContext()
  const {t} = useTranslation()

  const isNumber = type === 'number'
  if (isNumber) type = 'string'

  const isPassword = type === 'password'

  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange: change, value}}) => {
        function handleChange(params) {
          change(params)
        }

        // return <CKEditorTest />
        return (
         <CKEditor
            editor={ClassicEditorCustom}
            placeholder={other.placeholder}
            data={value || ``}
            config={{
              language: 'fa',
              extraAllowedContent: '*{*}; *[*];',
              allowedContent: true,
            }}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log('* * * CKEditor :', {editor})
              editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                console.log('* * * CKEditor :', {loader})
                return MyUploadAdapterPlugin(loader)
              }
            }}
            onChange={(event, editor) => {
              const data = editor.getData()
              const images = Array.from(editor.editing.view.document.getRoot().getChildren())

              console.log('* * * CKEditor :', {event, editor, data,images})

              handleChange(data)
            }}
            // onBlur={(event, editor) => {
            //   console.log('* * * CKEditor :', 'Blur.', {editor})
            // }}
            // onFocus={(event, editor) => {
            //   console.log('* * * CKEditor :', 'Focus.', {editor})
            // }}
            // onError={(err, details) => {
            //   console.log('* * * CKEditor :', {err, details})
            // }}
          />
        )
      }}
    />
  )
}
