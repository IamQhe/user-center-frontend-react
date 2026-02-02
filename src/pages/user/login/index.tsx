import {Footer} from '@/components';
import {login, register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  ShareAltOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm, ProFormInstance,
  ProFormText,
} from '@ant-design/pro-components';
import {Helmet, useModel} from '@umijs/max';
import {Alert, App, Tabs} from 'antd';
import {createStyles} from 'antd-style';
import React, {useRef, useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Login: React.FC = () => {
  const [result, setResult] = useState<string>("ok")
  const [type, setType] = useState<string>('login');
  const {initialState, setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const {message} = App.useApp();
  // @ts-ignore
  const formRef = useRef<ProFormInstance>();

  const fetchUserInfo = async () => {
    const res = await initialState?.fetchUserInfo?.();
    if (res) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          loginUser: res,
        }));
      });
    }
  };
  // 登录提交按钮
  const handleLoginSubmit = async (values: API.LoginRequest) => {
    try {
      // 登录
      const res = await login({
        ...values,
      });
      if (res) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        window.location.href = urlParams.get('redirect') || '/';
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  // 注册提交按钮
  const handleRegisterSubmit = async (values: API.RegisterRequest) => {
    try {
      // 登录
      const res = await register({
        ...values,
      });
      if (res) {
        const defaultLoginSuccessMessage = '注册成功！';
        message.success(defaultLoginSuccessMessage);
        formRef.current.resetFields();
        setType('login');
        return;
      }
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>
          {type === 'login' ? '登录' : '注册'}
          {Settings.title && ` - ${Settings.title}`}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >

        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg"/>}
          title="用户中心"
          formRef={formRef}
          subTitle={'我登楼观百川，入海即入我怀'}
          onFinish={async (values) => {
            if (type === 'login') {
              await handleLoginSubmit(values as API.LoginRequest);
            } else if (type === 'register') {
              await handleRegisterSubmit(values as API.RegisterRequest);
            }
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'login',
                label: '登录',
              },
              {
                key: 'register',
                label: '注册',
              },
            ]}
          />

          {result !== 'ok' && type === 'login' && (
            <LoginMessage content= {result}/>
          )}
          {type === 'login' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder= '请输入用户名'
                rules={[
                  {
                    required: true,
                    message: '账号不能为空！',
                  },
                  {
                    min: 3,
                    message: '账号不小于3位'
                  },
                  {
                    max: 16,
                    message: '账号不超过16位'
                  },
                  {
                    pattern: /^[A-Za-z0-9_]+$/,
                    message: '账号只能包含字母、数字和下划线',
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder='请输入密码'
                rules={[
                  {
                    required: true,
                    message: '密码不能为空！',
                  },
                  {
                    min: 6,
                    message: '密码不能小于6位数！',
                  },
                  {
                    max: 16,
                    message: '密码不能超过16位数！',
                  },
                ]}
              />
            </>
          )}

          {result !== 'ok' && type === 'register' && (
            <LoginMessage content={result} />
          )}
          {type === 'register' && (
            <>
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入账号'}
                rules={[
                  {
                    required: true,
                    message: '账号不能为空！',
                  },
                  {
                    min: 3,
                    message: '账号不小于3位'
                  },
                  {
                    max: 16,
                    message: '账号不超过16位'
                  },
                  {
                    pattern: /^[A-Za-z0-9_]+$/,
                    message: '账号只能包含字母、数字和下划线',
                  }
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码不能为空！',
                  },
                  {
                    min: 6,
                    message: '密码不能小于6位数！',
                  },
                  {
                    max: 16,
                    message: '密码不能超过16位数！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入确认密码'}
                rules={[
                  {
                    required: true,
                    message: '确认密码不能为空！',
                  },
                  {
                    min: 6,
                    message: '确认密码不能小于6位数！',
                  },
                  {
                    max: 16,
                    message: '确认密码不能超过16位数！',
                  },
                ]}
              />
              <ProFormText
                name="invitationCode"
                fieldProps={{
                  size: 'large',
                  prefix: <ShareAltOutlined/>,
                }}
                placeholder={'请输入邀请码'}
                rules={[
                  {
                    required: true,
                    message: '邀请码是必填项！',
                  },
                ]}
              />
            </>
          )}

        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Login;
