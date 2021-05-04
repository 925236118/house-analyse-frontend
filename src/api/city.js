import request from '@/utils/request'

export function fetchCityList() {
  return request({
    url: '/api/backend/city/',
    method: 'get'
  })
}

export function updateCityById(data) {
  return request({
    url: `/api/backend/city/${data.id}`,
    method: 'put',
    data
  })
}

export function addCity(data) {
  return request({
    url: `/api/backend/city/`,
    method: 'post',
    data
  })
}

export function deleteCityById(params) {
  return request({
    url: `/api/backend/city/${params.id}`,
    method: 'delete'
  })
}
