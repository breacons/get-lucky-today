import { Button, Descriptions, Modal, Space, Spin, Table, Tag, Typography } from 'antd';
import axios from 'axios';
import firebase from 'firebase';
import _ from 'lodash-es';
import React, { Fragment, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import If from '../../../../components/If';
import { firebaseApiUrl } from '../../../../config';
import {
  EventWinner,
  EventWinnerStatus,
  ParticipantStatus,
  TransformedEvent,
} from '../../../../interfaces/events';
import { RootState } from '../../../../redux/reducers';
import { firebaseObjectToArray } from '../../../../utils/firebase-transformers';
import { DeliveryListItem, GiftCard } from '../../../../interfaces/blinksky';
import { ComplexLoader } from '../../../../components/ComplexLoader';
import CustomSpinner from '../../../../components/CustomSpinner';
import { SectionTitle } from '../../../../components/SectionTitle';
import PrizeCard from '../../../../components/PrizeCard';

interface Props {
  event: TransformedEvent;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  // {
  //   title: 'Phone',
  //   dataIndex: 'phone',
  //   key: 'phone',
  // },
  {
    title: 'Prize',
    dataIndex: 'prize',
    key: 'prize',
    render: (text: string, record: EventWinner) => `$${record.value} ${record.card.caption} Card`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => <Tag>{text || EventWinnerStatus.Selected}</Tag>,
  },
  // {
  //   title: 'Action',
  //   key: 'action',
  //   render: (text: string, record: EventParticipant) => (
  //     <Space size="middle">
  //       <a>Details</a>
  //     </Space>
  //   ),
  // },
];

export const WinnersTab = ({ event }: Props) => {
  const [winnerModal, setWinnerModal] = useState<null | EventWinner>(null);
  const [raffleModal, setRaffleModal] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const profile = useSelector((state: RootState) => state.firebase.profile);

  const winnersAsArray = useMemo(() => {
    if (!event || !event.winners) {
      return null;
    }
    return firebaseObjectToArray(event.winners as Record<string, EventWinner>);
  }, [event.winners]);

  const closeModal = () => setWinnerModal(null);

  const selectWinners = async () => {
    const prizeCount = _.sumBy(event.prizes, 'count');
    const selectedWinners = _.sampleSize(
      _.filter(
        event.participants,
        (participant) => participant.status !== ParticipantStatus.Disqualified,
      ),
      prizeCount,
    );

    const flattenedPrizes = _.shuffle(
      _.flatten(
        event.prizes.map((prize) => {
          return new Array(prize.count).fill({
            ..._.omit(prize, ['count', 'id']),
            prizeId: prize.id,
          });
        }),
      ),
    );

    const winners = selectedWinners.map((winner, index) => {
      return {
        ...flattenedPrizes[index],
        name: winner.name,
        email: winner.email || 'sample@email.com',
        status: EventWinnerStatus.Selected,
        winnerId: uuidv4(),
      };
    });

    const path = `events/${event.id}/winners`;

    console.log(winners);
    await firebase.database().ref(path).set(_.keyBy(winners, 'winnerId'));
  };

  const deliverPrizes = async () => {
    const deliverPrize = async (winner: EventWinner) => {
      const body = {
        sender: profile.name,
        from: profile.phone,
        dest: winner.email,
        code: winner.card.code,
        amount: winner.value,
        msg: 'oops', // TODO
        reference: winner.winnerId,
      };

      const response = await axios.post(`${firebaseApiUrl}/send`, body);

      const path = `events/${event.id}/winners/${winner.winnerId}`;
      await firebase
        .database()
        .ref(path)
        .update({ status: EventWinnerStatus.Delivered, delivery: response.data });

      return response;
    };

    const promises = (winnersAsArray || [])
      .filter((winner) => winner.status === EventWinnerStatus.Selected)
      .map((winner) => {
        return deliverPrize(winner);
      });

    await Promise.all(promises);
  };

  const groupedWinners = useMemo(() => {
    if (!event.winners) {
      return null;
    }
    // const winners = firebaseToArray(event.winners);
    return _.groupBy(event.winners, 'prizeId');
  }, [event.winners]);

  return (
    <Fragment>
      <Modal
        title="Raffle Winners"
        visible={raffleModal}
        onOk={() => setRaffleModal(false)}
        onCancel={() => setRaffleModal(false)}
        footer={
          <Button
            type="primary"
            onClick={async () => {
              setDelivering(true);
              await deliverPrizes();
              setRaffleModal(false);
              setDelivering(false);
            }}
            size="large"
            disabled={!groupedWinners}
            loading={delivering}
          >
            Deliver Prizes
          </Button>
        }
        width={700}
      >
        <ComplexLoader onFinish={() => selectWinners()}>
          <Spin
            spinning={!groupedWinners}
            indicator={<CustomSpinner />}
            style={{ marginBottom: 20 }}
          >
            <If
              condition={groupedWinners}
              then={() =>
                Object.values(groupedWinners as Record<string, EventWinner[]>).map((winners) => {
                  if (!winners) {
                    return null;
                  }

                  const prize = winners[0];

                  return (
                    <div key={prize.prizeId}>
                      <Typography.Title level={5} style={{ marginTop: 20, marginBottom: 8 }}>
                        ${prize.value} {prize.card.caption} Card
                      </Typography.Title>
                      {winners.map((winner) => (
                        <Typography.Title
                          level={2}
                          key={winner.phone}
                          style={{ marginTop: 0, marginBottom: 0 }}
                        >
                          {winner.name}
                        </Typography.Title>
                      ))}
                    </div>
                  );
                })
              }
            />
          </Spin>
        </ComplexLoader>
      </Modal>
      <If
        condition={event && !winnersAsArray}
        then={() => (
          <div style={{ textAlign: 'center', margin: '100px 0' }}>
            <Typography.Title level={2}>No winners are announced yet.</Typography.Title>
            <Button type="primary" onClick={() => setRaffleModal(true)}>
              Raffle Winners
            </Button>
          </div>
        )}
        else={() => (
          <Fragment>
            <Modal
              title={
                <Space size="middle">
                  {winnerModal?.name}
                  <Tag>{winnerModal?.status || EventWinnerStatus.Selected}</Tag>
                </Space>
              }
              visible={!!winnerModal}
              onOk={closeModal}
              onCancel={closeModal}
              footer={
                <Button onClick={closeModal} type="default">
                  Close
                </Button>
              }
            >
              <SectionTitle>Personal Information</SectionTitle>
              <Descriptions column={2} colon={false} layout="vertical">
                <Descriptions.Item label="Full Name">{winnerModal?.name}</Descriptions.Item>
                <Descriptions.Item label="E-mail Address">{winnerModal?.email}</Descriptions.Item>
              </Descriptions>
              <SectionTitle>Received Prize</SectionTitle>
              <Descriptions column={2} colon={false} layout="vertical">
                <Descriptions.Item label="Gift Card">
                  {winnerModal?.card.caption} Gift Card
                </Descriptions.Item>
                <Descriptions.Item label="Value">${winnerModal?.value}</Descriptions.Item>
                {winnerModal?.status === EventWinnerStatus.Delivered && (
                  <Descriptions.Item label="Reference">
                    <Typography.Link>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={
                          (winnerModal?.delivery?.list[0] as DeliveryListItem).reference as string
                        }
                      >
                        {(winnerModal?.delivery?.list[0] as DeliveryListItem).reference}
                      </a>
                    </Typography.Link>
                  </Descriptions.Item>
                )}
              </Descriptions>
              <div style={{ maxWidth: 220, margin: '20px auto' }}>
                <PrizeCard card={winnerModal?.card as GiftCard} />
              </div>
            </Modal>
            <Table
              dataSource={winnersAsArray as any}
              columns={columns}
              rowKey={(row: EventWinner) => `${row.phone}`}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setWinnerModal(record);
                  }, // click row
                };
              }}
            />
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default WinnersTab;
