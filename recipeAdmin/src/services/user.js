import { stringify } from 'qs';
import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request(`/api/currentUser?${stringify(params)}`);
}

// export async function queryCurrent(params) {
//   return request('/api/currentUser', {
//     method: 'get',
//     body: params,
//   });
// }
