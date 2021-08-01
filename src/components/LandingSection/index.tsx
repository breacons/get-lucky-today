import { Col, Image, Row, Typography } from 'antd';
import classNames from 'classnames';
import React, { Fragment } from 'react';

import styles from './styles.module.less';

interface Props {
  title: string;
  description: string | any;
  image: string;
  reversed?: boolean;
  inverted?: boolean;
}

export const LandingSection = ({ title, description, image, reversed }: Props) => {
  const Title = (
    <Typography.Title level={2} className={styles.title}>
      {title}
    </Typography.Title>
  );
  const Description = (
    <Typography.Paragraph className={styles.description}>{description}</Typography.Paragraph>
  );

  const TextSection = (
    <Fragment>
      {Title}
      {Description}
    </Fragment>
  );
  const ImageSection = <Image src={image} preview={false} className={styles.image} />;

  return (
    <Row gutter={24} className={classNames([styles.row])}>
      <Col md={12} sm={24} className={styles.column}>
        {reversed ? TextSection : ImageSection}
      </Col>
      <Col md={12} sm={24} className={styles.column}>
        {reversed ? ImageSection : TextSection}
      </Col>
    </Row>
  );
};
