import request from '@/utils/request'

const api_name = '/admin/cmn/dict' // 从java对应的controller复制过来！

export default {
  //定义api方法，实质调用后端controller方法
  //数据字典列表
  dictList(id) {
    return request({
      url: `${api_name}/findChildData/${id}`,
      method: 'get'
    })
  },
}