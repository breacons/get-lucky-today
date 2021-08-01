import { Col, Divider, Row, Typography } from 'antd';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

import EventCard from '../../components/EventCard';
import { PageTitle } from '../../components/Header';
import If from '../../components/If';
import { LandingSection } from '../../components/LandingSection';
import { LandingLayout } from '../../components/Layout';
import { useEvents } from '../../hooks/events';
import { EventStatus, RaffleEvent } from '../../interfaces/events';
import flyImage from './images/fly.png';
import organiserImage from './images/organiser.png';
import personImage from './images/person.png';
import submitImage from './images/submit.png';
import verifyImage from './images/verify.png';
import winnerImage from './images/winner.png';
import planetImage from './images/world.png';

// How it works?
export const LandingPage = () => {
  const { events, isLoaded } = useEvents();
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
                  <EventCard event={event} past />
                </Col>
              ))}
          </Row>
        )}
      />
      <div style={{ marginTop: 180, marginBottom: 100 }}>
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          What is all this?
        </Typography.Title>
        <Divider />
        <LandingSection
          title="The first digital sweepstake platform."
          description={
            <span>
              <strong>GET LUCKY • TODAY</strong> is a completely digital sweepstake platform where
              you can explore and participate online contests.
            </span>
          }
          image={personImage}
          reversed
        />
        <LandingSection
          title="Be part of it in seconds!"
          description="Taking part is super easy, the app will navigate you through the required steps. After you create a submission, just sit back and hope to be the lucky winner."
          image={submitImage}
          inverted
        />
        <LandingSection
          title="Instantly delivered prizes."
          description="If you are selected as one of winners, your prize will be delivered to you right away as a gift card, ready to use."
          image={winnerImage}
          reversed
        />
        <LandingSection
          title="Available worldwide, without borders."
          description="Our application was built on top of the BlinkSky ecosystem, with hundreds of partner merchants and gift card options. You will surely find some prizes that you like!"
          image={planetImage}
        />
        <Divider />
        <LandingSection
          title="Organise online sweepstakes easily!"
          description="If you have an online business and you want to gain some popularity, online contests are the best way to get started. Our platform will help you in every step of this."
          image={organiserImage}
          reversed
        />
        <LandingSection
          title="Tracking participants in real time."
          description="Organisers can see all contest submissions, verify and disqualify participants who will continue to the raffle."
          image={verifyImage}
        />
        <LandingSection
          title="Let us take care of your winners!"
          description="When a sweepstake closes, our platform automatically selects the winners and takes care of sending out the prizes. With the integrated BlinkSky services, we make sure that everything arrives instantly."
          image={flyImage}
          reversed
        />
      </div>
    </LandingLayout>
  );
};

export default LandingPage;
