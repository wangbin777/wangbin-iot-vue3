import request from '@/config/axios'

// 采集设备分组 VO
export interface CollectorDeviceGroupVO {
  id: number // 分组ID
  groupName: string // 分组名称
  groupCode: string // 分组编码
  parentId: number // 父分组ID
  sortNo: number // 排序字段
  remark: string // 备注信息
  creator: string // 创建人
  createTime: Date // 创建时间
  updater: string // 更新人
  updateTime: Date // 更新时间
}

// 采集设备分组 API
export const CollectorDeviceGroupApi = {
  // 创建采集设备分组
  createGroup: async (data: CollectorDeviceGroupVO) => {
    return await request.post({ url: `/iot/collector-device-group/create`, data })
  },

  // 更新采集设备分组
  updateGroup: async (data: CollectorDeviceGroupVO) => {
    return await request.post({ url: `/iot/collector-device-group/update`, data })
  },

  // 删除采集设备分组
  deleteGroup: async (id: number) => {
    return await request.delete({ url: `/iot/collector-device-group/delete?id=${id}` })
  },

  // 获取采集设备分组详情
  getGroup: async (id: number) => {
    return await request.get({ url: `/iot/collector-device-group/get?id=${id}` })
  },

  // 获取采集设备分组列表
  getGroupList: async (ids: number[]) => {
    return await request.get({ url: `/iot/collector-device-group/list`, params: { ids: ids.join(',') } })
  },

  // 获取采集设备分组分页
  getGroupPage: async (params: any) => {
    return await request.get({ url: `/iot/collector-device-group/page`, params })
  }
}
