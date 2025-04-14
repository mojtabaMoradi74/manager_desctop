import Decimal from 'decimal.js'

export default function calcDiscountNumber(firstPrice, secondPrice) {
  if (!firstPrice || firstPrice <= 0) return 0
  return new Decimal(firstPrice).minus(secondPrice).div(firstPrice).mul(100).toNumber()
}

// export default function calcDiscountNumber(firstPrice, secondPrice) {
//   return ((firstPrice - secondPrice) / firstPrice) * 100;
// }

console.log({calcDiscountNumber: calcDiscountNumber(100, 10)})
