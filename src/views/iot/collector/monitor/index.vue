<template>
  <ContentWrap>
    <div class="flex justify-between items-center mb-5">
      <h2 class="text-xl font-bold">采集器监控</h2>
      <el-button type="primary" @click="refreshAllData">
        <el-icon><Refresh /></el-icon>
        刷新数据
      </el-button>
    </div>

    <!-- 系统健康状态 -->
    <el-card class="mb-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span>系统健康状态</span>
          <el-button type="primary" size="small" @click="getSystemHealth">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="healthStatus" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold" :class="healthStatus.healthLevel === 'HEALTHY' ? 'text-green-500' : 'text-red-500'">
              {{ healthStatus.healthLevel === 'HEALTHY' ? '健康' : '异常' }}
            </div>
            <div class="text-gray-500 mt-2">系统状态</div>
          </div>
        </el-card>
        <el-card v-for="component in healthStatus.components" :key="component.name" :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold" :class="component.status === 'HEALTHY' ? 'text-green-500' : 'text-red-500'">
              {{ component.status === 'HEALTHY' ? '健康' : '异常' }}
            </div>
            <div class="text-gray-500 mt-2">{{ component.name }}</div>
          </div>
        </el-card>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-400">加载中...</div>
      </div>
    </el-card>

    <!-- 缓存监控 -->
    <el-card class="mb-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span>缓存监控</span>
          <el-button type="primary" size="small" @click="getCacheStats">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="cacheStats" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ (cacheStats.hitRate * 100).toFixed(2) }}%</div>
            <div class="text-gray-500 mt-2">缓存命中率</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-500">{{ (cacheStats.missRate * 100).toFixed(2) }}%</div>
            <div class="text-gray-500 mt-2">缓存未命中率</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-500">{{ cacheStats.evictions }}</div>
            <div class="text-gray-500 mt-2">缓存驱逐次数</div>
          </div>
        </el-card>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-400">加载中...</div>
      </div>
    </el-card>

    <!-- 设备状态监控 -->
    <el-card class="mb-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span>设备状态监控</span>
          <el-button type="primary" size="small" @click="getMonitorDevices">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="deviceMonitor" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ deviceMonitor.onlineCount || 0 }}</div>
            <div class="text-gray-500 mt-2">在线设备数</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-500">{{ deviceMonitor.offlineCount || 0 }}</div>
            <div class="text-gray-500 mt-2">离线设备数</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-red-500">{{ deviceMonitor.errorCount || 0 }}</div>
            <div class="text-gray-500 mt-2">错误设备数</div>
          </div>
        </el-card>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-400">加载中...</div>
      </div>
    </el-card>

    <!-- 性能指标监控 -->
    <el-card class="mb-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span>性能指标监控</span>
          <el-button type="primary" size="small" @click="getMonitorPerformance">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="performanceMonitor" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ performanceMonitor.throughput || 0 }}</div>
            <div class="text-gray-500 mt-2">采集吞吐量</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-500">{{ performanceMonitor.latency || 0 }}ms</div>
            <div class="text-gray-500 mt-2">平均延迟</div>
          </div>
        </el-card>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-400">加载中...</div>
      </div>
    </el-card>

    <!-- 系统资源监控 -->
    <el-card class="mb-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span>系统资源监控</span>
          <el-button type="primary" size="small" @click="getMonitorSystem">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="systemMonitor" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-500">{{ systemMonitor.cpuUsage || 0 }}%</div>
            <div class="text-gray-500 mt-2">CPU使用率</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-500">{{ systemMonitor.memoryUsage || 0 }}%</div>
            <div class="text-gray-500 mt-2">内存使用率</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-yellow-500">{{ systemMonitor.diskUsage || 0 }}%</div>
            <div class="text-gray-500 mt-2">磁盘使用率</div>
          </div>
        </el-card>
        <el-card :body-style="{ padding: '20px' }">
          <div class="text-center">
            <div class="text-2xl font-bold text-purple-500">{{ systemMonitor.networkUsage || 0 }}%</div>
            <div class="text-gray-500 mt-2">网络使用率</div>
          </div>
        </el-card>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-400">加载中...</div>
      </div>
    </el-card>

    <!-- 错误统计 -->
    <el-card class="mb-5">
      <template #header>
        <div class="flex justify-between items-center">
          <span>错误统计</span>
          <el-button type="primary" size="small" @click="getMonitorErrors">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="errorMonitor && errorMonitor.errors && errorMonitor.errors.length > 0">
        <el-table :data="errorMonitor.errors" border>
          <el-table-column prop="type" label="错误类型" width="200" />
          <el-table-column prop="count" label="错误次数" width="100" />
          <el-table-column prop="message" label="错误信息" />
        </el-table>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><CheckCircle /></el-icon>
        <div class="text-gray-400">暂无错误信息</div>
      </div>
    </el-card>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Refresh, Loading, CheckCircle } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { cacheApi, healthApi, monitorApi } from '@/api/iot/collector'

// 响应式数据
const healthStatus = ref<any>(null)
const cacheStats = ref<any>(null)
const deviceMonitor = ref<any>(null)
const performanceMonitor = ref<any>(null)
const systemMonitor = ref<any>(null)
const errorMonitor = ref<any>(null)

// 获取系统健康状态
const getSystemHealth = async () => {
  try {
    const response = await healthApi.getSystemHealth()
    healthStatus.value = response.data
  } catch (error) {
    ElMessage.error('获取系统健康状态失败')
    console.error('获取系统健康状态失败:', error)
  }
}

// 获取缓存统计信息
const getCacheStats = async () => {
  try {
    const response = await cacheApi.getCacheStats()
    cacheStats.value = response.data
  } catch (error) {
    ElMessage.error('获取缓存统计信息失败')
    console.error('获取缓存统计信息失败:', error)
  }
}

// 获取设备状态监控
const getMonitorDevices = async () => {
  try {
    const response = await monitorApi.getMonitorDevices()
    deviceMonitor.value = response.data
  } catch (error) {
    ElMessage.error('获取设备状态监控失败')
    console.error('获取设备状态监控失败:', error)
  }
}

// 获取性能指标监控
const getMonitorPerformance = async () => {
  try {
    const response = await monitorApi.getMonitorPerformance()
    performanceMonitor.value = response.data
  } catch (error) {
    ElMessage.error('获取性能指标监控失败')
    console.error('获取性能指标监控失败:', error)
  }
}

// 获取系统资源监控
const getMonitorSystem = async () => {
  try {
    const response = await monitorApi.getMonitorSystem()
    systemMonitor.value = response.data
  } catch (error) {
    ElMessage.error('获取系统资源监控失败')
    console.error('获取系统资源监控失败:', error)
  }
}

// 获取错误统计
const getMonitorErrors = async () => {
  try {
    const response = await monitorApi.getMonitorErrors()
    errorMonitor.value = response.data
  } catch (error) {
    ElMessage.error('获取错误统计失败')
    console.error('获取错误统计失败:', error)
  }
}

// 刷新所有数据
const refreshAllData = async () => {
  await Promise.all([
    getSystemHealth(),
    getCacheStats(),
    getMonitorDevices(),
    getMonitorPerformance(),
    getMonitorSystem(),
    getMonitorErrors()
  ])
  ElMessage.success('数据刷新成功')
}

// 生命周期
onMounted(() => {
  refreshAllData()
})
</script>
