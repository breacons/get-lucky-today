import { Button, Descriptions, Modal, Space, Steps, Table, Tag, Typography } from 'antd';
import firebase from 'firebase';
import _ from 'lodash-es';
import React, { Fragment, useMemo, useState } from 'react';

import If from '../../../../components/If';
import { SectionTitle } from '../../../../components/SectionTitle/SectionTitle';
import { stepFormatDictionary } from '../../../../components/StepsField';
import {
  EventParticipant,
  ParticipantStatus,
  StepFormat,
  TransformedEvent,
} from '../../../../interfaces/events';
import { firebaseObjectToArray } from '../../../../utils/firebase-transformers';

interface Props {
  event: TransformedEvent;
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 300,
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
    key: 'email',
    width: 600,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text: string) => (
      <Tag
        color={
          text === ParticipantStatus.Disqualified
            ? 'red'
            : text === ParticipantStatus.Verified
            ? 'green'
            : 'default'
        }
      >
        {text || ParticipantStatus.Unverified}
      </Tag>
    ),
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

export const ParticipantsTab = ({ event }: Props) => {
  const [participantModal, setParticipantModal] = useState<null | EventParticipant>(null);

  const participantsAsArray = useMemo(() => {
    if (!event || !event.participants) {
      return [];
    }

    return firebaseObjectToArray(event.participants as Record<string, EventParticipant>);
  }, [event.participants]);

  const closeModal = () => setParticipantModal(null);

  const modifyParticipantStatus = async (participantId: string, newStatus: ParticipantStatus) => {
    const path = `events/${event.id}/participants/${participantId}`;
    await firebase.database().ref(path).update({ status: newStatus });
  };

  return (
    <Fragment>
      <Modal
        title={
          <Space size="middle">
            {participantModal?.name}

            <Tag
              color={
                participantModal?.status === ParticipantStatus.Disqualified
                  ? 'red'
                  : participantModal?.status === ParticipantStatus.Verified
                  ? 'green'
                  : 'default'
              }
            >
              {participantModal?.status || ParticipantStatus.Unverified}
            </Tag>
          </Space>
        }
        visible={!!participantModal}
        onOk={closeModal}
        onCancel={closeModal}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Button
                key="disqualify"
                disabled={participantModal?.status === ParticipantStatus.Disqualified}
                danger
                onClick={() => {
                  modifyParticipantStatus(
                    participantModal?.id as string,
                    ParticipantStatus.Disqualified,
                  );
                  closeModal();
                }}
              >
                Disqualify
              </Button>
              <Button
                type="default"
                key="submit"
                disabled={participantModal?.status === ParticipantStatus.Verified}
                onClick={() => {
                  modifyParticipantStatus(
                    participantModal?.id as string,
                    ParticipantStatus.Verified,
                  );
                  closeModal();
                }}
              >
                Verify
              </Button>
            </div>
            <div>
              <Button type="primary" key="close" onClick={closeModal}>
                Close
              </Button>
            </div>
          </div>
        }
      >
        <SectionTitle>Personal Information</SectionTitle>
        <Descriptions column={2} colon={false} layout="vertical">
          <Descriptions.Item label="Full Name">{participantModal?.name}</Descriptions.Item>
          <Descriptions.Item label="E-mail Address">{participantModal?.email}</Descriptions.Item>
        </Descriptions>
        <SectionTitle>Completed Steps</SectionTitle>
        <Steps
          direction="vertical"
          current={event.steps.length}
          size="small"
          style={{ marginBottom: -20 }}
        >
          {event.steps.map((step) => {
            return (
              <Steps.Step
                title={stepFormatDictionary[_.last(step.format) as StepFormat]}
                description={
                  <div>
                    <Typography.Paragraph
                      style={{
                        maxWidth: 600,
                        lineHeight: 1.6,
                      }}
                    >
                      {step.description}
                    </Typography.Paragraph>
                  </div>
                }
                key={step.id}
              />
            );
          })}
        </Steps>
        <If
          condition={
            participantModal?.accounts && Object.keys(participantModal.accounts).length > 0
          }
          then={() => (
            <Fragment>
              <SectionTitle>Social Accounts</SectionTitle>
              <Descriptions column={2} colon={false} layout="vertical">
                {Object.keys((participantModal as EventParticipant)?.accounts).map((accountId) => (
                  <Descriptions.Item key={accountId} label={_.capitalize(accountId)}>
                    {((participantModal as EventParticipant).accounts as any)[accountId]}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </Fragment>
          )}
        />
      </Modal>
      <Table
        dataSource={participantsAsArray}
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              setParticipantModal(record);
            }, // click row
          };
        }}
      />
    </Fragment>
  );
};

export default ParticipantsTab;
