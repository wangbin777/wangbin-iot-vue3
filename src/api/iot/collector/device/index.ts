import request from '@/config/axios'

// 采集设备 VO
export interface CollectorDeviceVO {
  id: number // 设备ID
  deviceCode: string // 设备唯一业务ID
  deviceName: string // 设备名称
  deviceAlias: string // 设备别名
  groupId: number // 设备分组ID
  protocolType: string // 采集协议类型
  connectionId: number // 连接配置ID
  collectionIntervalMs: number // 采集周期（毫秒）
  reportIntervalS: number // 上报周期（秒）
  enabled: boolean // 是否启用
  status: string // 设备状态
  remark: string // 备注信息
  creator: string // 创建人
  createTime: Date // 创建时间
  updater: string // 更新人
  updateTime: Date // 更新时间
}

// 采集设备 API
export const CollectorDeviceApi = {
  // 创建采集设备
  createDevice: async (data: CollectorDeviceVO) => {
    return await request.post({ url: `/iot/collector-device/create`, data })
  },

  // 更新采集设备
  updateDevice: async (data: CollectorDeviceVO) => {
    return await request.post({ url: `/iot/collector-device/update`, data })
  },

  // 删除采集设备
  deleteDevice: async (id: number) => {
    return await request.delete({ url: `/iot/collector-device/delete?id=${id}` })
  },

  // 获取采集设备详情
  getDevice: async (id: number) => {
    return await request.get({ url: `/iot/collector-device/get?id=${id}` })
  },

  // 获取采集设备列表
  getDeviceList: async (ids: number[]) => {
    return await request.get({ url: `/iot/collector-device/list`, params: { ids: ids.join(',') } })
  },

  // 获取采集设备分页
  getDevicePage: async (params: any) => {
    return await request.get({ url: `/iot/collector-device/page`, params })
  }
}
