import request from '../utils/request'
import { UPLOAD_IMAGE_URL } from '@/utils/env'
import { resolve } from 'url';
import { rejects } from 'assert';

export function uploadPic(data) {
  var form = new FormData()
  console.log(data)
  if (data.name.split('.').length == 2) {
    const filename = `${data.name.split('.')[0]}_${new Date().getTime()}.${data.name.split('.')[1]}`
    console.log(filename)
    // form.append('file', data, data.name)
    form.append('file', data, filename)
    return request({
      url: UPLOAD_IMAGE_URL,
      method: 'post',
      data: form,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  } else {
    return new Promise((resolve, reject) => {
      reject('图片名称有误，修改图片名称后重新上传')
    })
  }
}