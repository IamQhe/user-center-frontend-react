import {removeRule, userList} from '@/services/ant-design-pro/api';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Drawer, Input, message } from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import CreateForm from '@/pages/admin/user/components/CreateForm';
import UpdateForm from '@/pages/admin/user/components/UpdateForm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.CurrentUser>();
  const [selectedRowsState, setSelectedRows] = useState<API.CurrentUser[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const [messageApi, contextHolder] = message.useMessage();
  const { run: delRun, loading } = useRequest(removeRule, {
    manual: true,
    onSuccess: () => {
      setSelectedRows([]);
      actionRef.current?.reloadAndRest?.();
      messageApi.success('Deleted successfully and will refresh soon');
    },
    onError: () => {
      messageApi.error('Delete failed, please try again');
    },
  });
  const columns: ProColumns<API.CurrentUser>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      valueType: 'text',
    },
    {
      title: '用户账号',
      dataIndex: 'userAccount',
      sorter: true,
      hideInForm: true,
    },
    {
      title: '用户头像',
      dataIndex: 'userAvatarUrl',
      hideInSearch: true,
      hideInForm: true,
      render: (dom, entity) => {
        return (
          <img src={entity.userAvatarUrl}/>
        )
      }
    },
    {
      title: '用户身份',
      dataIndex: 'userRole',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '普通用户',
          status: 'Default',
        },
        1: {
          text: '管理员',
          status: 'Processing',
        },
      },
    },
    {
      title: '用户状态',
      dataIndex: 'userStatus',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '停用',
          status: 'Default',
        },
        1: {
          text: '启用',
          status: 'Processing',
        },
      },
    },
    {
      title: '用户性别',
      dataIndex: 'userGender',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '女',
        },
        1: {
          text: '男',
        },
      },
    },
    {
      title: '用户邮箱',
      dataIndex: 'userEmail',
      valueType: 'text',
    },
    {
      title: '用户手机号',
      dataIndex: 'userPhone',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '起始创建时间',
      dataIndex: 'startCreateTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '结束创建时间',
      dataIndex: 'endCreateTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '起始更新时间',
      dataIndex: 'startUpdateTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '结束更新时间',
      dataIndex: 'endUpdateTime',
      valueType: 'dateTime',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <UpdateForm
          trigger={<a>配置</a>}
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
        />,
        <a key="subscribeAlert" href="https://procomponents.ant.design/">
          订阅警报
        </a>,
      ],
    },
  ];

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = useCallback(
    async (selectedRows: API.CurrentUser[]) => {
      if (!selectedRows?.length) {
        messageApi.warning('请选择删除项');
        return;
      }
      await delRun({
        data: {
          key: selectedRows.map((row) => row.userId),
        },
      });
    },
    [delRun, messageApi.warning],
  );
  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [<CreateForm key="create" reload={actionRef.current?.reload} />]}
        request={userList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计{' '}
                {selectedRowsState.reduce((pre, item) => pre + (item.callNo ?? 0), 0)} 万
              </span>
            </div>
          }
        >
          <Button
            loading={loading}
            onClick={() => {
              handleRemove(selectedRowsState);
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.CurrentUser>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
