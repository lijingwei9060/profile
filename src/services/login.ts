import request from '@/utils/request';
import defaultSettings from '../../config/defaultSettings';

export interface LoginParamsType {
  password: string;
  mobile: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request(`${defaultSettings.serverUrl}/api/user/access/login`, {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
