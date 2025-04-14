import {useLocation} from 'react-router-dom'

const useQueryString = ({limit = 10, page = 1, ...other} = '') => {
  let queryStrings = {limit, page, ...other}
  const location = useLocation()

  function decode(s) {
    const pl = /\+/g
    return decodeURIComponent(s.replace(pl, ' '))
  }

  ;(window.onpopstate = function () {
    const search = /([^&=]+)=?([^&]*)/g
    const query = location.search.substring(1)
    console.log({query})
    let match
    queryStrings = {...queryStrings}

    while (true) {
      match = search.exec(query)
      if (!match) break

      const key = decode(match[1])
      const value = decode(match[2])

      if (key.endsWith('[]')) {
        const baseKey = key.slice(0, -2)
        if (!Array.isArray(queryStrings[baseKey])) {
          queryStrings[baseKey] = []
        }
        queryStrings[baseKey].push(value)
      } else {
        queryStrings[key] = value
      }
    }
  })()

  return {...queryStrings}
}

export default useQueryString
