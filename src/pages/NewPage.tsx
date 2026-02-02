import React from "react";
import {PageContainer} from "@ant-design/pro-components";
import {useModel} from 'umi';
import {Card} from "antd";
import exports from "@umijs/bundler-webpack/compiled/webpack";
import require = exports.RuntimeGlobals.require;

const NewPage: React.FC = () => {
  const {initialState} = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  console.log(currentUser);
  // 在代码中添加调试
  return (
    <PageContainer content={'新页面'}>
    </PageContainer>
  )
}
export default NewPage;
