import './App.css';
import React from 'react';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { rrfProps, store } from './redux/store';
import { Provider } from 'react-redux';
import AdminLoginPage from './pages/AdminPages/AdminLoginPage';
import {
  URL_ADMIN,
  URL_ADMIN_LOGIN,
  URL_ADMIN_SIGNUP,
  URL_EVENT_DETAIL,
  URL_LANDING,
} from './urls';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AdminPages from './pages/AdminPages';
import LandingPage from './pages/LandingPage';
import EventDetailPage from './pages/EventDetailPage';
import LanguageProvider from './components/LanguageProvider';

import './styles/index.less';
import './index.less';
import AdminSignupPage from './pages/AdminPages/AdminSignupPage';
import { ConfigProvider } from 'antd';
import enUs from 'antd/lib/locale/en_US';
import Header from './components/Header';

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
