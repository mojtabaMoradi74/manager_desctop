import {decodeToken} from 'react-jwt'

// export const decode = token => {
//     return jwt.decode(token, { complete: true });
// };

export const decodedToken = (token) => {
  const tokenDecoded = decodeToken(token)
  console.log({tokenDecoded})
  return tokenDecoded
  // .payload.exp
}

export function tokenMsAge(token) {
  const dateNow = Date.now() / 1000
  let second = 0
  const expTime = decodedToken(token)?.exp
  if (expTime) second = Math.floor(expTime - dateNow)

  console.log({expTime, token})
  return {
    s: second,
    ms: second * 1000,
    expTime: expTime * 1000,
  }
}

export const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
    // axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    // This function below will handle when token is expired
    // const { exp } = jwtDecode(accessToken);
    // handleTokenExpired(exp);
  } else {
    localStorage.removeItem('accessToken')
    // delete axios.defaults.headers.common.Authorization
  }
}
