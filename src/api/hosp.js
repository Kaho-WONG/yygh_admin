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
  },

  //根据医院编号获取所有科室(树形)
  getDeptByHoscode(hoscode){
    return request ({
      url: `/admin/hosp/department/getDeptList/${hoscode}`,
      method: 'get'
    })
   },

   //根据医院编号 和 科室编号 ，查询排班规则数据
   getScheduleRule(page, limit, hoscode, depcode) {
    return request({
      url: `/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`,
      method: 'get'
    })
   },

   //查询排班详情
   getScheduleDetail(hoscode,depcode,workDate) {
    return request ({
      url: `/admin/hosp/schedule/getScheduleDetail/${hoscode}/${depcode}/${workDate}`,
      method: 'get'
    })
   }

 
}