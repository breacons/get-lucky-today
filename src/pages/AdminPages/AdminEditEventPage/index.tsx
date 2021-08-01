import { ArrowLeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React, { Fragment, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { EditEventForm } from '../../../components/EditEventForm';
import { PageTitle } from '../../../components/Header';
import If from '../../../components/If';
import { SpinnerOverlay } from '../../../components/SpinnerOverlay';
import { RaffleEvent, TransformedEvent } from '../../../interfaces/events';
import { getGiftCards } from '../../../redux/blinksky';
import { RootState } from '../../../redux/reducers';
import { useAppDispatch } from '../../../redux/store';
import { URL_ADMIN_EVENT_DETAIL } from '../../../urls';
import { transformEvent } from '../../../utils/events';
import { firebaseToObject } from '../../../utils/firebase-transformers';

export const AdminEditEventPage = () => {
  const { eventId } = useParams<any>();
  const dispatch = useAppDispatch();
  useFirebaseConnect([{ path: `events/${eventId}` }]);
  const events = useSelector((state: RootState) => state.firebase.ordered.events);

  useEffect(() => {
    dispatch(getGiftCards());
  }, []);

  const event: TransformedEvent | null = useMemo(() => {
    if (!events || !events[eventId]) {
      return null;
    }
    const originalEvent = firebaseToObject(events[eventId]) as RaffleEvent;

    return transformEvent(originalEvent);
  }, [events]);

  return (
    <Fragment>
      <PageTitle title="Edit Event" />
      <If
        condition={!isLoaded(events) || event === null}
        then={() => <SpinnerOverlay spinning />}
        else={() => (
          <div>
            <Link to={URL_ADMIN_EVENT_DETAIL.replace(':eventId', eventId)}>
              <ArrowLeftOutlined style={{ fontSize: 34, marginBottom: 24 }} />
            </Link>
            <Typography.Title level={1}>{event?.name}</Typography.Title>
            <EditEventForm event={event as TransformedEvent} />
          </div>
        )}
      />
    </Fragment>
  );
};

export default AdminEditEventPage;
