import dayjs from 'dayjs';
import { EventStatus, RaffleEvent } from '../interfaces/events';

export const transformEvent = (originalEvent: RaffleEvent) => {
  const dates = {
    startsAt: dayjs.unix(originalEvent.starts_at),
    finishesAt: dayjs.unix(originalEvent.finishes_at),
    announcedAt: dayjs.unix(originalEvent.announced_at),
  };

  const now = dayjs();
  let status: EventStatus = EventStatus.Future;

  if (now >= dates.announcedAt) {
    status = EventStatus.Announced;
  } else if (now >= dates.finishesAt) {
    status = EventStatus.Closed;
  } else if (now >= dates.startsAt) {
    status = EventStatus.Open;
  }

  return {
    ...originalEvent,
    ...dates,
    status,
  };
};
