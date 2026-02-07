// @ts-ignore
/* eslint-disable */
import request from "@/globalRequest"
import BaseResponse = API.BaseResponse;

/** 获取当前的用户 GET /api/user/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: BaseResponse<API.CurrentUser>;
  }>('/api/user/currentUser', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/user/logout */
export async function outLogin(options?: { [key: string]: any }) {
  return request<BaseResponse<undefined>>('/api/user/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/user/login */
export async function login(body: API.LoginRequest, options?: { [key: string]: any }) {
  return request<BaseResponse<API.CurrentUser>>('/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 注册接口 POST /api/user/register */
export async function register(body: API.RegisterRequest, options?: { [key: string]: any }) {
  return request<BaseResponse<API.RegisterResponse>>('/api/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户列表接口 POST /api/user/admin/search */
export async function searchUserList(body: API.UserQueryRequest, options?: { [key: string]: any }) {
  return request<BaseResponse<API.CurrentUser[]>>('/api/user/admin/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function userList(body: API.UserQueryRequest, options?: { [key: string]: any }) {
  const users = await searchUserList(body, options);
  return {
    data: users,
  }
}

/** 更新用户接口 POST /api/user/admin/update */
export async function updateUser(body: API.UserListItem, options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/api/user/admin/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户接口 POST /api/user/admin/delete */
export async function removeUser(body: API.UserListItem,options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/api/user/admin/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

/** 删除用户接口 POST /api/user/admin/deleteList */
export async function batchRemoveUser(body: API.BatchRemoveUserRequest,options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/api/user/admin/batchDelete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

/** 修改用户状态 POST /api/user/admin/switchStatus */
export async function switchStatus(body: API.SwitchStatusRequest,options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/api/user/admin/switchStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

/** 批量修改用户状态 POST /api/user/admin/batchSwitchStatus */
export async function batchSwitchStatus(body: API.BatchSwitchStatusRequest,options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/api/user/admin/batchSwitchStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

/** 重置用户密码 POST /api/user/resetPassword */
export async function resetPassword(body: API.ResetPasswordRequest,options?: { [key: string]: any }) {
  return request<BaseResponse<boolean>>('/api/user/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    },
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    },
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    },
  });
}
