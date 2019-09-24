import request from '@/utils/request';
import defaultSettings from '../../config/defaultSettings';

// 获取所有role信息，{ id:xxx, name: xxx, access: xxx }
export async function queryRoles(): Promise<any> {
  return request(`${defaultSettings.serverUrl}/api/role`);
}
