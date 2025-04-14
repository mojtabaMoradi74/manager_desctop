/* eslint-disable react/no-unstable-nested-components */
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { refreshTokenSpacer } from 'src/enumeration';
import useAuth from 'src/hooks/useAuth';
import { refreshTokenThunk } from 'src/redux/slices/token';
import { getAdminProfile } from 'src/redux/slices/user';
import { getTimeRemaining } from 'src/utils/dating';
import LoadingScreen from './LoadingScreen';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

RefreshStateProvider.propTypes = {
  children: PropTypes.node,
};

export default function RefreshStateProvider({ children }) {
  const tokenState = useSelector((state) => state.token);
  const refreshToken = tokenState?.refresh;
  const accessToken = tokenState?.access;
  const { logout } = useAuth();
  const dispatch = useDispatch();

  const showComponent = useMemo(() => {
    const currentDate = +new Date();
    const valid = refreshToken
      ? accessToken?.expiresAt
        ? accessToken?.expiresAt - currentDate - refreshTokenSpacer
        : 0
      : 1;
    // if (!valid) queryClient.cancelQueries();
    return valid >= 0;
  });

  console.log('* * * RefreshTokenProvider : ', { refreshToken, accessToken, tokenState });

  useEffect(() => {
    let timeOutAccess;
    let timeOutRefresh;

    if (refreshToken && accessToken?.token) {
      const current = +new Date();
      // const eee = new Date(accessToken?.expiresAt);
      let remainingTimeRefresh = refreshToken?.expiresAt - current - refreshTokenSpacer;
      const maxTime = 2 * 24 * 60 * 60 * 1000; // 2 days
      if (remainingTimeRefresh > maxTime) remainingTimeRefresh = maxTime;
      console.log('* * * RefreshTokenMiddleware : ', {
        remainingTimeRefreshs: getTimeRemaining(remainingTimeRefresh / 1000),
        remainingTimeRefresh,
      });
      if (remainingTimeRefresh <= 0) {
        logout();
        if (timeOutAccess) clearTimeout(timeOutAccess);
      } else {
        timeOutRefresh = setTimeout(() => {
          logout();
          if (timeOutAccess) clearTimeout(timeOutAccess);
        }, remainingTimeRefresh);

        // -------------------------------- access

        if (accessToken?.token) {
          const remainingTime = accessToken?.expiresAt - current - refreshTokenSpacer; //- 120000;
          console.log('* * * RefreshTokenMiddleware : ', {
            remainingTimeAccessDate: getTimeRemaining(remainingTime / 1000),
            remainingTime,
          });
          if (remainingTime <= 0) {
            dispatch(refreshTokenThunk());
          } else
            timeOutAccess = setTimeout(() => {
              dispatch(refreshTokenThunk());
            }, remainingTime);
        } else if (refreshToken) dispatch(refreshTokenThunk());
      }
    }

    // const timeOutAccess = setTimeout(() => {
    //   dispatch(refreshTokenThunk());
    // }, 30000);

    return () => {
      if (timeOutRefresh) clearTimeout(timeOutRefresh);
      if (timeOutAccess) clearTimeout(timeOutAccess);
    };
  }, [refreshToken, accessToken]);

  if (!showComponent) {
    return <LoadingScreen />;
  }
  return children;
}
