import request from '@/utils/request'

const api_name = '/admin/hosp/hospitalSet' // 从java对应的controller复制过来！

export default {
  //定义api方法，实质调用后端controller方法
  //分页获取医院设置数据
  getPageList(current, limit, searchObj) {
    return request({
      url: `${api_name}/findPageHospSet/${current}/${limit}`, // 这里前边还会拼上dev.env.js文件中的BASE_API
      method: 'post',
      data: searchObj   // 使用json传递参数 用data，其他用params
    })
  }
}