import request from '@/utils/request'

export function buscarPersonaDNI(data) {
  return request({
    url: '/buscarPersonaNroDocumento',
    method: 'post',
    data
  })
}