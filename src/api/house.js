import request from '@/utils/request'

export function fetchHouseList() {
  return request({
    url: '/api/backend/house/',
    method: 'get'
  })
}

export function houseCount() {
  return request({
    url: '/api/backend/house/count',
    method: 'get'
  })
}

export function fetchHouseById(params) {
  return request({
    url: `/api/backend/house/${params.id}`,
    method: 'get'
  })
}

export function removeHouseById(params) {
  return request({
    url: `/api/backend/house/${params.id}`,
    method: 'delete'
  })
}

export function updateHouse(data) {
  return request({
    url: `/api/backend/house/${data.id}`,
    method: 'put',
    data
  })
}

export function addHouse(data) {
  return request({
    url: `/api/backend/house/`,
    method: 'post',
    data
  })
}
