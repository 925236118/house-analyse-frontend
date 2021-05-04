import request from '@/utils/request'

export function updateHouseAttrById(data) {
  return request({
    url: `/api/backend/house/attr/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteHouseAttrById(params) {
  return request({
    url: `/api/backend/house/attr/${params.id}`,
    method: 'delete'
  })
}

export function addHouseAttr(data) {
  return request({
    url: `/api/backend/house/attr`,
    method: 'post',
    data
  })
}
