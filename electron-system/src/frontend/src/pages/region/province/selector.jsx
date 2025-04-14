import {useEffect, useState, useMemo} from 'react'
import useDebounce from '../../../hooks/useDebounce'
import Enum from './enum'
import axiosInstance from '../../../utils/axios'
import {useQueryCustom} from '../../../utils/reactQueryHooks'
import RemoveNullObjectValue from '../../../utils/RemoveNullObjectValue'
import RHFSelector from '../../../components/hook-form/RHFSelector'

const convertor = {
  object: (x) =>
    x && {
      label: x?.title,
      // <div className="flex gap-3 items-center">
      // 	<img
      // 		className="rounded-full object-cover h-[45px] w-[45px] border border-primary-main"
      // 		src={import.meta.env.VITE_IMAGE_URL + x.image?.[0]?.location}
      // 	/>

      // 	<span>{x.name}</span>
      // </div>
      value: x?.id,
      image: x?.image,
      data: x,
    },
  array: (x) => x?.map(convertor.object),
}

const Element = ({queryParams, ...props}) => {
  // ----------------------------------------------------------------

  const [apiParams, setApiParams] = useState({
    page: 1,
    limit: 20,
    search: '',
  })

  const {debounce} = useDebounce({setDebounce: (x) => setApiParams((p) => ({...p, search: x}))})
  // ----------------------------------------------------------------

  const getApi = async ({queryKey}) => {
    const [_, params] = queryKey || []
    return axiosInstance().get(`${Enum?.api?.base}`, {params: RemoveNullObjectValue(params)})
  }

  const resQuery = useQueryCustom({
    name: `${Enum?.api?.base}`,
    url: getApi,
    params: apiParams,
  })

  // ----------------------------------------------------------------

  const inputProps = {
    onChange: (e) => debounce(e.target.value),
  }

  const options = useMemo(() => {
    return convertor.array(resQuery?.data?.data?.result)
  }, [resQuery])

  // ----------------------------------------------------------------

  useEffect(() => {
    setApiParams((p) => ({...p, ...queryParams}))
  }, [queryParams])
  // ----------------------------------------------------------------
  console.log('* * * provinceSelector onSuccess : ', {resQuery, options})

  // ----------------------------------------------------------------
  return (
    <RHFSelector
      options={options}
      inputProps={inputProps}
      loading={resQuery.isLoading}
      {...props}
    />
  )
}

const provinceSelector = {
  Element,
  convertor,
}

export default provinceSelector
