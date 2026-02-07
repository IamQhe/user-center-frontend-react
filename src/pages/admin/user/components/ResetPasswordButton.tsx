import { resetPassword } from '@/services/ant-design-pro/api';
import { useRequest } from '@umijs/max';
import { Button, Modal, message } from 'antd';
import React, { useCallback, useState, useRef } from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-components';

interface ResetPasswordButtonProps {
  userId: number | string;
  onSuccess?: () => void;
  buttonText?: string;
  buttonProps?: any;
  children?: React.ReactNode;
}

const ResetPasswordButton: React.FC<ResetPasswordButtonProps> = ({
                                                                   userId,
                                                                   onSuccess,
                                                                   buttonText = '重置密码',
                                                                   buttonProps,
                                                                   children
                                                                 }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [modalVisible, setModalVisible] = useState(false);
  const formRef = useRef<ProFormInstance>();

  // 重置密码请求
  const { run: doResetPassword, loading } = useRequest(resetPassword, {
    manual: true,
    onSuccess: () => {
      messageApi.success('密码重置成功');
      setModalVisible(false);
      formRef.current?.resetFields();
      onSuccess?.();
    },
    onError: (error) => {
      messageApi.error(error.message || '密码重置失败');
    },
  });

  // 打开弹窗
  const handleOpenModal = useCallback(() => {
    formRef.current?.resetFields();
    setModalVisible(true);
  }, []);

  // 关闭弹窗
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    formRef.current?.resetFields();
  }, []);

  // 表单提交处理
  const handleFormSubmit = useCallback(async (values: any) => {
    // 调用重置密码接口
    await doResetPassword({
      userId,
      password: values.newPassword,
      checkPassword: values.confirmPassword,
    });
  }, [userId, doResetPassword]);

  return (
    <>
      {contextHolder}
      {children ? (
        React.cloneElement(children as React.ReactElement, {
          onClick: handleOpenModal,
          loading,
          ...buttonProps,
        })
      ) : (
        <Button
          type="primary"
          onClick={handleOpenModal}
          loading={loading}
          {...buttonProps}
        >
          {buttonText}
        </Button>
      )}

      <Modal
        title="重置密码"
        open={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={400}
      >
        <ProForm
          formRef={formRef}
          layout="horizontal"
          onFinish={handleFormSubmit}
          submitter={{
            searchConfig: {
              submitText: '确认重置',
            },
            resetButtonProps: {
              onClick: handleCloseModal,
              children: '取消',
            },
            submitButtonProps: {
              loading,
            },
          }}
        >
          <ProFormText.Password
            name="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            fieldProps={{
              autoComplete: 'new-password',
            }}
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' },
              { max: 16, message: '密码长度不能超过16位' },
            ]}
          />

          <ProFormText.Password
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            fieldProps={{
              autoComplete: 'new-password',
            }}
            rules={[
              { required: true, message: '请确认密码' },
              { min: 6, message: '确认密码长度不能小于6位' },
              { max: 16, message: '确认密码长度不能超过16位' },
            ]}
          />
        </ProForm>
      </Modal>
    </>
  );
};

export default ResetPasswordButton;
