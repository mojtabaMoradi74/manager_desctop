import {useState, useEffect} from 'react'
import axios from 'axios'
import {baseUrl} from 'utility/constant'

const API_URL = baseUrl

const URL = `${API_URL}/manager/diamond-type`
const SELECTOR_URL = `${API_URL}/fc/manager/card-type/selector`

const Get = (id) => axios.get(`${URL}/${id}`)
const Add = (data) => axios.post(URL, data)
const Edit = (data) => axios.put(URL, data)
const GetAll = (params = {}) => axios.get(`${URL}`, {params})
const RemoveById = (id) => axios.delete(`${URL}/${id}`)
const Selector = (params = {}) => axios.get(`${SELECTOR_URL}`, {params})

const GET_TYPE_LOOKUP = async () => {
  try {
    const res = await GetAll()

    const lookup = {}
    res?.data?.data?.data?.forEach?.((t) => (lookup[t?._id] = t?.name))

    return lookup
  } catch {
    return {}
  }
}

export {Get, RemoveById, Add, Edit, GetAll, Selector, GET_TYPE_LOOKUP}

export const useGetCardTypeLookup = () => {
  const [typesLookup, setTypeslookup] = useState({})

  useEffect(() => {
    const getTypes = async () => {
      const types = await GET_TYPE_LOOKUP()
      setTypeslookup(types)
    }

    getTypes()
  }, [])

  return typesLookup
}
