import { Col, Row, Typography } from 'antd';
import _ from 'lodash-es';
import React, { useMemo } from 'react';
import Countdown from 'react-countdown';

import { EventStatus, TransformedEvent } from '../../interfaces/events';
import If from '../If';
import PrizeCard from '../PrizeCard';
import styles from './styles.module.less';

interface Props {
  event: TransformedEvent;
}

// Number of winners, total prize
export const EventDetails = ({ event }: Props) => {
  const { numberOfWinners, prizeValue } = useMemo(() => {
    const numberOfWinners = _.sumBy(event.prizes, 'count');
    const prizeValue = _.sum(event.prizes.map((prize) => prize.count * prize.value));

    return { numberOfWinners, prizeValue };
  }, [event.prizes]);

  return (
    <div>
      <If
        condition={event.status === EventStatus.Open}
        then={() => (
          <Typography.Title level={2}>
            <Countdown
              date={event.finishes_at * 1000}
              renderer={({ days, hours, minutes, seconds }) => (
                <span>
                  <If condition={days > 0} then={() => `${days}d `} />
                  {hours}h {minutes}m {seconds}s
                </span>
              )}
            />
          </Typography.Title>
        )}
      />
      <Typography.Title level={1} style={{ marginTop: 0, marginBottom: 8 }}>
        {event.name}
      </Typography.Title>
      <Typography.Title level={5} style={{ marginTop: 10, marginBottom: 48 }}>
        {event.organiser.name}
      </Typography.Title>
      <div className={styles.description}>
        {event.description.split('\n').map((p, index) => (
          <Typography.Paragraph key={index}>{p}</Typography.Paragraph>
        ))}
      </div>
      {/*<p>{event.status}</p>*/}
      {/*<p>Participants: {Object.keys(event?.participants || {}).length}</p>*/}
      <Typography.Title level={2} style={{ marginTop: 100, marginBottom: 8 }}>
        🏆 ${prizeValue} in prizes - {numberOfWinners} winners
      </Typography.Title>
      <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 48 }}>
        Automatically delivered with BlinkSky when the winners are announced.
      </Typography.Title>
      <Row gutter={24}>
        {event.prizes.map((prize, index) => (
          <Col span={6} key={index}>
            <PrizeCard card={prize.card} count={prize.count} value={prize.value} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default EventDetails;
