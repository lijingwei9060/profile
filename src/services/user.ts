import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('http://127.0.0.1:7001/api/user');
}

export async function queryCurrent(): Promise<any> {
  return request('http://127.0.0.1:7001/api/user/access/current');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
