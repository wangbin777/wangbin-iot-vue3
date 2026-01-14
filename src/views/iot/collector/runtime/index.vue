<template>
  <ContentWrap>
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <el-card shadow="hover" class="!h-24 !p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500">总设备数</div>
            <div class="text-2xl font-bold">{{ totalCount }}</div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <el-icon class="text-blue-600 text-xl"><Monitor /></el-icon>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="!h-24 !p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500">在线设备数</div>
            <div class="text-2xl font-bold text-green-600">{{ onlineCount }}</div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <el-icon class="text-green-600 text-xl"><CircleCheck /></el-icon>
          </div>
        </div>
      </el-card>
      <el-card shadow="hover" class="!h-24 !p-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500">离线设备数</div>
            <div class="text-2xl font-bold text-red-600">{{ offlineCount }}</div>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <el-icon class="text-red-600 text-xl"><CircleClose /></el-icon>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="设备ID" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入设备ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="在线状态" prop="online">
        <el-select
          v-model="queryParams.online"
          placeholder="请选择在线状态"
          clearable
          class="!w-240px"
        >
          <el-option label="在线" :value="true" />
          <el-option label="离线" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="错误码" prop="lastErrorCode">
        <el-input
          v-model="queryParams.lastErrorCode"
          placeholder="请输入最后错误码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" v-hasPermi="['iot:collector-device-runtime:query']">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset" v-hasPermi="['iot:collector-device-runtime:query']">重置</el-button>
        <el-button type="info" @click="handleRefresh" v-hasPermi="['iot:collector-device-runtime:query']">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="记录ID" width="80" sortable />
      <el-table-column prop="deviceId" label="设备ID" width="100" sortable />
      <el-table-column prop="deviceName" label="设备名称" width="150" />
      <el-table-column prop="online" label="在线状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.online ? 'success' : 'danger'" effect="dark">
            {{ scope.row.online ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastOnlineAt" label="最后在线时间" width="200" sortable>
        <template #default="scope">
          <span v-if="scope.row.lastOnlineAt">{{ formatDateTime(scope.row.lastOnlineAt) }}</span>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastHeartbeatAt" label="最后心跳时间" width="200" sortable>
        <template #default="scope">
          <span v-if="scope.row.lastHeartbeatAt">{{ formatDateTime(scope.row.lastHeartbeatAt) }}</span>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>
      <el-table-column label="心跳间隔" width="120">
        <template #default="scope">
          <span v-if="scope.row.lastHeartbeatAt" class="text-green-600">
            {{ calculateHeartbeatInterval(scope.row.lastHeartbeatAt) }}
          </span>
          <span v-else class="text-gray-400">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="lastErrorCode" label="最后错误码" width="150" />
      <el-table-column prop="lastErrorMsg" label="最后错误信息" width="200" />
      <el-table-column prop="retryCount" label="重试次数" width="100" sortable>
        <template #default="scope">
          <span :class="scope.row.retryCount > 0 ? 'text-yellow-600' : ''">{{ scope.row.retryCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="consecutiveFail" label="连续失败" width="100" sortable>
        <template #default="scope">
          <span :class="scope.row.consecutiveFail > 0 ? 'text-red-600' : ''">{{ scope.row.consecutiveFail || 0 }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="200" sortable />
    </el-table>

    <!-- 分页组件 -->
    <div class="mt-5 flex justify-end">
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 设备运行态详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="设备运行态详情"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="记录ID">{{ currentRuntime.id }}</el-descriptions-item>
        <el-descriptions-item label="设备ID">{{ currentRuntime.deviceId }}</el-descriptions-item>
        <el-descriptions-item label="设备名称">{{ currentRuntime.deviceName }}</el-descriptions-item>
        <el-descriptions-item label="在线状态">
          <el-tag :type="currentRuntime.online ? 'success' : 'danger'">
            {{ currentRuntime.online ? '在线' : '离线' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后在线时间">
          {{ currentRuntime.lastOnlineAt ? formatDateTime(currentRuntime.lastOnlineAt) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="最后心跳时间">
          {{ currentRuntime.lastHeartbeatAt ? formatDateTime(currentRuntime.lastHeartbeatAt) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="最后错误码">{{ currentRuntime.lastErrorCode || '-' }}</el-descriptions-item>
        <el-descriptions-item label="最后错误信息">{{ currentRuntime.lastErrorMsg || '-' }}</el-descriptions-item>
        <el-descriptions-item label="当前重试次数">{{ currentRuntime.retryCount }}</el-descriptions-item>
        <el-descriptions-item label="连续失败次数">{{ currentRuntime.consecutiveFail || 0 }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ formatDateTime(currentRuntime.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ formatDateTime(currentRuntime.updateTime) }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Search, Refresh, Monitor, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { CollectorDeviceRuntimeApi, CollectorDeviceRuntimeVO } from '@/api/iot/collector'
import { formatDateTime } from '@/utils/dateUtil'

// 响应式数据
const queryParams = reactive({
  deviceId: '',
  online: undefined,
  lastErrorCode: ''
})

const loading = ref(false)
const tableData = ref<any[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const queryFormRef = ref()
const detailDialogVisible = ref(false)
const currentRuntime = ref<CollectorDeviceRuntimeVO>({} as CollectorDeviceRuntimeVO)

// 统计数据
const totalCount = computed(() => pagination.total)
const onlineCount = computed(() => tableData.value.filter(item => item.online).length)
const offlineCount = computed(() => tableData.value.filter(item => !item.online).length)

// 方法定义
const getRuntimeList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize
    }
    const res = await CollectorDeviceRuntimeApi.getRuntimePage(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取设备运行态列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  pagination.current = 1
  getRuntimeList()
}

const handleReset = () => {
  queryFormRef.value.resetFields()
  pagination.current = 1
  getRuntimeList()
}

const handleRefresh = () => {
  getRuntimeList()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getRuntimeList()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  getRuntimeList()
}

const handleSelectionChange = (selection: any[]) => {
  // 处理多选逻辑
}

const handleViewDetail = (row: CollectorDeviceRuntimeVO) => {
  currentRuntime.value = row
  detailDialogVisible.value = true
}

// 计算心跳间隔
const calculateHeartbeatInterval = (lastHeartbeatAt: Date) => {
  const now = new Date().getTime()
  const last = new Date(lastHeartbeatAt).getTime()
  const diff = Math.floor((now - last) / 1000)
  
  if (diff < 60) {
    return `${diff}秒前`
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}分钟前`
  } else {
    return `${Math.floor(diff / 3600)}小时前`
  }
}

// 格式化日期时间
const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  getRuntimeList()
  // 每隔30秒自动刷新一次数据
  setInterval(() => {
    getRuntimeList()
  }, 30000)
})
</script>
