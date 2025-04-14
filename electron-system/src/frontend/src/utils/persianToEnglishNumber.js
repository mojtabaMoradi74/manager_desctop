export default function persianToEnglishNumber(persianNumber) {
  try {
    const valid = typeof persianNumber === 'string' || typeof persianNumber === 'number';
    if (!valid) return persianNumber;
    persianNumber = String(persianNumber);
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const englishDigits = '0123456789';
    let englishNumber = '';

    for (const char of persianNumber) {
      const index = persianDigits.indexOf(char);
      if (index !== -1) {
        englishNumber += englishDigits[index];
      } else {
        englishNumber += char;
      }
    }

    return englishNumber;
  } catch (error) {
    console.log({ error, persianNumber });
    return persianNumber;
  }
}
