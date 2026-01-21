import request from '@/config/axios'

// 采集连接配置 VO
export interface CollectorConnectionVO {
  id: number // 连接配置ID
  connectionType: string // 连接类型：TCP/UDP/SERIAL
  host?: string // 主机地址：IP或域名（TCP/UDP有效）
  port?: number // 端口号（TCP/UDP有效）
  url?: string // 连接URL
  serialPort?: string // 串口名（SERIAL有效）
  baudRate?: number // 波特率（SERIAL有效）
  dataBits?: number // 数据位（SERIAL有效）
  stopBits?: number // 停止位（SERIAL有效）
  parity?: string // 校验位（SERIAL有效）
  flowControl?: string // 流控（SERIAL有效）
  connectTimeoutMs: number // 连接超时毫秒
  readTimeoutMs: number // 读超时毫秒
  writeTimeoutMs: number // 写超时毫秒
  retries: number // 重试次数
  extJson?: string // 扩展连接参数JSON
  remark: string // 备注信息
  creator: string // 创建人
  createTime: Date // 创建时间
  updater: string // 更新人
  updateTime: Date // 更新时间
}

// 采集连接配置 API
export const CollectorConnectionApi = {
  // 创建采集连接配置
  createConnection: async (data: CollectorConnectionVO) => {
    return await request.post({ url: `/iot/collector-connection/create`, data })
  },

  // 更新采集连接配置
  updateConnection: async (data: CollectorConnectionVO) => {
    return await request.post({ url: `/iot/collector-connection/update`, data })
  },

  // 删除采集连接配置
  deleteConnection: async (id: number) => {
    return await request.delete({ url: `/iot/collector-connection/delete?id=${id}` })
  },

  // 获取采集连接配置详情
  getConnection: async (id: number) => {
    return await request.get({ url: `/iot/collector-connection/get?id=${id}` })
  },

  // 获取采集连接配置列表
  getConnectionList: async (ids: number[]) => {
    return await request.get({
      url: `/iot/collector-connection/list`,
      params: { ids: ids.join(',') }
    })
  },

  // 获取采集连接配置分页
  getConnectionPage: async (params: any) => {
    return await request.get({ url: `/iot/collector-connection/page`, params })
  }
}
