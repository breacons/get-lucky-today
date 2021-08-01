import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { EditEventForm } from '../../../components/EditEventForm';
import { PageTitle } from '../../../components/Header';
import { getGiftCards } from '../../../redux/blinksky';
import { useAppDispatch } from '../../../redux/store';
import { URL_ADMIN } from '../../../urls';

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
