import request from '@/utils/request'

export function addHouseImage(data) {
  return request({
    url: `/api/backend/house/image`,
    method: 'post',
    data
  })
}

export function deleteHouseImageById(params) {
  return request({
    url: `/api/backend/house/image/${params.id}`,
    method: 'delete'
  })
}
