import { Button, Divider, Space, Spin, Steps, Typography } from 'antd';
import React, { Fragment, ReactElement, useMemo, useState } from 'react';
import Countdown from 'react-countdown';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import styles from './styles.module.less';
import {
  EventStep,
  ParticipantStatus,
  StepFormat,
  TransformedEvent,
} from '../../interfaces/events';
import { joi } from '../../lib/joi';
import { Form } from '../Form';
import Checkbox from '../Form/Checkbox';
import Input from '../Form/Input';
import { validateSchema } from '../Form/validation';
import If from '../If';
import firebase from 'firebase/app';
import _ from 'lodash-es';
import { stepFormatDictionary } from '../StepsField';
import { Link } from 'react-router-dom';
import CustomSpinner from '../CustomSpinner';

const { Step } = Steps;
const { Paragraph } = Typography;

interface Props {
  event: TransformedEvent;
}

const getFields = (steps: EventStep[]) => {
  const formats = steps.map((step) => _.last(step.format)).join(' ');
  const fields = [];
  if (formats.includes('INSTAGRAM')) {
    fields.push(
      <Field
        key={'accounts.instagram'}
        id={'accounts.instagram'}
        name={'accounts.instagram'}
        type="text"
        component={Input}
        label="Instagram Account"
        placeholder="@your_instagram_account"
        autoComplete="new-password"
      />,
    );
  }

  if (formats.includes('FACEBOOK')) {
    fields.push(
      <Field
        name={'accounts.facebook'}
        key={'accounts.facebook'}
        id={'accounts.facebook'}
        type="text"
        component={Input}
        label="Name on Facebook"
        placeholder="John Holland"
        autoComplete="new-password"
      />,
    );
  }

  if (formats.includes('TWITTER')) {
    fields.push(
      <Field
        key={'accounts.twitter'}
        name={'accounts.twitter'}
        id={'accounts.twitter'}
        type="text"
        component={Input}
        label="Twitter Account"
        placeholder="@your_twitter_account"
        autoComplete="new-password"
      />,
    );
  }

  return fields;
};

const createValidator = (steps: EventStep[]) => {
  const formats = steps.map((step) => _.last(step.format)).join(' ');
  const validation = joi
    .object({
      name: joi.string().required(),
      email: joi
        .string()
        .email({ tlds: { allow: false } })
        .required(),
      accounts: joi
        .object({
          // instagram: joi.string().required(formats.includes('INSTAGRAM')),
        })
        .required(false)
        .unknown(true),
    })
    .unknown(true)
    .required();
  return validateSchema(validation);
};

export const OpenEventAction = ({ event }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const path = `events/${event.id}/participants`;
    await firebase
      .database()
      .ref(path)
      .push({ ...data, status: ParticipantStatus.Unverified });
    setLoading(false);
    setSubmitted(true);
  };

  const accountFields = getFields(event.steps);

  return (
    <div>
      <If
        condition={submitted}
        then={() => (
          <div>
            <Typography.Title level={2} style={{ marginTop: 60, marginBottom: 8 }}>
              🙌 Welcome to the game!
            </Typography.Title>
            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 48 }}>
              Your submission was recorded.
            </Typography.Title>
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
        )}
        else={() => (
          <Fragment>
            <Typography.Title level={2} style={{ marginTop: 60, marginBottom: 8 }}>
              👋 How to participate?
            </Typography.Title>
            <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 48 }}>
              Follow the steps below and enter the required information!
            </Typography.Title>
            <div className={styles.formContainer}>
              <Spin
                indicator={<CustomSpinner size={32} />}
                spinning={loading}
                style={{ top: '44%' }}
              >
                <Steps current={currentStep} onChange={setCurrentStep} direction="vertical">
                  {event.steps.map((step, index) => {
                    return (
                      <Step
                        title={stepFormatDictionary[_.last(step.format) as StepFormat]}
                        disabled={index > currentStep}
                        description={
                          <div>
                            <Typography.Paragraph
                              style={{
                                maxWidth: 600,
                                lineHeight: 1.6,
                                opacity: index > currentStep ? 0.5 : 1,
                              }}
                            >
                              {step.description}
                            </Typography.Paragraph>

                            <If
                              condition={currentStep === index}
                              then={() => (
                                <Space
                                  direction="horizontal"
                                  size={8}
                                  style={{ marginTop: 4, marginBottom: 18 }}
                                >
                                  <Button
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    type="primary"
                                    size="large"
                                  >
                                    Step Completed
                                  </Button>
                                  {step.link && (
                                    <a href={step.link} target="_blank" rel="noreferrer">
                                      <Button type="default" size="large">
                                        Visit
                                      </Button>
                                    </a>
                                  )}
                                </Space>
                              )}
                            />
                          </div>
                        }
                        key={step.id}
                      />
                    );
                  })}
                </Steps>
                <Form
                  onSubmit={onSubmit}
                  validator={createValidator(event.steps)}
                  preventPrompt={true}
                  isLoading={false}
                  initialValues={{ accounts: {} }}
                >
                  {({ valid, touched, values }): ReactElement => (
                    <Fragment>
                        {/*<input type="hidden" value="prayer" />*/}
                      <If
                        condition={accountFields.length > 0 && currentStep === event.steps.length}
                        then={() => (
                          <div>
                            {/*<Divider />*/}
                            <Typography.Title level={5} style={{ marginTop: 20 }}>
                              Social Accounts
                            </Typography.Title>
                            <Typography.Paragraph style={{ marginTop: -8 }}>
                              We will verify that you completed the steps above.
                            </Typography.Paragraph>
                            {accountFields}
                          </div>
                        )}
                      />

                      <If
                        condition={currentStep === event.steps.length}
                        then={() => (
                          <div>
                            {/*<Divider style={{ marginTop: 44 }}/>*/}
                            <Typography.Title level={5} style={{ marginTop: 34 }}>
                              Personal Details
                            </Typography.Title>
                            <Typography.Paragraph style={{ marginTop: -8 }}>
                              This is where we send the prize in case you win.
                            </Typography.Paragraph>
                            <Field
                              name="name"
                              component={Input}
                              type="text"
                              label="Full Name"
                              placeholder="John Doe"
                              autoComplete="off"
                            />
                            <Field
                              name="email"
                              component={Input}
                              type="text"
                              label="E-mail Address"
                              placeholder="sample@email.com"
                              autoComplete="new-password"
                            />
                            <Button
                              disabled={!valid || !touched}
                              type="primary"
                              // block
                              size="large"
                              htmlType="submit"
                            >
                              Submit
                            </Button>
                          </div>
                        )}
                      />
                    </Fragment>
                  )}
                </Form>
              </Spin>
            </div>
          </Fragment>
        )}
      />
    </div>
  );
};

export default OpenEventAction;
