import React, { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useParams } from 'react-router';

import { EventActionSection } from '../../components/EventActionSection';
import EventDetails from '../../components/EventDetails';
import { PageTitle } from '../../components/Header';
import If from '../../components/If';
import { LandingLayout } from '../../components/Layout';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import { RaffleEvent, TransformedEvent } from '../../interfaces/events';
import { RootState } from '../../redux/reducers';
import { transformEvent } from '../../utils/events';
import { firebaseToObject } from '../../utils/firebase-transformers';

export const EventDetailPage = () => {
  const { eventId } = useParams<any>();
  useFirebaseConnect([{ path: `events/${eventId}` }]);
  const events = useSelector((state: RootState) => state.firebase.ordered.events);

  const event: TransformedEvent | null = useMemo(() => {
    if (!events || !events[eventId]) {
      return null;
    }
    const originalEvent = firebaseToObject(events[eventId]) as RaffleEvent;

    return transformEvent(originalEvent);
  }, [events]);

  // if (!isLoaded(events)) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (isEmpty(events) || event === null) {
  //   return <div>Event not found</div>;
  // }

  return (
    <LandingLayout>
      <PageTitle title="Event Details" />
      <If
        condition={!isLoaded(events) || event === null}
        then={() => <SpinnerOverlay spinning />}
        else={() => (
          <Fragment>
            <EventDetails event={event as TransformedEvent} />
            <EventActionSection event={event as TransformedEvent} />
          </Fragment>
        )}
      />
    </LandingLayout>
  );
};

export default EventDetailPage;
