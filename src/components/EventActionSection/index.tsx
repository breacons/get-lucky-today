import React from 'react';

import { EventStatus, TransformedEvent } from '../../interfaces/events';
import AnnouncedEventAction from './AnnouncedEventAction';
import ClosedEventAction from './ClosedEventAction';
import FutureEventAction from './FutureEventAction';
import OpenEventAction from './OpenEventAction';

interface Props {
  event: TransformedEvent;
}

export const EventActionSection = ({ event }: Props) => {
  if (event.status === EventStatus.Future) {
    return <FutureEventAction event={event} />;
  }

  if (event.status === EventStatus.Open) {
    return <OpenEventAction event={event} />;
  }

  if (event.status === EventStatus.Closed) {
    return <ClosedEventAction event={event} />;
  }

  return <AnnouncedEventAction event={event} />;
};
