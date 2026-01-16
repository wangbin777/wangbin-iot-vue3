import request from '@/config/axios'

// 采集点位配置 VO
export interface CollectorPointVO {
  id?: number // 点位配置ID
  deviceId: string // 设备ID（采集设备）
  pointId: string // 点位ID（设备内唯一）
  pointCode?: string // 点位编码（IOA_0001 / COIL_001 等）
  pointName?: string // 点位名称
  unitId?: number // 单元ID（Modbus unitId / IEC104 保留）
  address: string // 点位地址（IOA / 寄存器 / OID / NodeId / URI）
  dataType: string // 数据类型：BOOLEAN / INT / FLOAT / DOUBLE / STRING
  readWriter: string // 读写类型：R / RW / W
  collectionMode: string // 采集模式：POLLING / SUBSCRIPTION
  status: number // 状态：1启用 0停用
  baseCollectionInterval?: number // 基础采集周期(ms)
  minCollectionInterval?: number // 最小采集周期(ms)
  maxCollectionInterval?: number // 最大采集周期(ms)
  minValue?: number // 最小值
  maxValue?: number // 最大值
  unit?: string // 单位
  priority?: number // 采集优先级
  defaultValue?: string // 默认值
  cacheEnabled: number // 是否启用点位缓存
  cacheDuration?: number // 缓存时长（秒）
  alarmEnabled: number // 是否启用告警
  alarmRule?: string // 告警规则 JSON
  additionalConfig?: string // 扩展配置（上报字段、设备信息等）
  remark?: string // 备注说明
  creator?: string // 创建人
  createTime?: Date // 创建时间
  updater?: string // 更新人
  updateTime?: Date // 更新时间
}

// 采集点位配置 API
export const CollectorPointApi = {
  // 创建采集点位配置
  createPoint: async (data: CollectorPointVO) => {
    return await request.post({ url: `/iot/collector-point/create`, data })
  },

  // 更新采集点位配置
  updatePoint: async (data: CollectorPointVO) => {
    return await request.post({ url: `/iot/collector-point/update`, data })
  },

  // 删除采集点位配置
  deletePoint: async (id: number) => {
    return await request.delete({ url: `/iot/collector-point/delete?id=${id}` })
  },

  // 获取采集点位配置详情
  getPoint: async (id: number) => {
    return await request.get({ url: `/iot/collector-point/get?id=${id}` })
  },

  // 获取采集点位配置列表
  getPointList: async (ids: number[]) => {
    return await request.get({ url: `/iot/collector-point/list`, params: { ids: ids.join(',') } })
  },

  // 获取采集点位配置分页
  getPointPage: async (params: any) => {
    return await request.get({ url: `/iot/collector-point/page`, params })
  },

  // 根据设备ID获取采集点位配置列表
  getPointListByDeviceId: async (deviceId: string) => {
    return await request.get({
      url: `/iot/collector-point/list-by-device-id`,
      params: { deviceId }
    })
  },

  // 根据点位ID获取采集点位配置
  getPointByPointId: async (pointId: string) => {
    return await request.get({ url: `/iot/collector-point/get-by-point-id`, params: { pointId } })
  },

  // 根据设备ID和点位ID获取采集点位配置
  getPointByDeviceIdAndPointId: async (deviceId: string, pointId: string) => {
    return await request.get({
      url: `/iot/collector-point/get-by-device-id-and-point-id`,
      params: { deviceId, pointId }
    })
  },

  // 根据设备ID集合获取采集点位配置列表
  getPointListByDeviceIds: async (deviceIds: string[]) => {
    return await request.get({
      url: `/iot/collector-point/list-by-device-ids`,
      params: { deviceIds: deviceIds.join(',') }
    })
  },

  // 根据状态获取采集点位配置列表
  getPointListByStatus: async (status: number) => {
    return await request.get({ url: `/iot/collector-point/list-by-status`, params: { status } })
  },

  // 根据数据类型获取采集点位配置列表
  getPointListByDataType: async (dataType: string) => {
    return await request.get({
      url: `/iot/collector-point/list-by-data-type`,
      params: { dataType }
    })
  },

  // 根据读写类型获取采集点位配置列表
  getPointListByReadWrite: async (readWriter: string) => {
    return await request.get({
      url: `/iot/collector-point/list-by-read-write`,
      params: { readWriter }
    })
  }
}
