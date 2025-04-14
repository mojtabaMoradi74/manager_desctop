/* eslint-disable */

export const convertorArrayOption = (array, object) => {
  for (const key in array) {
    if (Object.hasOwnProperty.call(array, key)) {
      const data = array[key]
      object[data.value] = data
    }
  }
}

export const convertBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  const kb = 1024
  const correctDecimals = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(kb))

  return parseFloat((bytes / Math.pow(kb, i)).toFixed(correctDecimals)) + ' ' + sizes[i]
}

export const chainIdFormat = (n) => `0x${Number(n).toString(16)}`

export const compareArray = (a, b, key) =>
  a.map((item1) => b.find((item2) => item2[key] === item1[key]))
