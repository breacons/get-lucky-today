import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';


type PageTitleProps = {
  title: string;
};

const ORG_BENEFITS = 'Get Lucky • Today';
export function PageTitle({ title }: PageTitleProps) {
  return (
    <Helmet>
      <title>{title} - {ORG_BENEFITS}</title>
    </Helmet>
  );
}

export default function Header(): ReactElement {
  return (
    <Helmet titleTemplate={`%s - ${ORG_BENEFITS}`} defaultTitle={ORG_BENEFITS}>
      <meta charSet="utf-8" />
      <title>{ORG_BENEFITS}</title>
    </Helmet>
  );
}