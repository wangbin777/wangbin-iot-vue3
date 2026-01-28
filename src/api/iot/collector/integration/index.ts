// 采集器集成接口 API
import request from '@/config/axios'

// 缓存接口
export const cacheApi = {
  // 获取缓存统计信息
  getCacheStats: async () => {
    return await request.get({ url: '/admin/collector/integration/cache/stats' })
  },
  // 获取缓存健康状态
  getCacheHealth: async () => {
    return await request.get({ url: '/admin/collector/integration/cache/health' })
  }
}

// 数据接口
export const dataApi = {
  // 获取设备单个数据点
  getDevicePoint: async (deviceId: string, pointId: string) => {
    return await request.get({ url: `/admin/collector/integration/data/device/${deviceId}/point/${pointId}` })
  },
  // 获取设备所有数据点
  getDeviceData: async (deviceId: string, pointIds?: string[]) => {
    return await request.get({ url: `/admin/collector/integration/data/device/${deviceId}`, params: { pointIds } })
  },
  // 获取所有设备列表
  getDevices: async () => {
    return await request.get({ url: '/admin/collector/integration/data/devices' })
  },
  // 获取设备数据点配置
  getDevicePointsConfig: async (deviceId: string) => {
    return await request.get({ url: `/admin/collector/integration/data/device/${deviceId}/points` })
  },
  // 重置设备自适应参数
  resetDeviceAdaptive: async (deviceId: string) => {
    return await request.post({ url: `/admin/collector/integration/data/device/${deviceId}/reset-adaptive` })
  }
}

// 设备接口
export const deviceApi = {
  // 启动设备采集
  startDevice: async (deviceId: string) => {
    return await request.post({ url: `/admin/collector/integration/device/${deviceId}/start` })
  },
  // 停止设备采集
  stopDevice: async (deviceId: string) => {
    return await request.post({ url: `/admin/collector/integration/device/${deviceId}/stop` })
  },
  // 重新加载设备配置
  reloadDevices: async () => {
    return await request.post({ url: '/admin/collector/integration/device/reload' })
  },
  // 获取设备状态
  getDeviceStatus: async (deviceId: string) => {
    return await request.get({ url: `/admin/collector/integration/device/${deviceId}/status` })
  },
  // 获取设备统计信息
  getDeviceStatistics: async () => {
    return await request.get({ url: '/admin/collector/integration/device/statistics' })
  },
  // 获取运行中的设备
  getRunningDevices: async () => {
    return await request.get({ url: '/admin/collector/integration/device/running' })
  },
  // 检查设备是否运行
  checkDeviceRunning: async (deviceId: string) => {
    return await request.get({ url: `/admin/collector/integration/device/${deviceId}/running` })
  }
}

// 健康接口
export const healthApi = {
  // 获取系统健康状态
  getSystemHealth: async () => {
    return await request.get({ url: '/admin/collector/integration/health' })
  }
}

// 监控接口
export const monitorApi = {
  // 获取监控缓存信息
  getMonitorCache: async () => {
    return await request.get({ url: '/admin/collector/integration/monitor/cache' })
  },
  // 获取监控设备状态
  getMonitorDevices: async () => {
    return await request.get({ url: '/admin/collector/integration/monitor/devices' })
  },
  // 获取监控性能指标
  getMonitorPerformance: async () => {
    return await request.get({ url: '/admin/collector/integration/monitor/performance' })
  },
  // 获取监控系统资源
  getMonitorSystem: async () => {
    return await request.get({ url: '/admin/collector/integration/monitor/system' })
  },
  // 获取监控错误统计
  getMonitorErrors: async () => {
    return await request.get({ url: '/admin/collector/integration/monitor/errors' })
  },
  // 获取监控性能详情
  getMonitorPerfDetail: async () => {
    return await request.get({ url: '/admin/collector/integration/monitor/perfDetail' })
  }
}
