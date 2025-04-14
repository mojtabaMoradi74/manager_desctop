/* eslint-disable */

import Decimal from 'decimal.js'
import {toast} from 'react-toastify'

export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  if (!value) {
    return undefined
  } else {
    return JSON.parse(value)
  }
}
export const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
export const clearLocalStorage = (key) => {
  localStorage.removeItem(key)
}

export const copyText = (text) => {
  try {
    navigator.clipboard.writeText(text)
  } catch (error) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)

    textarea.select()
    textarea.setSelectionRange(0, 99999)

    document.execCommand('copy')

    document.body.removeChild(textarea)
  }

  // toast.info("Copied!");
}

export const handleSendMessageByEnter = (e, callback) => {
  if (e.key === 'Enter') {
    callback()
  }
}
export function percentage(a, b) {
  return new Decimal(a).mul(b).div(100) || 0
}
export function calcPercentNumber(a, b) {
  return (a / (a + b)) * 100 || 0
}
export const shortenAddress = (address, prefixLength = 6, suffixLength = 6) => {
  if (!address || address.length < prefixLength + suffixLength) {
    return address
  }
  const prefix = address.slice(0, prefixLength)
  const suffix = address.slice(-suffixLength)
  return `${prefix}....${suffix}`
}

export const chainIdFormat = (n) => `0x${Number(n).toString(16)}`

export const changePriceFormatAfterZero = (v, f = 2) => {
  // console.log({ v, f });
  if (!!!v) return 0
  let decimalSplit = String(v).split('.')
  // let n = Math.floor(Math.log(decimalSplit[1]) / Math.LN10);
  let n = -Math.floor(Math.log(decimalSplit[1]) / Math.log(10) + 1)
  // console.log({ n, v, decimalSplit }, Math.LN10, Math.log(v), ((n) + decimalSplit[1]?.length) + f);
  if (decimalSplit[1]?.length) {
    return decimalSplit[0] + '.' + decimalSplit[1].substring(0, n + decimalSplit[1]?.length + f)
  } else return decimalSplit[0]
}
// export { getLocalStorage, setLocalStorage, clearLocalStorage };
export const numberWithComma = (number, free, decimal = 5) => {
  if (!number) return 0
  number = String(number) || '0'
  let [int, dec] = number.toString().split('.')
  // console.log("* * * numberWithComma : ", { int, dec });
  int = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return dec || dec === ''
    ? free
      ? `${int}.${dec}`
      : `${int}.${dec.substring(0, dec + dec?.length + decimal)}`
    : int
}

export const baseImagePath = (image, defaultImage = '/cardImage.png') =>
  image?.location ? import.meta.env.VITE_IMAGE_URL + image.location : defaultImage
