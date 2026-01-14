import request from '@/config/axios'

// 采集设备运行态 VO
export interface CollectorDeviceRuntimeVO {
  id: number // 运行态记录ID
  deviceId: number // 采集设备主键ID
  online: boolean // 是否在线：true在线/false离线
  lastOnlineAt?: Date // 最后一次在线时间
  lastHeartbeatAt?: Date // 最后一次心跳/成功采集时间
  lastErrorCode?: string // 最后错误码
  lastErrorMsg?: string // 最后错误信息
  retryCount: number // 当前连续失败重试次数
  consecutiveFail?: number // 连续失败次数
  creator: string // 创建人
  createTime: Date // 创建时间
  updater: string // 更新人
  updateTime: Date // 更新时间
}

// 采集设备运行态 API
export const CollectorDeviceRuntimeApi = {
  // 创建采集设备运行态
  createRuntime: async (data: CollectorDeviceRuntimeVO) => {
    return await request.post({ url: `/iot/collector-device-runtime/create`, data })
  },

  // 更新采集设备运行态
  updateRuntime: async (data: CollectorDeviceRuntimeVO) => {
    return await request.post({ url: `/iot/collector-device-runtime/update`, data })
  },

  // 删除采集设备运行态
  deleteRuntime: async (id: number) => {
    return await request.delete({ url: `/iot/collector-device-runtime/delete?id=${id}` })
  },

  // 获取采集设备运行态详情
  getRuntime: async (id: number) => {
    return await request.get({ url: `/iot/collector-device-runtime/get?id=${id}` })
  },

  // 获取采集设备运行态列表
  getRuntimeList: async (ids: number[]) => {
    return await request.get({ url: `/iot/collector-device-runtime/list`, params: { ids: ids.join(',') } })
  },

  // 获取采集设备运行态分页
  getRuntimePage: async (params: any) => {
    return await request.get({ url: `/iot/collector-device-runtime/page`, params })
  },

  // 根据设备ID获取采集设备运行态
  getRuntimeByDeviceId: async (deviceId: number) => {
    return await request.get({ url: `/iot/collector-device-runtime/get-by-device-id?deviceId=${deviceId}` })
  },

  // 根据设备ID集合获取采集设备运行态列表
  getRuntimeListByDeviceIds: async (deviceIds: number[]) => {
    return await request.get({ url: `/iot/collector-device-runtime/list-by-device-ids`, params: { deviceIds: deviceIds.join(',') } })
  },

  // 根据在线状态获取采集设备运行态列表
  getRuntimeListByOnline: async (online: boolean) => {
    return await request.get({ url: `/iot/collector-device-runtime/list-by-online?online=${online}` })
  }
}
