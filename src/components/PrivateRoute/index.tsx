import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { Redirect, Route } from 'react-router-dom';

import { RootState } from '../../redux/reducers';
import { URL_ADMIN_LOGIN } from '../../urls';
import { SpinnerOverlay } from '../SpinnerOverlay';

export default function PrivateRoute({ children, ...rest }: any) {
  const auth = useSelector((state: RootState) => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <SpinnerOverlay spinning />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoaded(auth) && !isEmpty(auth) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: URL_ADMIN_LOGIN,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
