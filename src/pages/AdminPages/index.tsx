import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { PageTitle } from '../../components/Header';
import { LandingLayout } from '../../components/Layout';
import {
  URL_ADMIN_CREATE_EVENT,
  URL_ADMIN_EDIT_EVENT_DETAIL,
  URL_ADMIN_EVENT_DETAIL,
  URL_ADMIN_EVENT_LIST,
  URL_ADMIN_PROFILE,
} from '../../urls';
import AdminCreateEventPage from './AdminCreateEventPage';
import AdminEditEventPage from './AdminEditEventPage';
import AdminEventDetailPage from './AdminEventDetailPage';
import AdminEventListPage from './AdminEventListPage';
import AdminProfilePage from './AdminProfilePage';

export const AdminPages = () => {
  return (
    <LandingLayout>
      <PageTitle title="Organisers" />
      <Switch>
        <Route path={URL_ADMIN_EVENT_LIST} exact>
          <AdminEventListPage />
        </Route>
        <Route path={URL_ADMIN_CREATE_EVENT}>
          <AdminCreateEventPage />
        </Route>
        <Route path={URL_ADMIN_EDIT_EVENT_DETAIL}>
          <AdminEditEventPage />
        </Route>
        <Route path={URL_ADMIN_EVENT_DETAIL}>
          <AdminEventDetailPage />
        </Route>
        <Route path={URL_ADMIN_PROFILE}>
          <AdminProfilePage />
        </Route>
        <Redirect to={URL_ADMIN_EVENT_LIST} />
      </Switch>
    </LandingLayout>
  );
};

export default AdminPages;
