import React, { useEffect } from 'react';
import { useAppDispatch } from '../../../redux/store';
import { getGiftCards } from '../../../redux/blinksky';
import { EditEventForm } from '../../../components/EditEventForm';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { URL_ADMIN, URL_ADMIN_EVENT_DETAIL } from '../../../urls';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageTitle } from '../../../components/Header';

export const AdminCreateEventPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getGiftCards());
  }, []);

  return (
    <div>
      <PageTitle title="Create New Event" />
      <Link to={URL_ADMIN}>
        <ArrowLeftOutlined style={{ fontSize: 34, marginBottom: 24 }} />
      </Link>
      <Typography.Title level={1}>Create New Event</Typography.Title>
      <EditEventForm />
    </div>
  );
};

export default AdminCreateEventPage;
