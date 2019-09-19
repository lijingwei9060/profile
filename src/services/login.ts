import request from '@/utils/request';

export interface LoginParamsType {
  password: string;
  mobile: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request('http://127.0.0.1:7001/api/user/access/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
