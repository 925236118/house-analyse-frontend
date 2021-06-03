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

export function fetchUserList() {
  return request({
    url: '/api/backend/user/',
    method: 'get'
  })
}

export function updateUserById(data) {
  return request({
    url: `/api/backend/user/${data.id}`,
    method: 'put',
    data
  })
}

export function addUser(data) {
  return request({
    url: `/api/backend/user/`,
    method: 'post',
    data
  })
}

export function deleteUserById(params) {
  return request({
    url: `/api/backend/user/${params.id}`,
    method: 'delete'
  })
}
