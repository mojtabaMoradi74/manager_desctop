const FormItem = ({label, children}) => {
  return (
    <div className='p-[30px] border rounded-[20px]'>
      {label ? <p className='text-[20px] font-bold capitalize'>{label}</p> : ''}
      <div className='mt-[40px]'>{children}</div>
    </div>
  )
}

export default FormItem
