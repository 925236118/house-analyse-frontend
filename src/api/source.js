import request from '@/utils/request'

export function fetchSourceList() {
  return request({
    url: '/api/backend/source/',
    method: 'get'
  })
}

export function updateSourceById(data) {
  return request({
    url: `/api/backend/source/${data.id}`,
    method: 'put',
    data
  })
}

export function addSource(data) {
  return request({
    url: `/api/backend/source/`,
    method: 'post',
    data
  })
}

export function deleteSourceById(params) {
  return request({
    url: `/api/backend/source/${params.id}`,
    method: 'delete'
  })
}
