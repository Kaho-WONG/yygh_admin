import request from '@/utils/request'

export default {
  //展示医院列表(条件查询分页)
  getPageList(current,limit,searchObj) {
    return request ({
      url: `/admin/hosp/hospital/list/${current}/${limit}`,
      method: 'get',
      params: searchObj  
    })
  },
  //根据dictCode查询下级数据字典
  findByDictCode(dictCode) {
    return request({
        url: `/admin/cmn/dict/findByDictCode/${dictCode}`,
        method: 'get'
      })
  },
  
  //根据父id查询下级数据字典列表
  findByParentId(id) {
    return request({
        url: `/admin/cmn/dict/findChildData/${id}`,
        method: 'get'
      })
  },

  //更新医院上线状态
  updateStatus(id, status) {
    return request({
      url: `/admin/hosp/hospital/updateHospStatus/${id}/${status}`,
      method: 'get'
    })
  },

  //查看医院详情信息
  getHospById(id) {
    return request ({
      url: `/admin/hosp/hospital/showHospDetail/${id}`,
      method: 'get'
    })
  }
 
}