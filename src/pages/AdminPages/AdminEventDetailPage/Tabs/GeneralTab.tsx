import React, { Fragment } from 'react';
import { EventStatus, StepFormat, TransformedEvent } from '../../../../interfaces/events';
import { Button, Col, Descriptions, List, Row, Space, Spin, Steps, Typography } from 'antd';
import { SectionTitle } from '../../../../components/SectionTitle/SectionTitle';
import { Link } from 'react-router-dom';
import { URL_ADMIN_EDIT_EVENT_DETAIL, URL_EVENT_DETAIL } from '../../../../urls';
import PrizeCard from '../../../../components/PrizeCard';
import { stepFormatDictionary } from '../../../../components/StepsField';
import _ from 'lodash-es';
import If from '../../../../components/If';

interface Props {
  event: TransformedEvent;
}

export const GeneralTab = ({ event }: Props) => {
  return (
    <Fragment>
      <Typography.Title level={2} style={{ marginTop: 40 }}>
        Description
      </Typography.Title>
      {event.description.split('\n').map((p, index) => (
        <Typography.Paragraph key={index}>{p}</Typography.Paragraph>
      ))}
      <Typography.Title level={2}>Prizes</Typography.Title>
      <Row gutter={24}>
        {event.prizes.map((prize, index) => (
          <Col span={6} key={index}>
            <PrizeCard card={prize.card} count={prize.count} value={prize.value} />
          </Col>
        ))}
      </Row>
      <Typography.Title level={2}>Required steps</Typography.Title>
      <Steps direction="vertical" current={-1}>
        {event.steps.map((step, index) => {
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
                  {step.link && (
                    <a href={step.link} target="_blank" rel="noreferrer">
                      <Button type="default">Visit</Button>
                    </a>
                  )}
                </div>
              }
              key={step.id}
            />
          );
        })}
      </Steps>
    </Fragment>
  );
};

export default GeneralTab;
