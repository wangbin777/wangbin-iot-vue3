<template>
  <ContentWrap>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :span="12">
        <h2 style="font-size: 20px; font-weight: bold; color: #333">采集器监控中心</h2>
      </el-col>
      <el-col :span="12" :offset="0" style="text-align: right">
        <el-button type="primary" @click="refreshAllData" :loading="refreshing">
          <el-icon v-if="!refreshing"><Refresh /></el-icon>
          <el-icon v-else><Loading /></el-icon>
          {{ refreshing ? '刷新中...' : '刷新数据' }}
        </el-button>
      </el-col>
    </el-row>

    <!-- 系统健康状态 -->
    <el-card class="mb-4">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-icon style="color: #409eff"><View /></el-icon>
            <span style="font-weight: 500">系统健康状态</span>
          </div>
          <el-button type="primary" size="small" @click="getSystemHealth">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="healthStatus">
        <!-- 系统整体状态 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="8">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div
                  style="font-size: 20px; font-weight: bold"
                  :style="{ color: getHealthStatusColor(healthStatus.status) }"
                >
                  {{ getHealthStatusText(healthStatus.status) }}
                </div>
                <div style="color: #909399; margin-top: 8px">系统状态</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #409eff">
                  {{ formatTimestamp(healthStatus.timestamp) }}
                </div>
                <div style="color: #909399; margin-top: 8px">检查时间</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div
                  style="font-size: 20px; font-weight: bold"
                  :style="{ color: healthStatus.up ? '#67C23A' : '#F56C6C' }"
                >
                  {{ healthStatus.up ? '正常' : '异常' }}
                </div>
                <div style="color: #909399; margin-top: 8px">运行状态</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 组件健康状态 -->
        <div
          v-for="(component, key) in healthStatus.components"
          :key="key"
          style="margin-bottom: 16px"
        >
          <el-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <span>{{ component.name }}</span>
                <el-tag
                  :type="
                    component.status === 'UP' || component.status === 'HEALTHY'
                      ? 'success'
                      : component.status === 'DOWN' || component.status === 'UNHEALTHY'
                        ? 'danger'
                        : 'warning'
                  "
                >
                  {{ component.status }}
                </el-tag>
              </div>
            </template>
            <div style="margin-bottom: 8px">
              <strong>状态消息:</strong> {{ component.message }}
            </div>
            <div style="margin-bottom: 8px">
              <strong>检查时间:</strong> {{ formatTimestamp(component.checkedAt) }}
            </div>
            <div style="margin-bottom: 8px">
              <strong>运行状态:</strong>
              <span :style="{ color: component.up ? '#67C23A' : '#F56C6C' }">
                {{ component.up ? '正常' : '异常' }}
              </span>
            </div>

            <!-- 缓存组件详细信息 -->
            <div v-if="key === 'cache' && component.details" style="margin-top: 16px">
              <h4 style="font-weight: bold; margin-bottom: 8px">缓存详细信息:</h4>
              <el-row :gutter="10" style="margin-bottom: 12px">
                <el-col :span="8">
                  <div><strong>最大缓存级别:</strong> {{ component.details.maxLevel }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>总缓存级别:</strong> {{ component.details.totalLevels }}</div>
                </el-col>
                <el-col :span="8">
                  <div
                    ><strong>是否启用:</strong> {{ component.details.enabled ? '是' : '否' }}</div
                  >
                </el-col>
              </el-row>
              <div v-if="component.details.levels && component.details.levels.length > 0">
                <h5 style="font-weight: bold; margin-bottom: 8px">缓存级别详情:</h5>
                <el-table :data="component.details.levels" border size="small">
                  <el-table-column prop="level" label="级别" width="80" />
                  <el-table-column prop="type" label="类型" width="150" />
                  <el-table-column prop="size" label="大小" width="80" />
                  <el-table-column prop="status" label="状态">
                    <template #default="scope">
                      <el-tag :type="scope.row.status === 'HEALTHY' ? 'success' : 'warning'">
                        {{ scope.row.status }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 连接组件详细信息 -->
            <div v-if="key === 'connections' && component.details" style="margin-top: 16px">
              <h4 style="font-weight: bold; margin-bottom: 8px">连接详细信息:</h4>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div><strong>总连接数:</strong> {{ component.details.totalConnections }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>活跃连接数:</strong> {{ component.details.activeConnections }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>离线连接数:</strong> {{ component.details.offlineConnections }}</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-400">加载中...</div>
      </div>
    </el-card>

    <!-- 缓存监控 -->
    <el-card class="mb-4">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-icon style="color: #909399"><Folder /></el-icon>
            <span style="font-weight: 500">缓存监控</span>
          </div>
          <el-button type="primary" size="small" @click="getCacheStats">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="cacheStats">
        <!-- 缓存概览 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="8">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #409eff">{{
                  cacheStats.totalHitRate
                }}</div>
                <div style="color: #909399; margin-top: 8px">总命中率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #e6a23c">{{
                  cacheStats.missRate
                }}</div>
                <div style="color: #909399; margin-top: 8px">总未命中率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #67c23a">{{
                  cacheStats.totalAccess
                }}</div>
                <div style="color: #909399; margin-top: 8px">总访问次数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 缓存级别命中率 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #409eff">{{
                  cacheStats.level1HitRate
                }}</div>
                <div style="color: #909399; margin-top: 8px">一级缓存命中率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #e6a23c">{{
                  cacheStats.level2HitRate
                }}</div>
                <div style="color: #909399; margin-top: 8px">二级缓存命中率</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 缓存配置信息 -->
        <div style="margin-bottom: 16px">
          <h4 style="font-weight: bold; margin-bottom: 8px">缓存配置</h4>
          <el-row :gutter="10">
            <el-col :span="6">
              <div><strong>最大缓存级别:</strong> {{ cacheStats.maxLevel }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>是否启用:</strong> {{ cacheStats.enabled ? '是' : '否' }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>缓存Aside:</strong> {{ cacheStats.cacheAside ? '是' : '否' }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>写穿透:</strong> {{ cacheStats.writeThrough ? '是' : '否' }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>读穿透:</strong> {{ cacheStats.readThrough ? '是' : '否' }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>总读取次数:</strong> {{ cacheStats.totalReads }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>总写入次数:</strong> {{ cacheStats.totalWrites }}</div>
            </el-col>
            <el-col :span="6">
              <div><strong>总删除次数:</strong> {{ cacheStats.totalDeletes }}</div>
            </el-col>
          </el-row>
        </div>

        <!-- 缓存级别详细信息 -->
        <div
          v-for="(stats, key) in cacheStats.levelStatistics"
          :key="key"
          style="margin-bottom: 16px"
        >
          <el-card>
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center">
                <span>{{ key }}</span>
                <el-tag :type="stats.initialized ? 'success' : 'danger'">
                  {{ stats.initialized ? '已初始化' : '未初始化' }}
                </el-tag>
              </div>
            </template>
            <el-row :gutter="10" style="margin-bottom: 12px">
              <el-col :span="8">
                <div><strong>缓存级别:</strong> {{ stats.cacheLevel }}</div>
              </el-col>
              <el-col :span="8">
                <div><strong>缓存类型:</strong> {{ stats.cacheType }}</div>
              </el-col>
              <el-col :span="8">
                <div><strong>缓存大小:</strong> {{ stats.cacheSize }}</div>
              </el-col>
              <el-col :span="8">
                <div><strong>命中率:</strong> {{ stats.hitRate }}</div>
              </el-col>
              <el-col :span="8">
                <div><strong>未命中率:</strong> {{ stats.missRate }}</div>
              </el-col>
              <el-col :span="8">
                <div
                  ><strong>总访问次数:</strong>
                  {{ stats.totalGets || stats.totalCommandsProcessed }}</div
                >
              </el-col>
              <el-col :span="8">
                <div><strong>总命中次数:</strong> {{ stats.totalHits || stats.keyspaceHits }}</div>
              </el-col>
              <el-col :span="8">
                <div
                  ><strong>总未命中次数:</strong>
                  {{ stats.totalMisses || stats.keyspaceMisses }}</div
                >
              </el-col>
              <el-col :span="8">
                <div><strong>总写入次数:</strong> {{ stats.totalPuts }}</div>
              </el-col>
            </el-row>

            <!-- Redis 特有信息 -->
            <div v-if="key === 'REDIS'" style="margin-top: 12px">
              <h5 style="font-weight: bold; margin-bottom: 8px">Redis 特有信息:</h5>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div><strong>Redis 版本:</strong> {{ stats.redisVersion }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>已用内存:</strong> {{ stats.usedMemory }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>连接客户端数:</strong> {{ stats.connectedClients }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>Redis 命中率:</strong> {{ stats.redisHitRate }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>Redis 未命中率:</strong> {{ stats.redisMissRate }}</div>
                </el-col>
              </el-row>
            </div>

            <!-- 本地缓存特有信息 -->
            <div v-if="key === 'LOCAL_CAFFEINE'" style="margin-top: 12px">
              <h5 style="font-weight: bold; margin-bottom: 8px">本地缓存特有信息:</h5>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div><strong>缓存大小:</strong> {{ stats.estimatedSize }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>驱逐次数:</strong> {{ stats.evictionCount }}</div>
                </el-col>
                <el-col :span="8">
                  <div><strong>加载失败次数:</strong> {{ stats.loadFailureCount }}</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </div>
      <div v-else class="text-center py-10">
        <el-icon class="text-gray-400 text-4xl mb-2"><Loading /></el-icon>
        <div class="text-gray-500">加载中...</div>
      </div>
    </el-card>

    <!-- 设备状态监控 -->
    <el-card class="mb-4">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-icon style="color: #67c23a"><Connection /></el-icon>
            <span style="font-weight: 500">设备状态监控</span>
          </div>
          <el-button type="primary" size="small" @click="getMonitorDevices">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="deviceMonitor">
        <!-- 连接概览 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #409eff">{{
                  deviceMonitor.totalConnections || 0
                }}</div>
                <div style="color: #909399; margin-top: 8px">总连接数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #67c23a">{{
                  deviceMonitor.activeConnections || 0
                }}</div>
                <div style="color: #909399; margin-top: 8px">活跃连接数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 连接详情 -->
        <div v-if="deviceMonitor.connections && deviceMonitor.connections.length > 0">
          <el-table :data="deviceMonitor.connections" border>
            <el-table-column prop="deviceId" label="设备ID" width="100" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag :type="scope.row.connected ? 'success' : 'danger'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="connected" label="是否连接" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.connected ? 'success' : 'danger'">
                  {{ scope.row.connected ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lastActivityTime" label="最后活动时间" width="180">
              <template #default="scope">
                {{ formatTimestamp(scope.row.lastActivityTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="idleTime" label="空闲时间(ms)" width="120" />
            <el-table-column prop="bytesSent" label="发送字节数" width="120" />
            <el-table-column prop="bytesReceived" label="接收字节数" width="120" />
            <el-table-column prop="errors" label="错误数" width="100" />
            <el-table-column prop="successRate" label="成功率" width="100">
              <template #default="scope"> {{ (scope.row.successRate || 0).toFixed(2) }}% </template>
            </el-table-column>
            <el-table-column prop="connectionDuration" label="连接持续时间(ms)" width="150" />
          </el-table>
        </div>
        <div v-else style="text-align: center; padding: 20px 0">
          <div style="color: #909399">暂无连接信息</div>
        </div>
        <!-- 生成时间 -->
        <div style="margin-top: 16px; text-align: right; color: #909399">
          生成时间: {{ formatTimestamp(deviceMonitor.generatedAt) }}
        </div>
      </div>
      <div v-else style="text-align: center; padding: 40px 0">
        <el-icon style="color: #909399; font-size: 40px; margin-bottom: 8px"><Loading /></el-icon>
        <div style="color: #909399">加载中...</div>
      </div>
    </el-card>

    <!-- 性能指标监控 -->
    <el-card class="mb-4">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-icon style="color: #e6a23c"><Histogram /></el-icon>
            <span style="font-weight: 500">性能指标监控</span>
          </div>
          <el-button type="primary" size="small" @click="getMonitorPerformance">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="performanceMonitor && performanceMonitor.length > 0">
        <el-table :data="performanceMonitor" border>
          <el-table-column prop="deviceId" label="设备ID" width="100" />
          <el-table-column prop="protocol" label="协议类型" width="120" />
          <el-table-column prop="processedPoints" label="处理数据点数量" width="150" />
          <el-table-column prop="pointsPerSecond" label="每秒处理数据点" width="150">
            <template #default="scope">
              {{ scope.row.pointsPerSecond?.toFixed(2) || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="successRate" label="成功率" width="100">
            <template #default="scope"> {{ scope.row.successRate?.toFixed(2) || 0 }}% </template>
          </el-table-column>
          <el-table-column prop="averageLatencyMs" label="平均延迟(ms)" width="120">
            <template #default="scope">
              {{ scope.row.averageLatencyMs?.toFixed(2) || 0 }}
            </template>
          </el-table-column>
          <el-table-column prop="timestamp" label="时间" width="180">
            <template #default="scope">
              {{ formatTimestamp(scope.row.timestamp) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else style="text-align: center; padding: 40px 0">
        <el-icon style="color: #909399; font-size: 40px; margin-bottom: 8px"><Loading /></el-icon>
        <div style="color: #909399">加载中...</div>
      </div>
    </el-card>

    <!-- 系统资源监控 -->
    <el-card class="mb-4">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-icon style="color: #f56c6c"><Cpu /></el-icon>
            <span style="font-weight: 500">系统资源监控</span>
          </div>
          <el-button type="primary" size="small" @click="getMonitorSystem">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="systemMonitor">
        <!-- CPU 监控 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #67c23a"
                  >{{ (systemMonitor.systemCpuLoad || 0).toFixed(2) }}%</div
                >
                <div style="color: #909399; margin-top: 8px">系统CPU负载</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #409eff">
                  {{
                    systemMonitor.processCpuLoad === -1
                      ? '未知'
                      : (systemMonitor.processCpuLoad * 100).toFixed(2) + '%'
                  }}
                </div>
                <div style="color: #909399; margin-top: 8px">进程CPU负载</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 内存监控 -->
        <div style="margin-bottom: 16px">
          <h4 style="font-weight: bold; margin-bottom: 8px">内存使用情况</h4>
          <el-row :gutter="10">
            <el-col :span="6">
              <div><strong>堆内存使用:</strong> {{ formatMemory(systemMonitor.heapUsed) }}</div>
            </el-col>
            <el-col :span="6">
              <div
                ><strong>堆内存提交:</strong> {{ formatMemory(systemMonitor.heapCommitted) }}</div
              >
            </el-col>
            <el-col :span="6">
              <div><strong>堆内存最大:</strong> {{ formatMemory(systemMonitor.heapMax) }}</div>
            </el-col>
            <el-col :span="6">
              <div
                ><strong>堆内存使用率:</strong>
                {{ calculateMemoryUsage(systemMonitor.heapUsed, systemMonitor.heapMax) }}%</div
              >
            </el-col>
            <el-col :span="6">
              <div
                ><strong>非堆内存使用:</strong> {{ formatMemory(systemMonitor.nonHeapUsed) }}</div
              >
            </el-col>
            <el-col :span="6">
              <div
                ><strong>非堆内存提交:</strong>
                {{ formatMemory(systemMonitor.nonHeapCommitted) }}</div
              >
            </el-col>
          </el-row>
        </div>

        <!-- 线程监控 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #909399">{{
                  systemMonitor.threadCount
                }}</div>
                <div style="color: #909399; margin-top: 8px">总线程数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card :body-style="{ padding: '20px' }">
              <div style="text-align: center">
                <div style="font-size: 20px; font-weight: bold; color: #e6a23c">{{
                  systemMonitor.daemonThreadCount
                }}</div>
                <div style="color: #909399; margin-top: 8px">守护线程数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 线程池监控 -->
        <div style="margin-bottom: 16px">
          <h4 style="font-weight: bold; margin-bottom: 8px">线程池状态</h4>
          <el-table :data="getThreadPoolData()" border>
            <el-table-column prop="name" label="线程池名称" width="180" />
            <el-table-column prop="corePoolSize" label="核心线程数" width="100" />
            <el-table-column prop="maxPoolSize" label="最大线程数" width="100" />
            <el-table-column prop="activeCount" label="活跃线程数" width="100" />
            <el-table-column prop="queueSize" label="队列大小" width="100" />
            <el-table-column prop="completedTaskCount" label="已完成任务数" />
          </el-table>
        </div>

        <!-- 生成时间 -->
        <div style="margin-top: 16px; text-align: right; color: #909399">
          生成时间: {{ formatTimestamp(systemMonitor.generatedAt) }}
        </div>
      </div>
      <div v-else style="text-align: center; padding: 40px 0">
        <el-icon style="color: #909399; font-size: 40px; margin-bottom: 8px"><Loading /></el-icon>
        <div style="color: #909399">加载中...</div>
      </div>
    </el-card>

    <!-- 错误统计 -->
    <el-card class="mb-4">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <div style="display: flex; align-items: center; gap: 8px">
            <el-icon style="color: #e6a23c"><Warning /></el-icon>
            <span style="font-weight: 500">错误统计</span>
          </div>
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
      <div v-else style="text-align: center; padding: 40px 0">
        <el-icon style="color: #909399; font-size: 40px; margin-bottom: 8px"><Check /></el-icon>
        <div style="color: #909399">暂无错误信息</div>
      </div>
    </el-card>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import {
  Refresh,
  Loading,
  Check,
  View,
  Folder,
  Cpu,
  Connection,
  Warning,
  Histogram
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { cacheApi, healthApi, monitorApi } from '@/api/iot/collector'

// 响应式数据
const healthStatus = ref<any>(null)
const cacheStats = ref<any>(null)
const deviceMonitor = ref<any>(null)
const performanceMonitor = ref<any>(null)
const systemMonitor = ref<any>(null)
const errorMonitor = ref<any>(null)
const refreshing = ref(false)

// 获取系统健康状态
const getSystemHealth = async () => {
  try {
    healthStatus.value = await healthApi.getSystemHealth()
  } catch (error) {
    ElMessage.error('获取系统健康状态失败')
    console.error('获取系统健康状态失败:', error)
  }
}

// 获取缓存统计信息
const getCacheStats = async () => {
  try {
    cacheStats.value = await cacheApi.getCacheStats()
  } catch (error) {
    ElMessage.error('获取缓存统计信息失败')
    console.error('获取缓存统计信息失败:', error)
  }
}

// 获取设备状态监控
const getMonitorDevices = async () => {
  try {
    deviceMonitor.value = await monitorApi.getMonitorDevices()
  } catch (error) {
    ElMessage.error('获取设备状态监控失败')
    console.error('获取设备状态监控失败:', error)
  }
}

// 获取性能指标监控
const getMonitorPerformance = async () => {
  try {
    performanceMonitor.value = await monitorApi.getMonitorPerformance()
  } catch (error) {
    ElMessage.error('获取性能指标监控失败')
    console.error('获取性能指标监控失败:', error)
  }
}

// 获取系统资源监控
const getMonitorSystem = async () => {
  try {
    systemMonitor.value = await monitorApi.getMonitorSystem()
  } catch (error) {
    ElMessage.error('获取系统资源监控失败')
    console.error('获取系统资源监控失败:', error)
  }
}

// 获取错误统计
const getMonitorErrors = async () => {
  try {
    errorMonitor.value = await monitorApi.getMonitorErrors()
  } catch (error) {
    ElMessage.error('获取错误统计失败')
    console.error('获取错误统计失败:', error)
  }
}

// 格式化时间戳
const formatTimestamp = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 获取健康状态样式类
const getHealthStatusClass = (status: string) => {
  switch (status) {
    case 'UP':
    case 'HEALTHY':
      return 'text-green-500'
    case 'DOWN':
    case 'UNHEALTHY':
      return 'text-red-500'
    case 'UNKNOWN':
    default:
      return 'text-yellow-500'
  }
}

// 获取健康状态文本
const getHealthStatusText = (status: string) => {
  switch (status) {
    case 'UP':
    case 'HEALTHY':
      return '健康'
    case 'DOWN':
    case 'UNHEALTHY':
      return '异常'
    case 'UNKNOWN':
      return '未知'
    default:
      return status
  }
}

// 获取健康状态颜色
const getHealthStatusColor = (status: string) => {
  switch (status) {
    case 'UP':
    case 'HEALTHY':
      return '#67C23A'
    case 'DOWN':
    case 'UNHEALTHY':
      return '#F56C6C'
    case 'UNKNOWN':
    default:
      return '#E6A23C'
  }
}

// 格式化内存大小
const formatMemory = (bytes: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`
}

// 计算内存使用率
const calculateMemoryUsage = (used: number, total: number) => {
  if (!total) return 0
  return ((used / total) * 100).toFixed(2)
}

// 获取线程池数据
const getThreadPoolData = () => {
  if (!systemMonitor.value || !systemMonitor.value.threadPools) {
    return []
  }
  return Object.entries(systemMonitor.value.threadPools).map(([name, data]) => {
    return {
      name,
      ...data
    }
  })
}

// 刷新所有数据
const refreshAllData = async () => {
  refreshing.value = true
  try {
    await Promise.all([
      getSystemHealth(),
      getCacheStats(),
      getMonitorDevices(),
      getMonitorPerformance(),
      getMonitorSystem(),
      getMonitorErrors()
    ])
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
    console.error('数据刷新失败:', error)
  } finally {
    refreshing.value = false
  }
}

// 生命周期
onMounted(() => {
  refreshAllData()
})
</script>
