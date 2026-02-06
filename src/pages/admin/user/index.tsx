import {
  batchRemoveUser,
  batchSwitchStatus,
  removeUser,
  userList
} from '@/services/ant-design-pro/api';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps
} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {Button, Drawer, Image, message, Modal} from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from '@/pages/admin/user/components/UpdateForm';

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType | null>(null);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserListItem[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const [messageApi, contextHolder] = message.useMessage();
  const columns: ProColumns<API.UserListItem>[] = [
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
      title: '名称',
      dataIndex: 'userName',
      valueType: 'text',
      align: 'center',
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      sorter: true,
      hideInForm: true,
      align: 'center',
    },
    {
      title: '头像',
      dataIndex: 'userAvatarUrl',
      hideInSearch: true,
      hideInForm: true,
      render: (_, entity) => {
        return (
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Image src={entity.userAvatarUrl} width={50}/>
          </div>
        )
      },
      align: 'center',
    },
    {
      title: '身份',
      dataIndex: 'userRole',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '普通用户',
          status: 'processing',
        },
        1: {
          text: '管理员',
          status: 'success',
        },
      },
      align: 'center',
    },
    {
      title: '状态',
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
      align: 'center',
    },
    {
      title: '性别',
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
      align: 'center',
    },
    {
      title: '邮箱',
      dataIndex: 'userEmail',
      valueType: 'text',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      valueType: 'text',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      align: 'center',
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
          trigger={<a>修改</a>}
          key="config"
          onOk={actionRef.current?.reload}
          values={record}
        />,
        <a
          style={{color: '#ff4d4f'}}
          onClick={() => {
            Modal.confirm({
              title: "确定要删除用户 " + record.userAccount + " 吗？",
              content: '删除后数据无法恢复',
              okText: '确定',
              cancelText: '取消',
              onOk: () => handleDelete(record),
              okButtonProps: {danger: true}
            });
          }}
        >
          删除
        </a>
      ],
      align: 'center',
    },
  ];

  /**
   * 操作栏：删除单个用户
   *
   * @param userId
   */
  const handleDelete = async (user: API.UserListItem) => {
    // 根据后端接口调用删除API
    const res = await removeUser(user);
    if (!res) {
      // 删除失败
      message.error('删除失败，请重试');
        return;
      }
      message.success('删除成功');
      // 刷新表格
      if (actionRef.current) {
        actionRef.current.reload();
      }
  };

  /**
   * 底部工具栏：批量删除用户
   *
   * @param users 用户列表
   */
  const handleBatchDelete = async (selectedRows: API.UserListItem[]) => {
    // 选项校验
    if (!selectedRows?.length) {
      messageApi.warning('请选择删除项');
      return;
    }

    // 获取用户id列表
    const userIdList = selectedRows.map(row => row.userId);

    try {
      // 删除用户
      const res = await batchRemoveUser({userIdList});
      // 删除失败
      if (!res) {
        message.error('删除失败，请重试');
        return;
      }
      message.success('删除成功');
      // 刷新表格
      setSelectedRows([]);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } catch (error) {
      message.error('删除过程中出现错误');
      console.error('批量删除失败:', error);
    }
  }

  /**
   * 底部工具栏：批量更改用户状态
   */
  const handlebatchSwitchStatus = async (selectedRows : API.UserListItem[], status: number) => {
    // 列表非空校验
    if (!selectedRows?.length) {
      messageApi.warning('请选择用户');
      return;
    }
    try {
      // 获取用户id列表
      const userIdList = selectedRows.map(row => row.userId);

      // 批量修改用户状态
      const res = await batchSwitchStatus({
        userIdList,
        userStatus: status
      } as API.BatchSwitchStatusRequest);

      // 修改失败
      if (!res) {
        message.error('批量修改失败，请重试');
        return;
      }
      message.success("批量操作成功");
      // 刷新表格
      setSelectedRows([]);
      if (actionRef.current) {
        actionRef.current?.reloadAndRest?.();
      }
    } catch (error) {
      message.error('修改失败，请重试');
      console.error('批量修改用户状态失败:', error);
    }
  }
  return (
    <PageContainer>
      {contextHolder}
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="userId"
        search={{
          labelWidth: 120,
        }}
        request={userList}
        columns={columns}
        columnsState={
          {
            defaultValue: {
              createTime: {show: false},
              updateTime: {show: false},
            }
          }
        }
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
              位用户 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={() => {
              Modal.confirm({
                title: "确定要删除选中的 " + selectedRowsState.length + " 个用户吗？",
                content: '删除后数据无法恢复',
                okText: '确定',
                cancelText: '取消',
                onOk: () => handleBatchDelete(selectedRowsState),
                okButtonProps: {danger: true}
              });
            }}
            danger
          >
            批量删除
          </Button>
          <Button
            onClick={() => {
              console.log(currentRow?.userAvatarUrl)
              Modal.confirm({
                title: "确定要停用选中的 " + selectedRowsState.length + " 个用户吗？",
                okText: '确定',
                cancelText: '取消',
                onOk: () => handlebatchSwitchStatus(selectedRowsState, 0),
                okButtonProps: {danger: true}
              });
            }}
          >
            批量停用
          </Button>
          <Button
            type="primary"
            onClick={() => {
              Modal.confirm({
                title: "确定要启用选中的 " + selectedRowsState.length + " 个用户吗？",
                okText: '确定',
                cancelText: '取消',
                onOk: () => handlebatchSwitchStatus(selectedRowsState, 1),
                okButtonProps: {danger: true}
              });
            }}
          >
            批量启用
          </Button>
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
        {currentRow?.userAccount && (
          <ProDescriptions<API.UserListItem>
            column={2}
            title={"用户：" + currentRow?.userAccount}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.userId,
            }}
            columns={columns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default TableList;
