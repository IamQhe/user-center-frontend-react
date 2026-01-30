import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright="Powered by Ant Desgin"
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/IamQhe',
          blankTarget: true,
        },
        {
          key: 'IamQhe',
          title: 'IamQhe',
          href: 'https://github.com/IamQhe',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
