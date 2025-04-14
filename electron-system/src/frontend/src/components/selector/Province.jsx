import {useFormContext} from 'react-hook-form'
import {useEffect, useState, useMemo} from 'react'
import useDebounce from '../../hooks/useDebounce'
import RHFSelector from '../hook-form/RHFSelector'
import api from '../../services/api'
import axiosInstance from '../../utils/axios'
import {useQueryCustom} from '../../utils/reactQueryHooks'
import RemoveNullObjectValue from '../../utils/RemoveNullObjectValue'

const convertor = {
  object: (x) =>
    x && {
      label: x?.name,
      // <div className="flex gap-3 items-center">
      // 	<img
      // 		className="rounded-full object-cover h-[45px] w-[45px] border border-primary-main"
      // 		src={import.meta.env.VITE_IMAGE_URL + x.image?.[0]?.location}
      // 	/>

      // 	<span>{x.name}</span>
      // </div>
      value: x?.id,
      data: x,
    },
  array: (x) => x?.map(convertor.object),
}

const Element = ({queryParams, geById, ...props}) => {
  const {watch, setValue} = useFormContext()
  const watchData = watch(props.name)
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
    return axiosInstance().get(`${api.province.base}`, {params: RemoveNullObjectValue(params)})
  }
  const resQuery = useQueryCustom({
    name: `${api.province.base}`,
    url: getApi,
    params: apiParams,
  })
  const getByIdApi = async () => {
    return axiosInstance().get(`${api.province.byId}/${geById}`)
  }
  const resByIdQuery = useQueryCustom({
    name: `${api.province.byId}`,
    url: getByIdApi,
    params: apiParams,
    onSuccess: (resData) => {
      console.log('* * * ProvinceSelector getByIdApi :', {resData, geById})
      setValue(props.name, convertor.object(resData?.data))
    },
  })

  // ----------------------------------------------------------------

  const inputProps = {
    onChange: (e) => debounce(e.target.value),
  }

  const options = useMemo(() => {
    return convertor.array(resQuery?.data?.data?.data)
  }, [resQuery])

  // ----------------------------------------------------------------
  useEffect(() => {
    if (geById && !watchData?.value) getByIdApi()
  }, [watchData, geById])
  useEffect(() => {
    setApiParams((p) => ({...p, ...queryParams}))
  }, [queryParams])
  // ----------------------------------------------------------------
  console.log('* * * ProvinceSelector onSuccess : ', {resQuery, options})

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

const ProvinceSelector = {
  Element,
  convertor,
}

export default ProvinceSelector
