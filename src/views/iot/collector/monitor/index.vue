<template>
  <ContentWrap class="cyber-monitor-container">
    <!-- 网格背景 -->
    <div class="cyber-grid-background"></div>

    <!-- 顶部标题栏 -->
    <el-row :gutter="20" style="margin-bottom: 20px; position: relative; z-index: 10">
      <el-col :span="12">
        <h2 class="cyber-title">
          <span class="cyber-title-text">采集器监控中心</span>
          <span class="cyber-title-glow"></span>
        </h2>
      </el-col>
      <el-col :span="12" :offset="0" style="text-align: right">
        <el-button class="cyber-button" @click="refreshAllData" :loading="refreshing">
          <el-icon v-if="!refreshing"><Refresh /></el-icon>
          <el-icon v-else><Loading /></el-icon>
          {{ refreshing ? '刷新中...' : '刷新数据' }}
        </el-button>
      </el-col>
    </el-row>

    <!-- 系统健康状态 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><View /></el-icon>
            <span>系统健康状态</span>
          </div>
          <el-button class="cyber-button-small" @click="getSystemHealth">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="healthStatus">
        <!-- 系统整体状态 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="8">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value" :class="getHealthStatusClass(healthStatus.status)">
                  {{ getHealthStatusText(healthStatus.status) }}
                </div>
                <div class="cyber-stat-label">系统状态</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-blue">{{
                  formatTimestamp(healthStatus.timestamp)
                }}</div>
                <div class="cyber-stat-label">检查时间</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div
                  class="cyber-stat-value"
                  :class="healthStatus.up ? 'cyber-green' : 'cyber-red'"
                >
                  {{ healthStatus.up ? '正常' : '异常' }}
                </div>
                <div class="cyber-stat-label">运行状态</div>
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
          <el-card class="cyber-component-card">
            <template #header>
              <div class="cyber-card-header">
                <span class="cyber-component-name">{{ component.name }}</span>
                <el-tag
                  class="cyber-tag"
                  :class="
                    component.status === 'UP' || component.status === 'HEALTHY'
                      ? 'cyber-tag-success'
                      : component.status === 'DOWN' || component.status === 'UNHEALTHY'
                        ? 'cyber-tag-danger'
                        : 'cyber-tag-warning'
                  "
                >
                  {{ component.status }}
                </el-tag>
              </div>
            </template>
            <div class="cyber-component-detail">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">状态消息:</span>
                <span class="cyber-detail-value">{{ component.message }}</span>
              </div>
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">检查时间:</span>
                <span class="cyber-detail-value">{{ formatTimestamp(component.checkedAt) }}</span>
              </div>
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">运行状态:</span>
                <span
                  class="cyber-detail-value"
                  :class="component.up ? 'cyber-green' : 'cyber-red'"
                >
                  {{ component.up ? '正常' : '异常' }}
                </span>
              </div>

              <!-- 缓存组件详细信息 -->
              <div v-if="key === 'cache' && component.details" class="cyber-component-section">
                <h4 class="cyber-section-title">缓存详细信息:</h4>
                <el-row :gutter="10" style="margin-bottom: 12px">
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">最大缓存级别:</span>
                      <span class="cyber-detail-value">{{ component.details.maxLevel }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">总缓存级别:</span>
                      <span class="cyber-detail-value">{{ component.details.totalLevels }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">是否启用:</span>
                      <span class="cyber-detail-value">{{
                        component.details.enabled ? '是' : '否'
                      }}</span>
                    </div>
                  </el-col>
                </el-row>
                <div v-if="component.details.levels && component.details.levels.length > 0">
                  <h5 class="cyber-subsection-title">缓存级别详情:</h5>
                  <el-table
                    :data="component.details.levels"
                    border
                    size="small"
                    class="cyber-table"
                  >
                    <el-table-column prop="level" label="级别" width="80" />
                    <el-table-column prop="type" label="类型" width="150" />
                    <el-table-column prop="size" label="大小" width="80" />
                    <el-table-column prop="status" label="状态">
                      <template #default="scope">
                        <el-tag
                          class="cyber-tag"
                          :class="
                            scope.row.status === 'HEALTHY'
                              ? 'cyber-tag-success'
                              : 'cyber-tag-warning'
                          "
                        >
                          {{ scope.row.status }}
                        </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>

              <!-- 连接组件详细信息 -->
              <div
                v-if="key === 'connections' && component.details"
                class="cyber-component-section"
              >
                <h4 class="cyber-section-title">连接详细信息:</h4>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">总连接数:</span>
                      <span class="cyber-detail-value">{{
                        component.details.totalConnections
                      }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">活跃连接数:</span>
                      <span class="cyber-detail-value">{{
                        component.details.activeConnections
                      }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">离线连接数:</span>
                      <span class="cyber-detail-value">{{
                        component.details.offlineConnections
                      }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div v-else class="cyber-loading">
        <el-icon class="cyber-loading-icon"><Loading /></el-icon>
        <div class="cyber-loading-text">加载中...</div>
      </div>
    </el-card>

    <!-- 缓存监控 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><Folder /></el-icon>
            <span>缓存监控</span>
          </div>
          <el-button class="cyber-button-small" @click="getCacheStats">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="cacheStats">
        <!-- 缓存概览 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="8">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-blue">{{ cacheStats.totalHitRate }}</div>
                <div class="cyber-stat-label">总命中率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-yellow">{{ cacheStats.missRate }}</div>
                <div class="cyber-stat-label">总未命中率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-green">{{ cacheStats.totalAccess }}</div>
                <div class="cyber-stat-label">总访问次数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 缓存级别命中率 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-blue">{{ cacheStats.level1HitRate }}</div>
                <div class="cyber-stat-label">一级缓存命中率</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-yellow">{{ cacheStats.level2HitRate }}</div>
                <div class="cyber-stat-label">二级缓存命中率</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 缓存配置信息 -->
        <div class="cyber-component-section">
          <h4 class="cyber-section-title">缓存配置</h4>
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">最大缓存级别:</span>
                <span class="cyber-detail-value">{{ cacheStats.maxLevel }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">是否启用:</span>
                <span class="cyber-detail-value">{{ cacheStats.enabled ? '是' : '否' }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">缓存Aside:</span>
                <span class="cyber-detail-value">{{ cacheStats.cacheAside ? '是' : '否' }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">写穿透:</span>
                <span class="cyber-detail-value">{{ cacheStats.writeThrough ? '是' : '否' }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">读穿透:</span>
                <span class="cyber-detail-value">{{ cacheStats.readThrough ? '是' : '否' }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">总读取次数:</span>
                <span class="cyber-detail-value">{{ cacheStats.totalReads }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">总写入次数:</span>
                <span class="cyber-detail-value">{{ cacheStats.totalWrites }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">总删除次数:</span>
                <span class="cyber-detail-value">{{ cacheStats.totalDeletes }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 缓存级别详细信息 -->
        <div
          v-for="(stats, key) in cacheStats.levelStatistics"
          :key="key"
          style="margin-bottom: 16px"
        >
          <el-card class="cyber-component-card">
            <template #header>
              <div class="cyber-card-header">
                <span class="cyber-component-name">{{ key }}</span>
                <el-tag
                  class="cyber-tag"
                  :class="stats.initialized ? 'cyber-tag-success' : 'cyber-tag-danger'"
                >
                  {{ stats.initialized ? '已初始化' : '未初始化' }}
                </el-tag>
              </div>
            </template>
            <div class="cyber-component-detail">
              <el-row :gutter="10" style="margin-bottom: 12px">
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">缓存级别:</span>
                    <span class="cyber-detail-value">{{ stats.cacheLevel }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">缓存类型:</span>
                    <span class="cyber-detail-value">{{ stats.cacheType }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">缓存大小:</span>
                    <span class="cyber-detail-value">{{ stats.cacheSize }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">命中率:</span>
                    <span class="cyber-detail-value">{{ stats.hitRate }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">未命中率:</span>
                    <span class="cyber-detail-value">{{ stats.missRate }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">总访问次数:</span>
                    <span class="cyber-detail-value">{{
                      stats.totalGets || stats.totalCommandsProcessed
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">总命中次数:</span>
                    <span class="cyber-detail-value">{{
                      stats.totalHits || stats.keyspaceHits
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">总未命中次数:</span>
                    <span class="cyber-detail-value">{{
                      stats.totalMisses || stats.keyspaceMisses
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="cyber-detail-item">
                    <span class="cyber-detail-label">总写入次数:</span>
                    <span class="cyber-detail-value">{{ stats.totalPuts }}</span>
                  </div>
                </el-col>
              </el-row>

              <!-- Redis 特有信息 -->
              <div v-if="key === 'REDIS'" class="cyber-component-section">
                <h5 class="cyber-subsection-title">Redis 特有信息:</h5>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">Redis 版本:</span>
                      <span class="cyber-detail-value">{{ stats.redisVersion }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">已用内存:</span>
                      <span class="cyber-detail-value">{{ stats.usedMemory }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">连接客户端数:</span>
                      <span class="cyber-detail-value">{{ stats.connectedClients }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">Redis 命中率:</span>
                      <span class="cyber-detail-value">{{ stats.redisHitRate }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">Redis 未命中率:</span>
                      <span class="cyber-detail-value">{{ stats.redisMissRate }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>

              <!-- 本地缓存特有信息 -->
              <div v-if="key === 'LOCAL_CAFFEINE'" class="cyber-component-section">
                <h5 class="cyber-subsection-title">本地缓存特有信息:</h5>
                <el-row :gutter="10">
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">缓存大小:</span>
                      <span class="cyber-detail-value">{{ stats.estimatedSize }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">驱逐次数:</span>
                      <span class="cyber-detail-value">{{ stats.evictionCount }}</span>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">加载失败次数:</span>
                      <span class="cyber-detail-value">{{ stats.loadFailureCount }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <div v-else class="cyber-loading">
        <el-icon class="cyber-loading-icon"><Loading /></el-icon>
        <div class="cyber-loading-text">加载中...</div>
      </div>
    </el-card>

    <!-- 设备状态监控 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><Connection /></el-icon>
            <span>设备状态监控</span>
          </div>
          <el-button class="cyber-button-small" @click="getMonitorDevices">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="deviceMonitor">
        <!-- 连接与设备状态概览 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="5">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-blue">{{
                  deviceMonitor.totalConnections || 0
                }}</div>
                <div class="cyber-stat-label">总连接数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-green">{{
                  deviceMonitor.activeConnections || 0
                }}</div>
                <div class="cyber-stat-label">活跃连接数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-green">{{
                  deviceMonitor.healthyDevices || 0
                }}</div>
                <div class="cyber-stat-label">健康设备数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="5">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-yellow">{{
                  deviceMonitor.warningDevices || 0
                }}</div>
                <div class="cyber-stat-label">警告设备数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-red">{{ deviceMonitor.dangerDevices || 0 }}</div>
                <div class="cyber-stat-label">危险设备数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <!-- 连接详情 -->
        <div v-if="deviceMonitor.connections && deviceMonitor.connections.length > 0">
          <el-table :data="deviceMonitor.connections" border class="cyber-table">
            <el-table-column prop="deviceId" label="设备ID" width="100" />
            <el-table-column prop="status" label="状态" width="120">
              <template #default="scope">
                <el-tag
                  class="cyber-tag"
                  :class="scope.row.connected ? 'cyber-tag-success' : 'cyber-tag-danger'"
                >
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="connected" label="是否连接" width="100">
              <template #default="scope">
                <el-tag
                  class="cyber-tag"
                  :class="scope.row.connected ? 'cyber-tag-success' : 'cyber-tag-danger'"
                >
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
        <div v-else class="cyber-empty">
          <div class="cyber-empty-text">暂无连接信息</div>
        </div>
        <!-- 生成时间 -->
        <div class="cyber-timestamp">
          生成时间: {{ formatTimestamp(deviceMonitor.generatedAt) }}
        </div>
      </div>
      <div v-else class="cyber-loading">
        <el-icon class="cyber-loading-icon"><Loading /></el-icon>
        <div class="cyber-loading-text">加载中...</div>
      </div>
    </el-card>

    <!-- 性能指标监控 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><Histogram /></el-icon>
            <span>性能指标监控</span>
          </div>
          <el-button class="cyber-button-small" @click="getMonitorPerformance">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="performanceMonitor && performanceMonitor.length > 0">
        <el-table :data="performanceMonitor" border class="cyber-table">
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
      <div v-else class="cyber-loading">
        <el-icon class="cyber-loading-icon"><Loading /></el-icon>
        <div class="cyber-loading-text">加载中...</div>
      </div>
    </el-card>

    <!-- 性能详情监控 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><Cpu /></el-icon>
            <span>性能详情监控</span>
          </div>
          <el-button class="cyber-button-small" @click="getMonitorPerfDetail">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="perfDetailMonitor">
        <!-- 基本信息 -->
        <div class="cyber-component-section">
          <h4 class="cyber-section-title">基本信息</h4>
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">时间片数量:</span>
                <span class="cyber-detail-value">{{ perfDetailMonitor.timeSliceCount || 0 }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">时间片间隔(ms):</span>
                <span class="cyber-detail-value">{{
                  perfDetailMonitor.timeSliceIntervalMs || 0
                }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">生成时间:</span>
                <span class="cyber-detail-value">{{
                  formatTimestamp(perfDetailMonitor.generatedAt)
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 时间片执行时间 -->
        <div
          v-if="
            perfDetailMonitor.timeSliceExecutionTimes &&
            Object.keys(perfDetailMonitor.timeSliceExecutionTimes).length > 0
          "
          class="cyber-component-section"
        >
          <h4 class="cyber-section-title">时间片执行时间</h4>
          <el-table
            :data="
              Object.entries(perfDetailMonitor.timeSliceExecutionTimes).map(([slice, time]) => ({
                slice,
                time
              }))
            "
            border
            class="cyber-table"
          >
            <el-table-column prop="slice" label="时间片" width="100" />
            <el-table-column prop="time" label="执行时间(ms)" />
          </el-table>
        </div>

        <!-- 过载时间片 -->
        <div
          v-if="
            perfDetailMonitor.overloadedSlices &&
            Object.keys(perfDetailMonitor.overloadedSlices).length > 0
          "
          class="cyber-component-section"
        >
          <h4 class="cyber-section-title">过载时间片</h4>
          <el-table
            :data="
              Object.entries(perfDetailMonitor.overloadedSlices).map(([slice, time]) => ({
                slice,
                time
              }))
            "
            border
            class="cyber-table"
          >
            <el-table-column prop="slice" label="时间片" width="100" />
            <el-table-column prop="time" label="过载时间(ms)" />
          </el-table>
        </div>

        <!-- 最慢设备 -->
        <div
          v-if="
            perfDetailMonitor.slowestDevices &&
            Object.keys(perfDetailMonitor.slowestDevices).length > 0
          "
          class="cyber-component-section"
        >
          <h4 class="cyber-section-title">最慢设备</h4>
          <el-table
            :data="
              Object.entries(perfDetailMonitor.slowestDevices).map(([deviceId, time]) => ({
                deviceId,
                time
              }))
            "
            border
            class="cyber-table"
          >
            <el-table-column prop="deviceId" label="设备ID" width="150" />
            <el-table-column prop="time" label="执行时间(ms)" />
          </el-table>
        </div>

        <!-- 设备统计信息 -->
        <div
          v-if="
            perfDetailMonitor.deviceStats && Object.keys(perfDetailMonitor.deviceStats).length > 0
          "
          class="cyber-component-section"
        >
          <h4 class="cyber-section-title">设备统计信息</h4>
          <div
            v-for="(stats, deviceId) in perfDetailMonitor.deviceStats"
            :key="deviceId"
            style="margin-bottom: 16px"
          >
            <el-card class="cyber-component-card">
              <template #header>
                <div class="cyber-card-header">
                  <span class="cyber-component-name">设备 {{ deviceId }}</span>
                </div>
              </template>
              <div class="cyber-component-detail">
                <el-row :gutter="10">
                  <el-col :span="6" v-for="(value, key) in stats" :key="key">
                    <div class="cyber-detail-item">
                      <span class="cyber-detail-label">{{ key }}:</span>
                      <span class="cyber-detail-value">{{ value }}</span>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      <div v-else class="cyber-loading">
        <el-icon class="cyber-loading-icon"><Loading /></el-icon>
        <div class="cyber-loading-text">加载中...</div>
      </div>
    </el-card>

    <!-- 系统资源监控 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><Cpu /></el-icon>
            <span>系统资源监控</span>
          </div>
          <el-button class="cyber-button-small" @click="getMonitorSystem">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="systemMonitor">
        <!-- CPU 监控 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-green"
                  >{{ (systemMonitor.systemCpuLoad || 0).toFixed(2) }}%</div
                >
                <div class="cyber-stat-label">系统CPU负载</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-blue">
                  {{
                    systemMonitor.processCpuLoad === -1
                      ? '未知'
                      : (systemMonitor.processCpuLoad * 100).toFixed(2) + '%'
                  }}
                </div>
                <div class="cyber-stat-label">进程CPU负载</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 内存监控 -->
        <div class="cyber-component-section">
          <h4 class="cyber-section-title">内存使用情况</h4>
          <el-row :gutter="10">
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">堆内存使用:</span>
                <span class="cyber-detail-value">{{ formatMemory(systemMonitor.heapUsed) }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">堆内存提交:</span>
                <span class="cyber-detail-value">{{
                  formatMemory(systemMonitor.heapCommitted)
                }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">堆内存最大:</span>
                <span class="cyber-detail-value">{{ formatMemory(systemMonitor.heapMax) }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">堆内存使用率:</span>
                <span class="cyber-detail-value"
                  >{{ calculateMemoryUsage(systemMonitor.heapUsed, systemMonitor.heapMax) }}%</span
                >
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">非堆内存使用:</span>
                <span class="cyber-detail-value">{{
                  formatMemory(systemMonitor.nonHeapUsed)
                }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="cyber-detail-item">
                <span class="cyber-detail-label">非堆内存提交:</span>
                <span class="cyber-detail-value">{{
                  formatMemory(systemMonitor.nonHeapCommitted)
                }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 线程监控 -->
        <el-row :gutter="20" style="margin-bottom: 16px">
          <el-col :span="12">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value">{{ systemMonitor.threadCount }}</div>
                <div class="cyber-stat-label">总线程数</div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="cyber-stat-card">
              <div class="cyber-stat-content">
                <div class="cyber-stat-value cyber-yellow">{{
                  systemMonitor.daemonThreadCount
                }}</div>
                <div class="cyber-stat-label">守护线程数</div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 线程池监控 -->
        <div class="cyber-component-section">
          <h4 class="cyber-section-title">线程池状态</h4>
          <el-table :data="getThreadPoolData()" border class="cyber-table">
            <el-table-column prop="name" label="线程池名称" width="180" />
            <el-table-column prop="corePoolSize" label="核心线程数" width="100" />
            <el-table-column prop="maxPoolSize" label="最大线程数" width="100" />
            <el-table-column prop="activeCount" label="活跃线程数" width="100" />
            <el-table-column prop="queueSize" label="队列大小" width="100" />
            <el-table-column prop="completedTaskCount" label="已完成任务数" />
          </el-table>
        </div>

        <!-- 生成时间 -->
        <div class="cyber-timestamp">
          生成时间: {{ formatTimestamp(systemMonitor.generatedAt) }}
        </div>
      </div>
      <div v-else class="cyber-loading">
        <el-icon class="cyber-loading-icon"><Loading /></el-icon>
        <div class="cyber-loading-text">加载中...</div>
      </div>
    </el-card>

    <!-- 错误统计 -->
    <el-card class="mb-4 cyber-card">
      <template #header>
        <div class="cyber-card-header">
          <div class="cyber-card-title">
            <el-icon class="cyber-icon"><Warning /></el-icon>
            <span>错误统计</span>
          </div>
          <el-button class="cyber-button-small" @click="getMonitorErrors">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>
      <div v-if="errorMonitor && errorMonitor.errors && errorMonitor.errors.length > 0">
        <el-table :data="errorMonitor.errors" border class="cyber-table">
          <el-table-column prop="type" label="错误类型" width="200" />
          <el-table-column prop="count" label="错误次数" width="100" />
          <el-table-column prop="message" label="错误信息" />
        </el-table>
      </div>
      <div v-else class="cyber-empty">
        <el-icon class="cyber-loading-icon"><Check /></el-icon>
        <div class="cyber-empty-text">暂无错误信息</div>
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
const perfDetailMonitor = ref<any>(null)
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

// 获取性能详情监控
const getMonitorPerfDetail = async () => {
  try {
    perfDetailMonitor.value = await monitorApi.getMonitorPerfDetail()
  } catch (error) {
    ElMessage.error('获取性能详情监控失败')
    console.error('获取性能详情监控失败:', error)
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
      getMonitorErrors(),
      getMonitorPerfDetail()
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

<style scoped>
/* 赛博科幻风格样式 */
.cyber-monitor-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #e0e0e0;
  font-family: 'Rajdhani', 'Orbitron', sans-serif;
  position: relative;
  overflow: hidden;
}

/* 网格背景 */
.cyber-grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
  z-index: 1;
}

/* 标题样式 */
.cyber-title {
  position: relative;
  z-index: 10;
}

.cyber-title-text {
  font-size: 24px;
  font-weight: bold;
  color: #00ffff;
  text-shadow:
    0 0 10px #00ffff,
    0 0 20px #00ffff;
  letter-spacing: 2px;
}

.cyber-title-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  opacity: 0.3;
  animation: cyberGlow 2s ease-in-out infinite;
}

/* 卡片样式 */
.cyber-card {
  background: rgba(10, 10, 30, 0.8);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  z-index: 5;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00ffff, transparent);
  animation: cyberScan 3s linear infinite;
}

/* 卡片头部 */
.cyber-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 255, 255, 0.05);
  border-bottom: 1px solid rgba(0, 255, 255, 0.2);
}

.cyber-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #00ffff;
  font-weight: 500;
  letter-spacing: 1px;
}

.cyber-icon {
  color: #00ffff !important;
  font-size: 18px;
  filter: drop-shadow(0 0 5px #00ffff);
}

/* 按钮样式 */
.cyber-button {
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid #00ffff;
  color: #00ffff;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.cyber-button:hover {
  background: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
}

.cyber-button-small {
  background: rgba(0, 255, 255, 0.15);
  border: 1px solid #00ffff;
  color: #00ffff;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cyber-button-small:hover {
  background: rgba(0, 255, 255, 0.25);
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
}

/* 统计卡片 */
.cyber-stat-card {
  background: rgba(16, 16, 40, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.cyber-stat-card:hover {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
  transform: translateY(-5px);
}

.cyber-stat-content {
  text-align: center;
  padding: 24px;
}

.cyber-stat-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.cyber-stat-label {
  color: #b0b0b0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* 组件卡片 */
.cyber-component-card {
  background: rgba(16, 16, 40, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 8px;
  margin-bottom: 16px;
}

.cyber-component-name {
  color: #00ffff;
  font-weight: 500;
}

.cyber-component-detail {
  padding: 16px;
}

.cyber-component-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(0, 255, 255, 0.2);
}

/* 详情项 */
.cyber-detail-item {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.cyber-detail-label {
  color: #b0b0b0;
  font-size: 14px;
  min-width: 120px;
}

.cyber-detail-value {
  color: #e0e0e0;
  font-size: 14px;
}

/* 标签样式 */
.cyber-tag {
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cyber-tag-success {
  background: rgba(103, 194, 58, 0.2);
  border: 1px solid #67c23a;
  color: #67c23a;
}

.cyber-tag-danger {
  background: rgba(245, 108, 108, 0.2);
  border: 1px solid #f56c6c;
  color: #f56c6c;
}

.cyber-tag-warning {
  background: rgba(230, 162, 60, 0.2);
  border: 1px solid #e6a23c;
  color: #e6a23c;
}

/* 表格样式 */
.cyber-table {
  background: rgba(10, 10, 30, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 4px;
}

.cyber-table th {
  background: rgba(0, 255, 255, 0.1);
  color: #00ffff;
  border-bottom: 1px solid rgba(0, 255, 255, 0.3);
}

.cyber-table td {
  border-bottom: 1px solid rgba(0, 255, 255, 0.1);
  color: #e0e0e0;
}

.cyber-table tr:hover {
  background: rgba(0, 255, 255, 0.05);
}

/* 加载状态 */
.cyber-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
}

.cyber-loading-icon {
  font-size: 48px;
  color: #00ffff;
  filter: drop-shadow(0 0 10px #00ffff);
  animation: cyberPulse 2s ease-in-out infinite;
}

.cyber-loading-text {
  color: #00ffff;
  font-size: 16px;
  letter-spacing: 1px;
}

/* 空状态 */
.cyber-empty {
  text-align: center;
  padding: 40px 0;
  color: #b0b0b0;
}

.cyber-empty-text {
  font-size: 16px;
  letter-spacing: 1px;
}

/* 时间戳 */
.cyber-timestamp {
  margin-top: 16px;
  text-align: right;
  color: #b0b0b0;
  font-size: 12px;
  letter-spacing: 1px;
}

/* 章节标题 */
.cyber-section-title {
  color: #00ffff;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.cyber-subsection-title {
  color: #b0b0b0;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

/* 颜色类 */
.cyber-green {
  color: #67c23a;
  text-shadow: 0 0 5px #67c23a;
}

.cyber-red {
  color: #f56c6c;
  text-shadow: 0 0 5px #f56c6c;
}

.cyber-blue {
  color: #409eff;
  text-shadow: 0 0 5px #409eff;
}

.cyber-yellow {
  color: #e6a23c;
  text-shadow: 0 0 5px #e6a23c;
}

/* 动画 */
@keyframes cyberGlow {
  0%,
  100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

@keyframes cyberScan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes cyberPulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cyber-title-text {
    font-size: 20px;
  }

  .cyber-stat-value {
    font-size: 18px;
  }

  .cyber-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
