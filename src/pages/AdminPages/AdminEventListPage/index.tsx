import React, { useMemo } from 'react';
import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { firebaseObjectToArray, firebaseToArray } from '../../../utils/firebase-transformers';
import { Button, Table, Tag, Typography } from 'antd';
import { useHistory, useLocation } from 'react-router';
import { URL_ADMIN_CREATE_EVENT, URL_ADMIN_EVENT_DETAIL } from '../../../urls';
import { transformEvent } from '../../../utils/events';
import { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';
import _ from 'lodash-es';
import { useEvents } from '../../../hooks/events';

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

  console.log('isLoaded', isLoaded)

  return (
    <div>
      <Typography.Title level={1}>Your Events</Typography.Title>

      <Table
        dataSource={eventsAsArray || []}
        columns={columns}
        pagination={false}
        loading={!isLoaded}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              history.push(URL_ADMIN_EVENT_DETAIL.replace(':eventId', record.id));
            }, // click row
            // onDoubleClick: (event) => {}, // double click row
            // onContextMenu: (event) => {}, // right button click row
            // onMouseEnter: (event) => {}, // mouse enter row
            // onMouseLeave: (event) => {}, // mouse leave row
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
