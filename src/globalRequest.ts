import {extend} from "umi-request";
import {message} from "antd";
import {history} from "@umijs/max";
import {stringify} from "@ant-design/pro-utils";

const request = extend({
  credentials: 'include', // 保持不同请求的 sessionId 一致，维持登录态
  prefix: "http://localhost:8080",
})

/**
 * 请求路径
 */


/**
 * 全局请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  console.log(`request url: ${url}`);

  return {
    url,
    options: {
      ...options,
      headers: {...options.headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    },
  };
})

/**
 * 全局请求拦截器
 */
request.interceptors.response.use( async (response, options): Promise<any> => {
  const res = await response.clone().json();
  if (res.code === 200) {
    return res.data;
  }
  if (res.code === 40100) {
    message.error("请先登录");
    history.replace({
      pathname: "/user/login",
      search: stringify({
        redirect: location.pathname,
      })
    })
  }else {
    message.error(res.description)
  }
  return res.data;
})

export default request;
