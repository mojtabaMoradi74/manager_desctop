function createQueryString(params) {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value) => searchParams.append(`${key}[]`, value));
    } else {
      searchParams.append(key, params[key]);
    }
  }

  return searchParams;
}
export default createQueryString;
