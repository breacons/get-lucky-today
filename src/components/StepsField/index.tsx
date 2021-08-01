import { Col, Modal, Row } from 'antd';
import { ModalProps } from 'antd/es/modal';
import _ from 'lodash-es';
import React, { ReactElement } from 'react';
import { Field, useField } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import { StepFormat } from '../../interfaces/events';
import EditableTable from '../EditableTable';
import Form from '../Form';
import Cascader from '../Form/Cascader';
import Input, { TextArea } from '../Form/Input';
import joi, { validateSchema } from '../Form/validation';
import RestorableEditableTable from '../RestorableEditableTable';
import { EditableListProps } from '../RestorableEditableTable/RestorableEditableTable';

interface Props {
  name: string;
  addLabel: React.ReactNode;
}

interface RestorableContactsFieldProps extends Partial<EditableListProps<any>> {
  name: string;
  addLabel: ReactElement | string;
  modalTitle: ReactElement | string;
}
const prizeSchema = joi
  .object({
    description: joi.string().required(),
    format: joi.array().required(),
    link: joi.string(),
    // format: joi.string().required(),
    // link: joi.string(),
  })
  .unknown(true)
  .required();
const validator = validateSchema(prizeSchema);
// const messages = defineMessages({
//   name: 'Név',
//   nameValue: '{lastName} {firstName}',
//   lastNamePlaceholder: 'Kovács',
//   lastNameLabel: 'Vezetéknév',
//   firstNamePlaceholder: 'András',
//   firstNameLabel: 'Keresztnév',
//   emailPlaceholder: 'andras.kovacs@bekkinsurance.com',
//   emailLabel: 'Email cím',
//   phonePlaceholder: '+36 12 345 6789',
//   phoneLabel: 'Telefonszám',
// });

export const StepsField = ({ name, addLabel }: Props) => {
  return (
    <EditableTable name={name} addLabel={addLabel}>
      <Field name="value" component={Input} type="number" placeholder="100" label="Value" />
      <Field name="count" component={Input} type="number" placeholder="3" label="Count" />
    </EditableTable>
  );
};

interface EditContactModalProps extends Partial<ModalProps> {
  onSubmit: (values?: any) => void;
  name: string;
  index: number;
}

const options = [
  {
    value: 'INSTAGRAM',
    label: 'Instagram',
    children: [
      {
        value: 'SHARE',
        label: 'Share',
        children: [
          {
            value: StepFormat.INSTAGRAM_SHARE_POST_IN_STORY,
            label: 'Share Post in Story',
          },
          {
            value: StepFormat.INSTAGRAM_SHARE_POST_IN_POST,
            label: 'Repost in Feed',
          },
        ],
      },
      {
        value: 'REACT',
        label: 'React',
        children: [
          {
            value: StepFormat.INSTAGRAM_REACT_TO_STORY,
            label: 'React to Story',
          },
          {
            value: StepFormat.INSTAGRAM_LIKE_POST,
            label: 'Like Post',
          },
          {
            value: StepFormat.INSTAGRAM_COMMENT_POST,
            label: 'Comment Post',
          },
        ],
      },
      {
        value: 'FOLLOW',
        label: 'Follow',
        children: [
          {
            value: StepFormat.INSTAGRAM_FOLLOW,
            label: 'Follow Account',
          },
        ],
      },
    ],
  },
  {
    value: 'FACEBOOK',
    label: 'Facebook',
    children: [
      {
        value: 'SHARE',
        label: 'Share',
        children: [
          {
            value: StepFormat.FACEBOOK_SHARE_POST,
            label: 'Share Post',
          },
          {
            value: StepFormat.FACEBOOK_SHARE_PAGE,
            label: 'Share Page',
          },
        ],
      },
      {
        value: 'REACT',
        label: 'React',
        children: [
          {
            value: StepFormat.FACEBOOK_LIKE_POST,
            label: 'Like Post',
          },
          {
            value: StepFormat.FACEBOOK_COMMENT_POST,
            label: 'Comment Post',
          },
        ],
      },
      {
        value: 'FOLLOW',
        label: 'Follow',
        children: [
          {
            value: StepFormat.FACEBOOK_LIKE_PAGE,
            label: 'Follow Page',
          },
        ],
      },
    ],
  },
  {
    value: 'TWITTER',
    label: 'Twitter',
    children: [
      {
        value: 'SHARE',
        label: 'Share',
        children: [
          {
            value: StepFormat.TWITTER_SHARE_RETWEET,
            label: 'Retweet Post',
          },
        ],
      },
      {
        value: 'REACT',
        label: 'React',
        children: [
          {
            value: StepFormat.TWITTER_LIKE_POST,
            label: 'Like Post',
          },
          {
            value: StepFormat.TWITTER_COMMENT_POST,
            label: 'Comment Post',
          },
        ],
      },
      {
        value: 'FOLLOW',
        label: 'Follow',
        children: [
          {
            value: StepFormat.TWITTER_FOLLOW,
            label: 'Follow Page',
          },
        ],
      },
    ],
  },
];

const EditStepModal = ({ onSubmit, name, index, ...restProps }: EditContactModalProps) => {
  const field = useField(`${name}[${index}]`);
  const initialValue = { ...field.input.value };

  return (
    <Form
      onSubmit={(values: any) => {
        const final = {
          ...values,
          id: values.id || uuidv4(),
        };
        field.input.onChange(final);
        onSubmit(final);
      }}
      key="edit-contact"
      validator={validator}
      initialValues={{ format: [], ...field.input.value }}
    >
      {({ valid, dirty, form }) => (
        <Modal
          {...restProps}
          onOk={() => form.submit()}
          okText={<FormattedMessage defaultMessage="Mentés" />}
          okButtonProps={{
            disabled: !dirty || !valid,
          }}
          cancelText={<FormattedMessage defaultMessage="Mégsem" />}
          onCancel={() => {
            // on cancel return the original received value
            // if the initialvalue is not valid it's a new contact
            // if the initialvalue is valid it's update phase
            if (validator(initialValue) !== null) {
              onSubmit();
              return;
            }
            onSubmit(initialValue);
          }}
        >
          <React.Fragment>
            <Row gutter={16}>
              <Col span={24}>
                <Field
                  name="format"
                  component={Cascader}
                  type="text"
                  label="Step Format"
                  options={options}
                  displayRender={(label: any) => {
                    return label.join(' - ');
                  }}
                />
                <Field
                  name="description"
                  component={TextArea}
                  type="text"
                  placeholder="Explain what the participants have to do to complete this step."
                  label="Description"
                  style={{ height: 100 }}
                />

                <Field
                  name="link"
                  component={Input}
                  type="text"
                  placeholder="https://www.instagram.com/p/123456"
                  label="Link (Optional)"
                />
              </Col>
            </Row>
          </React.Fragment>
        </Modal>
      )}
    </Form>
  );
};

/*
  INSTAGRAM_SHARE_POST_IN_STORY = 'INSTAGRAM_SHARE_POST_IN_STORY',
  INSTAGRAM_SHARE_POST_IN_POST = 'INSTAGRAM_SHARE_POST_IN_POST',
  INSTAGRAM_LIKE_POST = 'INSTAGRAM_LIKE_POST',
  INSTAGRAM_COMMENT_POST = 'INSTAGRAM_COMMENT_POST',
  INSTAGRAM_REACT_TO_STORY = 'INSTAGRAM_REACT_TO_STORY',
  INSTAGRAM_FOLLOW = 'INSTAGRAM_FOLLOW',
  TWITTER_FOLLOW = 'TWITTER_FOLLOW',
  TWITTER_LIKE_POST = 'TWITTER_LIKE_POST',
  TWITTER_COMMENT_POST = 'TWITTER_COMMENT_POST',
  TWITTER_SHARE_RETWEET = 'TWITTER_SHARE_RETWEET',
  FACEBOOK_LIKE_PAGE = 'FACEBOOK_LIKE_PAGE',
  FACEBOOK_LIKE_POST = 'FACEBOOK_LIKE_POST',
  FACEBOOK_COMMENT_POST = 'FACEBOOK_COMMENT_POST',
  FACEBOOK_SHARE_POST = 'FACEBOOK_SHARE_POST',
  FACEBOOK_SHARE_PAGE = 'FACEBOOK_SHARE_PAGE',
  EMAIL_SIGN_UP = 'EMAIL_SIGN_UP',
 */

export const stepFormatDictionary = {
  [StepFormat.INSTAGRAM_SHARE_POST_IN_STORY]: 'Share in Story on Instagram',
  [StepFormat.INSTAGRAM_SHARE_POST_IN_POST]: 'Share in Post on Instagram',
  [StepFormat.INSTAGRAM_LIKE_POST]: 'Like Our Post on Instagram',
  [StepFormat.INSTAGRAM_COMMENT_POST]: 'Comment Post on Instagram',
  [StepFormat.INSTAGRAM_REACT_TO_STORY]: 'React to Story on Instagram',
  [StepFormat.INSTAGRAM_FOLLOW]: 'Follow Us on Instagram',
  [StepFormat.TWITTER_FOLLOW]: 'Follow Us on Twitter',
  [StepFormat.TWITTER_LIKE_POST]: 'Like Post on Twitter',
  [StepFormat.TWITTER_COMMENT_POST]: 'Comment Post on Twitter',
  [StepFormat.TWITTER_SHARE_RETWEET]: 'Retweet Post on Twitter',
  [StepFormat.FACEBOOK_LIKE_PAGE]: 'Follow Us on Facebook',
  [StepFormat.FACEBOOK_LIKE_POST]: 'Like Post on Facebook',
  [StepFormat.FACEBOOK_COMMENT_POST]: 'Comment Post on Facebook',
  [StepFormat.FACEBOOK_SHARE_POST]: 'Share Post on Facebook',
  [StepFormat.FACEBOOK_SHARE_PAGE]: 'Share Us on Facebook',
  [StepFormat.EMAIL_SIGN_UP]: 'Sign Up with E-mail',
};

export const RestorableStepsField = ({
  name,
  addLabel,
  modalTitle,
  ...rest
}: RestorableContactsFieldProps) => {
  const columns = [
    {
      title: 'Format',
      key: 'format',
      dataIndex: 'format',
      render: (format: string[]) => stepFormatDictionary[_.last(format) as StepFormat],
    },
    {
      title: 'Link',
      key: 'link',
      dataIndex: 'link',
      // eslint-disable-next-line react/display-name
      render: (link: string) =>
        link ? (
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        ) : (
          '-'
        ),
    },

    // {
    //   title: intl.formatMessage(messages.emailLabel),
    //   dataIndex: 'email',
    // },
    // {
    //   title: intl.formatMessage(messages.phoneLabel),
    //   dataIndex: 'phone',
    // },
  ];
  return (
    <RestorableEditableTable
      name={name}
      isLoading={false}
      error={null}
      columns={columns}
      getNewItem={() => ({ value: null })}
      locale={{
        createButton: addLabel,
        modalTitle: modalTitle,
      }}
      createComponent={EditStepModal}
      {...rest}
    />
  );
};

export default StepsField;
