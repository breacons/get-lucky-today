import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import {
  URL_ADMIN_CREATE_EVENT,
  URL_ADMIN_EDIT_EVENT_DETAIL,
  URL_ADMIN_EVENT_DETAIL,
  URL_ADMIN_EVENT_LIST,
  URL_ADMIN_PROFILE,
} from '../../urls';
import AdminEventListPage from './AdminEventListPage';
import AdminEventDetailPage from './AdminEventDetailPage';
import AdminProfilePage from './AdminProfilePage';
import AdminEditEventPage from './AdminEditEventPage';
import AdminCreateEventPage from './AdminCreateEventPage';
import { LandingLayout } from '../../components/Layout';
import { PageTitle } from '../../components/Header';

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
