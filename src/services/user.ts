import request from '@/utils/request';
import defaultSettings from '../../config/defaultSettings';
export async function query(): Promise<any> {
  return request(`${defaultSettings.serverUrl}/api/user`);
}

export async function queryCurrent(): Promise<any> {
  return request(`${defaultSettings.serverUrl}/api/user/access/current`);
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
