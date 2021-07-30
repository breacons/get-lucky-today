import React, { Fragment, useMemo } from 'react';
import { useParams } from 'react-router';
import { RaffleEvent, TransformedEvent } from '../../interfaces/events';
import { EventActionSection } from '../../components/EventActionSection';
import { isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { firebaseToObject } from '../../utils/firebase-transformers';
import { transformEvent } from '../../utils/events';
import { LandingLayout } from '../../components/Layout';
import If from '../../components/If';
import { SpinnerOverlay } from '../../components/SpinnerOverlay';
import EventDetails from '../../components/EventDetails';
import Header, {PageTitle} from '../../components/Header';

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
