export default function maskPhoneNumber(phoneNumber) {
  return phoneNumber.replace(/^(\d{4})\d{5}(\d{2})$/, '$1xxxxx$2');
}

//   function maskPhoneNumber(phoneNumber) {
//     return phoneNumber.slice(0, 4) + 'xxxxx' + phoneNumber.slice(9);
//   }
