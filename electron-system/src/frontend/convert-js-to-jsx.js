// const fs = require('fs')
// const path = require('path')

// const directory = './src' // یا هر دایرکتوری که در آن پروژه قرار داره

// // تابعی برای چک کردن اینکه محتوای فایل از JSX استفاده میکنه
// function isJSX(content) {
//   return /<[^>]+>/.test(content) // بررسی برای وجود تگ‌های JSX مثل <div> و ...
// }

// // تابع برای پیمایش در دایرکتوری‌ها
// function walk(dir) {
//   fs.readdirSync(dir).forEach((file) => {
//     const fullPath = path.join(dir, file)
//     const stat = fs.statSync(fullPath)

//     // اگر فایل دایرکتوری بود، وارد دایرکتوری بشه
//     if (stat.isDirectory()) {
//       walk(fullPath)
//     } else if (path.extname(fullPath) === '.js') {
//       const content = fs.readFileSync(fullPath, 'utf8')

//       // اگر فایل شامل JSX بود، پسوندش رو به .jsx تغییر بده
//       if (isJSX(content)) {
//         const newPath = fullPath.replace(/\.js$/, '.jsx')
//         fs.renameSync(fullPath, newPath)
//         console.log(`Renamed: ${fullPath} -> ${newPath}`)
//       }
//     }
//   })
// }

// // شروع پیمایش از دایرکتوری src
// walk(directory)
// // node convert-js-to-jsx.js
