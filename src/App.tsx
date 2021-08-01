import './App.css';
import './styles/index.less';
import './index.less';

import { ConfigProvider } from 'antd';
import enUs from 'antd/lib/locale/en_US';
import React from 'react';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import LanguageProvider from './components/LanguageProvider';
import PrivateRoute from './components/PrivateRoute';
import AdminPages from './pages/AdminPages';
import AdminLoginPage from './pages/AdminPages/AdminLoginPage';
import AdminSignupPage from './pages/AdminPages/AdminSignupPage';
import EventDetailPage from './pages/EventDetailPage';
import LandingPage from './pages/LandingPage';
import { rrfProps, store } from './redux/store';
import {
  URL_ADMIN,
  URL_ADMIN_LOGIN,
  URL_ADMIN_SIGNUP,
  URL_EVENT_DETAIL,
  URL_LANDING,
} from './urls';

function App() {
  return (
    <ConfigProvider locale={enUs}>
      <Provider store={store}>
        <LanguageProvider>
          <ReactReduxFirebaseProvider {...rrfProps}>
            <Header />
            <BrowserRouter>
              <Switch>
                <Route path={URL_LANDING} exact>
                  <LandingPage />
                </Route>
                <Route path={URL_EVENT_DETAIL}>
                  <EventDetailPage />
                </Route>
                <Route path={URL_ADMIN_LOGIN}>
                  <AdminLoginPage />
                </Route>
                <Route path={URL_ADMIN_SIGNUP}>
                  <AdminSignupPage />
                </Route>
                <PrivateRoute path={URL_ADMIN}>
                  <AdminPages />
                </PrivateRoute>
                <Redirect to={URL_LANDING} />
              </Switch>
            </BrowserRouter>
          </ReactReduxFirebaseProvider>
        </LanguageProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
