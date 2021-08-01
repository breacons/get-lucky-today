import classNames from 'classnames';
import _ from 'lodash-es';
import React, { Fragment } from 'react';
import Countdown from 'react-countdown';
import { Link } from 'react-router-dom';

import { RaffleEvent } from '../../interfaces/events';
import { URL_EVENT_DETAIL } from '../../urls';
import If from '../If';
import styles from './styles.module.less';

interface Props {
  event: RaffleEvent;
  past?: boolean;
}
export const EventCard = ({ event, past }: Props) => {
  return (
    <Link to={URL_EVENT_DETAIL.replace(':eventId', event.id)}>
      <div className={classNames([styles.container, { [styles.redContainer]: past }])}>
        <div>
          <div className={styles.organiser}>{event.organiser.name}</div>
          <div className={styles.title}>{event.name}</div>
        </div>
        <div>
          <strong>${_.sum(event.prizes.map((prize) => prize.count * prize.value))}</strong> /{' '}
          <If
            condition={!past}
            then={() => (
              <Fragment>
                <strong>
                  <Countdown
                    date={event.finishes_at * 1000}
                    renderer={(
                      { days, hours, minutes, seconds }, // TODO: correct format of time
                    ) => (
                      <span>
                        <If condition={days > 0} then={() => `${days}d `} />
                        {hours}h {minutes}m {seconds}s
                      </span>
                    )}
                  />
                </strong>
              </Fragment>
            )}
            else={() => (
              <strong>{event.winners ? Object.keys(event.winners).length : 0} winners</strong>
            )}
          />
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
