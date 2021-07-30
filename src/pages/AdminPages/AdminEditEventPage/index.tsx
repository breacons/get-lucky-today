import React, { Fragment, useEffect, useMemo } from 'react';
import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { RaffleEvent, TransformedEvent } from '../../../interfaces/events';
import { firebaseToObject } from '../../../utils/firebase-transformers';
import { transformEvent } from '../../../utils/events';
import { useParams } from 'react-router';
import { useAppDispatch } from '../../../redux/store';
import { getGiftCards } from '../../../redux/blinksky';
import { EditEventForm } from '../../../components/EditEventForm';
import { Typography } from 'antd';
import { URL_ADMIN_EVENT_DETAIL, URL_ADMIN_EVENT_LIST } from '../../../urls';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import If from '../../../components/If';
import { SpinnerOverlay } from '../../../components/SpinnerOverlay';
import { PageTitle } from '../../../components/Header';
import { LandingLayout } from '../../../components/Layout';

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
