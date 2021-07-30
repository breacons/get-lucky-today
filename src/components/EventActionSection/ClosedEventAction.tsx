import React from 'react';
import { TransformedEvent } from '../../interfaces/events';
import Countdown from 'react-countdown';
import { Typography } from 'antd';
import styles from './styles.module.less';
import If from '../If';

interface Props {
  event: TransformedEvent;
}

export const ClosedEventAction = ({ event }: Props) => {
  return (
    <div>
      <Typography.Title level={2} style={{ marginTop: 60, marginBottom: 8 }}>
        😕 This game is over!
      </Typography.Title>
        <br/>
      <div className={styles.formContainer} style={{maxWidth: 800}}>
        Winners announced in
        <Typography.Title level={1} style={{ marginBottom: 0 }}>
          <Countdown
            date={event.announced_at * 1000}
            renderer={({ days, hours, minutes, seconds }) => (
              <span>
                <If condition={days > 0} then={() => `${days}d `} />
                {hours}h {minutes} m {seconds}s
              </span>
            )}
          />
        </Typography.Title>
      </div>
    </div>
  );
};

export default ClosedEventAction;
