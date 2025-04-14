/* eslint-disable array-callback-return */
/* eslint-disable dot-notation */

export const NUM_REGEX = /\D/g

export const YES_NO_OPTIONS = [
  {
    label: 'خیر',
    value: 0,
  },
  {
    label: 'بله',
    value: 1,
  },
]

// export const separateNumberWithComma = (myNumber) => {
//   if (!myNumber && myNumber !== 0) return;

//   return myNumber
//     .toString()
//     .replace(/\D/g, '')
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// };

export const separateNumberWithComma = (myNumber) => {
  if (myNumber === null || myNumber === undefined) return

  const [integerPart, decimalPart] = myNumber.toString().split('.')

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger + (myNumber.toString().endsWith('.') ? '.' : '')
}

export const handleGenerateLink = (link) => {
  if (link) {
    if (link?.search('https://') === -1 || link?.search('http://') === -1) {
      return link?.split('www.')[1] || link
    }
    return new URL(link || '').hostname?.split('www.')[1] || new URL(link).hostname
  }

  return ''
}

export const setClientMode = (isClient) => {
  if (isClient) {
    localStorage.setItem('isClient', isClient)
  } else {
    localStorage.removeItem('isClient')
  }
}

export const getClientMode = () => {
  return localStorage.getItem('isClient')
}

export const isAuthenticated = () => {
  const token = window.localStorage.getItem('accessToken')
  if (token) {
    return true
  }
  return false
}

export const logoutUser = () => {
  localStorage.removeItem('accessToken')
  //   setClientMode();
}

export const generateErrorArray = (error) => {
  const errorArr = []

  if (error.response) {
    const myObject = error.response.data['errors']
    if (myObject) {
      Object.keys(myObject).map((key) => {
        const text = myObject[key][0]
        errorArr.push(text)
      })
    } else {
      errorArr.push(error.response.data['message'])
    }
  } else {
    errorArr.push('Error !!')
  }

  return errorArr
}

export const downloadFileFromAxios = (responseData, title = '') => {
  // create file link in browser's memory
  // const href = URL.createObjectURL(responseData);
  const href = window.URL.createObjectURL(new Blob([responseData]))

  // create "a" HTML element with href to file & click
  const link = document.createElement('a')
  link.href = href
  link.setAttribute('download', `${title}.xlsx`) // or any other extension
  document.body.appendChild(link)
  link.click()

  // clean up "a" element & remove ObjectURL
  document.body.removeChild(link)
  URL.revokeObjectURL(href)
}
