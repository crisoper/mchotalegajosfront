import request from '@/utils/request'



class UtilsRequest {

  fetchPersonByDNI(data) {
    return request({
      url: '/utilsfetchperson',
      method: 'post',
      data
    })
  }

}

export { UtilsRequest as default }