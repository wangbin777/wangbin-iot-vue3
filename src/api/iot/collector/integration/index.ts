// 采集器集成接口 API
import request from '@/config/axios'

// 缓存接口
export const cacheApi = {
  // 获取缓存统计信息
  getCacheStats: () => {
    return request({
      url: '/admin/collector/integration/cache/stats',
      method: 'get'
    })
  },
  // 获取缓存健康状态
  getCacheHealth: () => {
    return request({
      url: '/admin/collector/integration/cache/health',
      method: 'get'
    })
  }
}

// 数据接口
export const dataApi = {
  // 获取设备单个数据点
  getDevicePoint: (deviceId: string, pointId: string) => {
    return request({
      url: `/admin/collector/integration/data/device/${deviceId}/point/${pointId}`,
      method: 'get'
    })
  },
  // 获取设备所有数据点
  getDeviceData: (deviceId: string, pointIds?: string[]) => {
    return request({
      url: `/admin/collector/integration/data/device/${deviceId}`,
      method: 'get',
      params: { pointIds }
    })
  },
  // 获取所有设备列表
  getDevices: () => {
    return request({
      url: '/admin/collector/integration/data/devices',
      method: 'get'
    })
  },
  // 获取设备数据点配置
  getDevicePointsConfig: (deviceId: string) => {
    return request({
      url: `/admin/collector/integration/data/device/${deviceId}/points`,
      method: 'get'
    })
  },
  // 重置设备自适应参数
  resetDeviceAdaptive: (deviceId: string) => {
    return request({
      url: `/admin/collector/integration/data/device/${deviceId}/reset-adaptive`,
      method: 'post'
    })
  }
}

// 设备接口
export const deviceApi = {
  // 启动设备采集
  startDevice: (deviceId: string) => {
    return request({
      url: `/admin/collector/integration/device/${deviceId}/start`,
      method: 'post'
    })
  },
  // 停止设备采集
  stopDevice: (deviceId: string) => {
    return request({
      url: `/admin/collector/integration/device/${deviceId}/stop`,
      method: 'post'
    })
  },
  // 重新加载设备配置
  reloadDevices: () => {
    return request({
      url: '/admin/collector/integration/device/reload',
      method: 'post'
    })
  },
  // 获取设备状态
  getDeviceStatus: (deviceId: string) => {
    return request({
      url: `/admin/collector/integration/device/${deviceId}/status`,
      method: 'get'
    })
  },
  // 获取设备统计信息
  getDeviceStatistics: () => {
    return request({
      url: '/admin/collector/integration/device/statistics',
      method: 'get'
    })
  },
  // 获取运行中的设备
  getRunningDevices: () => {
    return request({
      url: '/admin/collector/integration/device/running',
      method: 'get'
    })
  },
  // 检查设备是否运行
  checkDeviceRunning: (deviceId: string) => {
    return request({
      url: `/admin/collector/integration/device/${deviceId}/running`,
      method: 'get'
    })
  }
}

// 健康接口
export const healthApi = {
  // 获取系统健康状态
  getSystemHealth: () => {
    return request({
      url: '/admin/collector/integration/health',
      method: 'get'
    })
  }
}

// 监控接口
export const monitorApi = {
  // 获取监控缓存信息
  getMonitorCache: () => {
    return request({
      url: '/admin/collector/integration/monitor/cache',
      method: 'get'
    })
  },
  // 获取监控设备状态
  getMonitorDevices: () => {
    return request({
      url: '/admin/collector/integration/monitor/devices',
      method: 'get'
    })
  },
  // 获取监控性能指标
  getMonitorPerformance: () => {
    return request({
      url: '/admin/collector/integration/monitor/performance',
      method: 'get'
    })
  },
  // 获取监控系统资源
  getMonitorSystem: () => {
    return request({
      url: '/admin/collector/integration/monitor/system',
      method: 'get'
    })
  },
  // 获取监控错误统计
  getMonitorErrors: () => {
    return request({
      url: '/admin/collector/integration/monitor/errors',
      method: 'get'
    })
  }
}
