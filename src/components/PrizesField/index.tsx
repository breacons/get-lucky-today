import { Col, Modal, Row } from 'antd';
import { ModalProps } from 'antd/es/modal';
import React, { ReactElement } from 'react';
import { Field, useField } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { GiftCard } from '../../interfaces/blinksky';
import { selectGiftCardEntities } from '../../redux/blinksky';
// import { NaturalPerson } from '../../../interface';
// import { UserName } from '../../../locale';
import EditableTable from '../EditableTable';
import Form from '../Form';
import Input from '../Form/Input';
import Select, { Option } from '../Form/Select';
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
    value: joi.number().required(),
    count: joi.number().min(1).required(),
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

export const PrizesField = ({ name, addLabel }: Props) => {
  // const giftCards = useSelector(selectGiftCards);

  // const intl = useIntl();
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
const EditPrizeModal = ({ onSubmit, name, index, ...restProps }: EditContactModalProps) => {
  const field = useField(`${name}[${index}]`);
  const initialValue = { ...field.input.value };

  const giftCards = useSelector(selectGiftCardEntities);

  const getSelectedGiftCard = (code: string) =>
    giftCards.find((card) => card.code === code) as GiftCard;

  return (
    <Form
      onSubmit={(values: any) => {
        field.input.onChange({ ...values, card: getSelectedGiftCard(values.card) });
        onSubmit(values);
      }}
      key="edit-contact"
      validator={validator}
      initialValues={{ ...field.input.value, card: field.input.value?.card?.code }}
    >
      {({ valid, dirty, form, values }) => (
        <Modal
          {...restProps}
          onOk={() => form.submit()}
          okText={<FormattedMessage defaultMessage="Mentés" />}
          okButtonProps={{
            disabled: !dirty || !valid,
          }}
          cancelButtonProps={{ type: 'default' }}
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
                  name="card"
                  label={'Gift Card'}
                  component={Select}
                  type="text"
                  onSelect={(value: any) => {
                    return giftCards.find((card) => card.code === value);
                  }}
                >
                  {giftCards.map((card) => (
                    <Option value={card.code} key={card.code}>
                      {card.caption}
                    </Option>
                  ))}
                </Field>
                <Field
                  name="value"
                  component={Select}
                  type="number"
                  placeholder="100"
                  label="Card Value"
                  disabled={!values.card}
                >
                  {values.card
                    ? getSelectedGiftCard(values?.card)
                        .value.split(',')
                        .map((cardValue: string) => (
                          <Option value={cardValue} key={cardValue}>
                            ${cardValue}
                          </Option>
                        ))
                    : null}
                </Field>
                <Field
                  name="count"
                  component={Input}
                  type="number"
                  placeholder="1"
                  label="Count"
                  defaultValue={1}
                  min={1}
                />
              </Col>
            </Row>
          </React.Fragment>
        </Modal>
      )}
    </Form>
  );
};

export const RestorablePrizesField = ({
  name,
  addLabel,
  modalTitle,
  ...rest
}: RestorableContactsFieldProps) => {
  const columns = [
    {
      title: 'Count',
      key: 'count',
      dataIndex: 'count',
      // eslint-disable-next-line react/display-name
      render: (text: string) => (text ? `${text}x` : ''),
    },
    {
      title: 'Title',
      key: 'title',
      dataIndex: 'card',
      // eslint-disable-next-line react/display-name
      render: (card: GiftCard) => (card ? `${card?.caption} Card` : ''),
    },
    {
      title: 'Value',
      key: 'value',
      dataIndex: 'value',
      // eslint-disable-next-line react/display-name
      render: (text: string) => (text ? `$${text}` : ''),
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
      createComponent={EditPrizeModal}
      {...rest}
    />
  );
};

export default PrizesField;
