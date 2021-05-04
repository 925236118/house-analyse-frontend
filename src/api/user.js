import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api/backend/user/login/',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: `/api/backend/user/${id}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/api/backend/user/logout/',
    method: 'post'
  })
}
