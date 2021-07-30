import { Button, Layout, LayoutProps } from 'antd';
import React, { PropsWithChildren, useEffect } from 'react';

type Props = LayoutProps;

export function BaseLayout(props: PropsWithChildren<Props>) {
  return <Layout style={{ backgroundColor: 'white' }}>{props.children}</Layout>;
}
