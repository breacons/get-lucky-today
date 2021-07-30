import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import { rootReducer } from './reducers';

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { actionTypes } from 'react-redux-firebase';
import { fbConfig } from '../config';

const rrfConfig = {
  userProfile: 'users',
};

// Initialize firebase instance
firebase.initializeApp(fbConfig);

const initialState = {};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [actionTypes.LOGIN],
      },
    }),
  // middleware: getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //   },
  // }),
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
};
