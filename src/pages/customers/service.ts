import request from '@/utils/request';
import { TableListParams } from './data';

export async function queryCustomer(params: TableListParams) {
  return request('/api/customer', {
    params,
  });
}

export async function removeCustomer(params: TableListParams) {
  return request('/api/customer', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addCustomer(params: TableListParams) {
  return request('/api/customer', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateCustomer(params: TableListParams) {
  return request('/api/customer', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
