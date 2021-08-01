import { Button, Table, Tag, Typography } from 'antd';
import { Dayjs } from 'dayjs';
import React from 'react';
import { useFirebaseConnect } from 'react-redux-firebase';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

import { useEvents } from '../../../hooks/events';
import { URL_ADMIN_CREATE_EVENT, URL_ADMIN_EVENT_DETAIL } from '../../../urls';

export const AdminEventListPage = () => {
  const history = useHistory();

  useFirebaseConnect([{ path: 'events', queryParams: [] }]); // TODO: sorting
  const { events: eventsAsArray, isLoaded } = useEvents(true);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => <Tag color="black">{text}</Tag>,
    },
    {
      title: 'Start',
      dataIndex: 'startsAt',
      key: 'startsAt',
      render: (date: Dayjs) => date.format('YYYY.MM.DD HH:mm:ss'),
    },
    {
      title: 'Finish',
      dataIndex: 'finishesAt',
      key: 'finishesAt',
      render: (date: Dayjs) => date.format('YYYY.MM.DD HH:mm:ss'),
    },
    {
      title: 'Winners Announced',
      dataIndex: 'announcedAt',
      key: 'announcedAt',
      render: (date: Dayjs) => date.format('YYYY.MM.DD HH:mm:ss'),
    },
  ];

  console.log('isLoaded', isLoaded);

  return (
    <div>
      <Typography.Title level={1}>Your Events</Typography.Title>

      <Table
        dataSource={eventsAsArray || []}
        columns={columns}
        pagination={false}
        loading={!isLoaded}
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(URL_ADMIN_EVENT_DETAIL.replace(':eventId', record.id));
            }, // click row
          };
        }}
      />
      <Link to={URL_ADMIN_CREATE_EVENT}>
        <Button type="primary" size="large" style={{ marginTop: 24 }}>
          Create new event
        </Button>
      </Link>
    </div>
  );
};

export default AdminEventListPage;
