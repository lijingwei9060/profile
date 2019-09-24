import request from '@/utils/request';
import defaultSettings from '../../../../config/defaultSettings';
import { IUser, IUserParam } from './model';

export async function queryUser(params: IUserParam) {
  return request(`${defaultSettings.serverUrl}/api/user`, {
    params,
  });
}

export async function removeUser(params: IUser) {
  return request(`${defaultSettings.serverUrl}/api/user/${params.id}`, {
    method: 'DELETE',
  });
}

export async function addUser(params: IUser) {
  return request(`${defaultSettings.serverUrl}/api/user`, {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateUser(params: IUser) {
  const id = params.id;
  delete params['id'];
  delete params['password'];
  delete params['role'];
  delete params['createdAt'];
  delete params['key'];
  return request(`${defaultSettings.serverUrl}/api/user/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
