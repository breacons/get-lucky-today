import { GiftCard } from '../../interfaces/blinksky';
import React from 'react';
import styles from './styles.module.less';

interface Props {
  card: GiftCard;
  count?: number;
  value?: number;
}

export const PrizeCard = ({ card, count, value }: Props) => {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className={styles.container} style={{ backgroundImage: `url(${card.logo})` }}>
      </div>
      {count && value && (
        <div className={styles.caption}>
          {count}x ${value} {card.caption} Card
        </div>
      )}
    </div>
  );
};

export default PrizeCard;
