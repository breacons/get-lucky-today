import React, { Fragment, useMemo } from 'react';
import { useParams } from 'react-router';
import { isEmpty, isLoaded, useFirebaseConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { EventStatus, RaffleEvent, TransformedEvent } from '../../../interfaces/events';
import { firebaseToObject } from '../../../utils/firebase-transformers';
import { transformEvent } from '../../../utils/events';
import { Tabs, Descriptions, List, Typography, Button, Steps, Space } from 'antd';
import { SectionTitle } from '../../../components/SectionTitle';
import GeneralTab from './Tabs/GeneralTab';
import ParticipantsTab from './Tabs/ParticipantsTab';
import WinnersTab from './Tabs/WinnersTab';
import {
  URL_ADMIN_EDIT_EVENT_DETAIL,
  URL_ADMIN_EVENT_DETAIL,
  URL_ADMIN_EVENT_LIST,
  URL_EVENT_DETAIL,
} from '../../../urls';
import { Link } from 'react-router-dom';
import { SpinnerOverlay } from '../../../components/SpinnerOverlay';
import If from '../../../components/If';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PageTitle } from '../../../components/Header';
import { LandingLayout } from '../../../components/Layout';

const { TabPane } = Tabs;
const { Step } = Steps;
export const AdminEventDetailPage = () => {
  const { eventId } = useParams<any>();
  useFirebaseConnect([{ path: `events/${eventId}` }]);
  const events = useSelector((state: RootState) => state.firebase.ordered.events);

  const event: TransformedEvent | null = useMemo(() => {
    if (!events || !events[eventId]) {
      return null;
    }
    const originalEvent = firebaseToObject(events[eventId]) as RaffleEvent;

    return transformEvent(originalEvent);
  }, [events]);

  // if (!isLoaded(events)) {
  //   return <div>Loading...</div>;
  // }
  //
  // if (isEmpty(events) || event === null) {
  //   return <div>Event not found</div>;
  // }

  return (
    <div>
      <PageTitle title="Event Details" />
      <If
        condition={!isLoaded(events) || event === null}
        then={() => <SpinnerOverlay spinning />}
        else={() => (
          <Fragment>
            <Link to={URL_ADMIN_EVENT_LIST}>
              <ArrowLeftOutlined style={{ fontSize: 34, marginBottom: 24 }} />
            </Link>
            <Typography.Title level={1}>{event?.name}</Typography.Title>
            <Space direction="horizontal" size={16}>
              <Link
                to={URL_ADMIN_EDIT_EVENT_DETAIL.replace(':eventId', (event as TransformedEvent).id)}
              >
                <Button type="primary">Edit Details</Button>
              </Link>
              <Link
                to={URL_EVENT_DETAIL.replace(':eventId', (event as TransformedEvent).id)}
                target="_blank"
              >
                <Button type="primary">Preview Event</Button>
              </Link>
            </Space>
            <Steps
              progressDot
              current={
                event?.status === EventStatus.Announced
                  ? 2
                  : event?.status === EventStatus.Closed
                  ? 1
                  : 0
              }
              style={{ marginTop: 60, marginBottom: 40 }}
            >
              <Step title="Event starts" description={event?.startsAt.format('YYYY.MM.DD')} />
              <Step title="Event ends" description={event?.finishesAt.format('YYYY.MM.DD')} />
              <Step
                title="Winners announced"
                description={event?.announcedAt.format('YYYY.MM.DD')}
              />
            </Steps>

            <Tabs defaultActiveKey="1">
              <TabPane tab="Event Details" key="1">
                <GeneralTab event={event as TransformedEvent} />
              </TabPane>
              <TabPane
                tab={`Participants (${event ? Object.keys(event.participants || {}).length : 0})`}
                key="2"
              >
                <ParticipantsTab event={event as TransformedEvent} />
              </TabPane>
              <TabPane
                tab={`Winners (${
                  (event && Object.keys(event.winners || {}).length) || 'Not yet announced'
                })`}
                key="3"
              >
                <WinnersTab event={event as TransformedEvent} />
              </TabPane>
            </Tabs>
          </Fragment>
        )}
      />
    </div>
  );
};

export default AdminEventDetailPage;
