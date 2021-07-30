import React, { useMemo } from 'react';
import { TransformedEvent } from '../../interfaces/events';
import _ from 'lodash-es';
import { Typography } from 'antd';
interface Props {
  event: TransformedEvent;
}

export const AnnouncedEventAction = ({ event }: Props) => {
  if (!event.winners || Object.keys(event.winners).length === 0) {
    return (
      <div>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 20 }}>
          Selected winners
        </Typography.Title>
        <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 20 }}>
          😕 No winners were announced to this raffle.
        </Typography.Title>
      </div>
    );
  }

  const groupedWinners = useMemo(() => {
    return _.groupBy(event.winners, 'prizeId');
  }, [event.winners]);

  return (
    <div>
      <Typography.Title level={2} style={{ marginTop: 60, marginBottom: 8 }}>
        🤩 Congratulations for the winners!
      </Typography.Title>
      <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 20 }}>
        They were the lucky ones this time.
      </Typography.Title>
      {Object.values(groupedWinners).map((winners) => {
        const prize = winners[0];
        return (
          <div key={prize.prizeId}>
            <Typography.Title level={5} style={{ marginTop: 46, marginBottom: 8 }}>
              ${prize.value} {prize.card.caption} Card
            </Typography.Title>
            {winners.map((winner) => (
              <Typography.Title
                level={1}
                key={winner.phone}
                style={{ marginTop: 0, marginBottom: 0 }}
              >
                {winner.name.split(' ')[0]} {winner.name.split(' ')[1][0]}.
              </Typography.Title>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default AnnouncedEventAction;
