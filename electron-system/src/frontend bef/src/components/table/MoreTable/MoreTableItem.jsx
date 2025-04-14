import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {Box, MenuItem} from '@mui/material'
import {useRef} from 'react'
import ModalLayout from '../../ModalLayout'
import QuestionComponent from '../../modal/Question/index'

const questionsText = {
  delete: {
    title: 'question.delete.title',
    description: 'question.delete.description',
    button: {
      confirm: {
        label: 'question.delete.yes',
      },
      reject: {
        label: 'question.delete.no',
      },
    },
  },
}

const MoreTableItem = ({
  icon,
  label,
  isDelete,
  isEdit,
  sx,
  question,
  onClick,
  loading,
  ...props
}) => {
  const ModalLayoutRemoveInputRef = useRef()

  const handleQuestionModal = (params) => ModalLayoutRemoveInputRef.current.show((p) => !p, params)

  const handleClick = () => {
    // if (question) {
    //   handleQuestionModal(question);
    // } else if (isDelete) {
    //   const newQuestion = { ...questionsText.delete };
    //   newQuestion.button.confirm.onClick = onClick;
    //   handleQuestionModal(questionsText.delete);
    // }
  }

  return (
    <MenuItem
      sx={{
        display: 'flex',
        gap: 3,
        alignItems: 'center',
        color: 'grey.800',
        //   "&:hover":{
        //     color
        //   },
        ...sx,
      }}
      onClick={handleClick}
      {...props}
    >
      <ModalLayout ref={ModalLayoutRemoveInputRef}>
        <QuestionComponent
          {...{
            loading,
            button: {
              confirm: {
                label: 'question.accept',
                onClick: (_, data) => onClick(data),
              },
              reject: {
                label: 'question.no',
                onClick: () => handleQuestionModal(),
              },
            },
            // ...question,
            // title: t('question.delete.title'),
            // description: t('question.delete.description'),
            // button: {
            //   confirm: {
            //     label: t('question.delete.yes'),
            //     onClick: (_, data) => handleDelete(data),
            //   },
            //   reject: {
            //     label: t('question.delete.no'),
            //     onClick: () => handleQuestionModal(),
            //   },
            // },
          }}
          onClose={() => handleQuestionModal()}
        />
      </ModalLayout>
      <Box
        sx={{
          '&>svg': {
            fontSize: '18px',
          },
        }}
      >
        {isDelete ? <DeleteIcon /> : isEdit ? <EditIcon /> : icon}
      </Box>
      <Box>{isDelete ? 'Delete' : isEdit ? 'Edit' : label}</Box>
    </MenuItem>
  )
}

export default MoreTableItem
