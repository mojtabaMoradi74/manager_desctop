import PropTypes from 'prop-types'
// form
import {FormProvider as Form} from 'react-hook-form'

// ----------------------------------------------------------------------

FormProvider.propTypes = {
  children: PropTypes.node.isRequired,
  methods: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
}

export default function FormProvider({children, onSubmit, methods, ...props}) {
  const handleInnerFormSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation() // Prevent the event from bubbling up to the outer form
    onSubmit(e)
  }
  return (
    <Form {...methods}>
      <form onSubmit={handleInnerFormSubmit} {...props}>
        {children}
      </form>
    </Form>
  )
}
