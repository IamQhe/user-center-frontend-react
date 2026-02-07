import { updateUser } from '@/services/ant-design-pro/api';
import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';
import React, { cloneElement, useCallback, useState } from 'react';
import ResetPasswordButton from '@/pages/admin/user/components/ResetPasswordButton';
export type UpdateFormProps = {
  trigger?: React.ReactElement<any>;
  onOk?: () => void;
  values: Partial<API.UserListItem>;
};
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { onOk, values, trigger } = props;
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { run } = useRequest(updateUser, {
    manual: true,
    onSuccess: () => {
      messageApi.success('更新成功');
      onOk?.();
    },
    onError: () => {
      messageApi.error('更新失败，请重试');
    },
  });
  const onCancel = useCallback(() => {
    setOpen(false);
  }, []);
  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const onFinish = useCallback(
    async (values?: any) => {
      const res = await updateUser(values as API.UserListItem);
      if (!res) {
        return;
      }
      onCancel();
      onOk?.();
    },
    [onCancel, run],
  );
  return (
    <>
      {contextHolder}
      {trigger
        ? cloneElement(trigger, {
            onClick: onOpen,
          })
        : null}
      <DrawerForm<API.UserListItem>
        title="修改用户信息"
        autoFocusFirstInput
        open={open}
        layout="horizontal"
        drawerProps={{
          destroyOnClose: true,
          onClose: onCancel,
        }}
        initialValues={values}
        submitTimeout={2000}
        onFinish={onFinish}
        submitter={{
          searchConfig: {
            submitText: '保存修改',
          },
          render: (props, dom) => [
            dom[0],
            <ResetPasswordButton
              key="reset"
              userId={values.userId!}
              buttonText="重置密码"
            />,
            dom[1],
          ],
        }}
      >
        <ProFormText
          name="userId"
          label="用户Id"
          width="md"
          disabled
        />
        <ProFormText
          name="userName"
          label="用户名称"
          width="md"
        />
        <ProFormText
          name="userAccount"
          label="用户账号"
          width="md"
          rules={[
            {
              required: true,
              message: '请输入用户姓名！',
            },
          ]}
        />
        <ProFormSelect
          name="userRole"
          label="用户身份"
          width="md"
          options={[
            {value: 0, label: '普通用户'},
            {value: 1, label: '管理员'},
          ]}
          placeholder="请选择身份"
          rules={[{ required: true, message: '请选择身份' }]}
        />
        <ProFormSelect
          name="userStatus"
          label="用户状态"
          width="md"
          options={[
            {value: 0, label: '停用'},
            {value: 1, label: '启用'},
          ]}
          placeholder="请选择用户状态"
          rules={[{ required: true, message: '请选择用户状态' }]}
        />
        <ProFormSelect
          name="userGender"
          label="用户性别"
          width="md"
          options={[
            {value: 0, label: '女'},
            {value: 1, label: '男'},
          ]}
          placeholder="请选择性别"
        />
        <ProFormText
          name="userEmail"
          label="邮箱"
          width="md"
          rules={[
            {
              type: 'email',
              message: '请输入有效的邮箱地址！',
            },
          ]}
        />
        <ProFormText
          name="userPhone"
          label="手机号"
          width="md"
        />
      </DrawerForm>
    </>
  );
};
export default UpdateForm;
