import { Form } from '../Form/Form';
import _ from 'lodash-es';
import React, { Fragment, ReactElement, useState } from 'react';
import { Field } from 'react-final-form';
import Input, { TextArea } from '../Form/Input';
import DatePicker from '../Form/DatePicker';
import { RestorablePrizesField } from '../PrizesField';
import { RestorableStepsField } from '../StepsField';
import { Button, Col, Row, Space, Typography } from 'antd';
import { joi } from '../../lib/joi';
import { validateSchema } from '../Form/validation';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase';
import { URL_ADMIN_EVENT_DETAIL, URL_ADMIN_EVENT_LIST } from '../../urls';
import { RaffleEvent } from '../../interfaces/events';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { SectionTitle } from '../SectionTitle';

const validation = joi
  .object({
    name: joi.string().required(),
    description: joi.string().required(),
    starts_at: joi.number().required(),
    finishes_at: joi.number().required(),
    announced_at: joi.number().required(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(validation);

interface Props {
  event?: RaffleEvent;
}

export const EditEventForm = ({ event }: Props) => {
  const history = useHistory();
  const profile = useSelector((state: RootState) => state.firebase.profile);
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values: any) => {
    setSubmitting(true);
    const eventId = event?.id || uuidv4();
    const organiser = event?.organiser || {
      name: profile.name,
    };

    const final = {
      id: eventId,
      organiser,
      organiser_id: auth.uid,
      ..._.omit(values, ['announcedAt', 'startsAt', 'finishesAt']),
      prizes: _.filter(values.prizes, (prize) => !prize.toDelete).map((prize) => ({
        ...prize,
        id: prize.id || uuidv4(),
        count: parseInt(prize.count),
      })),
    };

    const path = `events/${eventId}`;
    await firebase.database().ref(path).update(final);

    history.push(URL_ADMIN_EVENT_DETAIL.replace(':eventId', eventId));
    setSubmitting(false);
  };

  return (
    <Fragment>
      <Form
        onSubmit={onSubmit}
        validator={validator}
        preventPrompt={true}
        isLoading={false}
        initialValues={{ steps: [], prizes: [], ..._.omit(event, ['winners', 'participant']) }}
      >
        {({ valid, pristine, values }): ReactElement => (
          <Fragment>
            <Typography.Title level={2}>General Information</Typography.Title>
            <Field
              name="name"
              component={Input}
              type="text"
              label="Event Name"
              placeholder="Happy Summer Raffle"
            />
            <Field
              name="description"
              component={TextArea}
              type="text"
              label="Description"
              style={{ height: 280 }}
            />
            <Row gutter={24}>
              <Col span={8}>
                <Field
                  name="starts_at"
                  component={DatePicker}
                  type="text"
                  label="Starting Date"
                  showTime={{ format: 'HH:mm' }}
                />
              </Col>
              <Col span={8}>
                <Field
                  name="finishes_at"
                  component={DatePicker}
                  type="text"
                  label="Closing Date"
                  showTime={{ format: 'HH:mm' }}
                />
              </Col>
              <Col span={8}>
                <Field
                  name="announced_at"
                  component={DatePicker}
                  type="text"
                  label="Announcement Date"
                  showTime={{ format: 'HH:mm' }}
                />
              </Col>
            </Row>
            <Typography.Title level={2} style={{ marginTop: 30 }}>
              Prizes
            </Typography.Title>
            <RestorablePrizesField
              name="prizes"
              addLabel={'Add new prize'}
              modalTitle={'Add new prize'}
            />
            <Typography.Title level={2} style={{ marginTop: 30 }}>
              Required steps
            </Typography.Title>
            <RestorableStepsField
              name="steps"
              addLabel={'Add new step'}
              modalTitle={'Add new step'}
            />
            <Space direction="horizontal" size={16} style={{ marginTop: 36 }}>
              <Button
                type="primary"
                htmlType="submit"
                disabled={!valid || pristine}
                size="large"
                loading={submitting}
              >
                Submit
              </Button>
              <Link
                to={
                  event
                    ? URL_ADMIN_EVENT_DETAIL.replace(':eventId', event.id)
                    : URL_ADMIN_EVENT_LIST
                }
              >
                <Button size="large" type="default">
                  Cancel
                </Button>
              </Link>
            </Space>
          </Fragment>
        )}
      </Form>
    </Fragment>
  );
};
