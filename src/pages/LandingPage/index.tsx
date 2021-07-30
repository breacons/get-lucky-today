import React from 'react';
import { LandingLayout } from '../../components/Layout';
import { Col, Row, Typography } from 'antd';
import { useEvents } from '../../hooks/events';
import { EventStatus, RaffleEvent } from '../../interfaces/events';
import EventCard from '../../components/EventCard';
import If from '../../components/If';
import Skeleton from 'react-loading-skeleton';
import Header, { PageTitle } from '../../components/Header';

// How it works?
export const LandingPage = () => {
  const { events, isLoaded, isEmpty } = useEvents();
  return (
    <LandingLayout>
      <PageTitle title="Welcome" />
      <Typography.Title level={1} style={{ marginBottom: 160 }}>
        Take part in online sweepstakes and collect your prize <u>instantly</u>.
      </Typography.Title>

      <Typography.Title level={2}>Ongoing Games</Typography.Title>
      <If
        condition={!isLoaded}
        then={() => (
          <Row gutter={24}>
            {new Array(3).fill(' ').map((_, index) => (
              <Col span={8} key={index}>
                <Skeleton width="100%" height={190} style={{ borderRadius: 16 }} />
              </Col>
            ))}
          </Row>
        )}
        else={() => (
          <Row gutter={24}>
            {events
              .filter((event) => event.status === EventStatus.Open)
              .slice(0, 3)
              .map((event: RaffleEvent) => (
                <Col span={8} key={event.id}>
                  <EventCard event={event} />
                </Col>
              ))}
          </Row>
        )}
      />
      <Typography.Title level={2} style={{ marginTop: 60 }}>
        Past Games
      </Typography.Title>
      <If
        condition={!isLoaded}
        then={() => (
          <Row gutter={24}>
            {new Array(3).fill(' ').map((_, index) => (
              <Col span={8} key={index}>
                <Skeleton width="100%" height={190} style={{ borderRadius: 16 }} />
              </Col>
            ))}
          </Row>
        )}
        else={() => (
          <Row gutter={24}>
            {events
              .filter((event) => event.status === EventStatus.Announced)
              .slice(0, 3)
              .map((event: RaffleEvent) => (
                <Col span={8} key={event.id}>
                  <EventCard event={event} past/>
                </Col>
              ))}
          </Row>
        )}
      />
    </LandingLayout>
  );
};

export default LandingPage;
