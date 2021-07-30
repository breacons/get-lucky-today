import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import { useMemo } from 'react';
import _ from 'lodash-es';
import { firebaseObjectToArray, firebaseToArray } from '../utils/firebase-transformers';
import { transformEvent } from '../utils/events';

export const useEvents = (admin?: boolean) => {
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const params = admin ? ['orderByChild=organiser_id', `equalTo=${auth.uid}`] : [];
  useFirebaseConnect([{ path: 'events', queryParams: params }]); // TODO: sorting
  const events = useSelector((state: RootState) => state.firebase.ordered.events);
  const transformedEvents = useMemo(() => {
    if (!events) {
      return [];
    }

    if (!_.isArray(events)) {
      return firebaseObjectToArray(events).map((event) => transformEvent(event));
    }

    return firebaseToArray(
      events.filter(
        (event) =>
          event && 'key' in event && (!admin || (event.value as any).organiser_id === auth.uid),
      ),
    ).map((event) => transformEvent(event));
  }, [events]);

  return {
    events: transformedEvents,
    isEmpty: isEmpty(events),
    isLoaded: isLoaded(events),
  };
};
