import { redirects } from 'utility/constant';
import { useHistory } from 'react-router-dom';

export const useGetRedirectPath = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const redirectParam = urlParams.get('redirect');
  const history = useHistory();
  let redirectPath = '';

  if (!!redirectParam) {
    const redirectConfig = redirects.find((r) => redirectParam?.includes?.(r.key));

    if (redirectConfig.withId) {
      const v = redirectParam?.split?.('-');
      const id = v?.[v?.length - 1];

      const finalPath = redirectConfig.path.replace('#', id);

      redirectPath = finalPath;
    }
  }

  const redirect = (defaultPath) => {
    history.push(redirectPath || defaultPath);
  };

  return { redirectPath, redirect };
};
