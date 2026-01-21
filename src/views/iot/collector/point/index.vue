<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
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
      <el-form-item label="点位ID" prop="pointId">
        <el-input
          v-model="queryParams.pointId"
          placeholder="请输入点位ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="点位编码" prop="pointCode">
        <el-input
          v-model="queryParams.pointCode"
          placeholder="请输入点位编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="点位名称" prop="pointName">
        <el-input
          v-model="queryParams.pointName"
          placeholder="请输入点位名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="数据类型" prop="dataType">
        <el-select
          v-model="queryParams.dataType"
          placeholder="请选择数据类型"
          clearable
          class="!w-240px"
        >
          <el-option label="BOOLEAN" value="BOOLEAN" />
          <el-option label="INT" value="INT" />
          <el-option label="FLOAT" value="FLOAT" />
          <el-option label="DOUBLE" value="DOUBLE" />
          <el-option label="STRING" value="STRING" />
        </el-select>
      </el-form-item>
      <el-form-item label="读写类型" prop="readWriter">
        <el-select
          v-model="queryParams.readWriter"
          placeholder="请选择读写类型"
          clearable
          class="!w-240px"
        >
          <el-option label="R" value="R" />
          <el-option label="RW" value="RW" />
          <el-option label="W" value="W" />
        </el-select>
      </el-form-item>
      <el-form-item label="采集模式" prop="collectionMode">
        <el-select
          v-model="queryParams.collectionMode"
          placeholder="请选择采集模式"
          clearable
          class="!w-240px"
        >
          <el-option label="POLLING" value="POLLING" />
          <el-option label="SUBSCRIPTION" value="SUBSCRIPTION" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-240px">
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" v-hasPermi="['iot:collector-point:query']">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset" v-hasPermi="['iot:collector-point:query']">重置</el-button>
        <el-button type="success" @click="handleCreate" v-hasPermi="['iot:collector-point:create']">
          <el-icon><Plus /></el-icon>
          新增
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
      <el-table-column prop="deviceId" label="设备ID" sortable />
      <el-table-column prop="pointId" label="点位ID" sortable />
      <el-table-column prop="pointCode" label="点位编码" sortable />
      <el-table-column prop="pointName" label="点位名称" sortable />
      <el-table-column prop="dataType" label="数据类型" width="100" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
            {{ scope.row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="minValue" label="最小值" width="100" sortable />
      <el-table-column prop="maxValue" label="最大值" width="100" sortable />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="alarmEnabled" label="告警启用" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.alarmEnabled === 1 ? 'success' : 'danger'">
            {{ scope.row.alarmEnabled === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            v-hasPermi="['iot:collector-point:update']"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['iot:collector-point:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isUpdate ? '编辑采集点位配置' : '新增采集点位配置'"
      width="900px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px">
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="formData.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="点位ID" prop="pointId">
          <el-input v-model="formData.pointId" placeholder="请输入点位ID（设备内唯一）" />
        </el-form-item>
        <el-form-item label="点位编码" prop="pointCode">
          <el-input
            v-model="formData.pointCode"
            placeholder="请输入点位编码（IOA_0001 / COIL_001 等）"
          />
        </el-form-item>
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="formData.pointName" placeholder="请输入点位名称" />
        </el-form-item>
        <el-form-item label="单元ID" prop="unitId">
          <el-input-number
            v-model="formData.unitId"
            :min="0"
            placeholder="请输入单元ID（Modbus unitId / IEC104 保留）"
          />
        </el-form-item>
        <el-form-item label="点位地址" prop="address">
          <el-input
            v-model="formData.address"
            placeholder="请输入点位地址（IOA / 寄存器 / OID / NodeId / URI）"
          />
        </el-form-item>
        <el-form-item label="数据类型" prop="dataType">
          <el-select v-model="formData.dataType" placeholder="请选择数据类型">
            <el-option label="BOOLEAN" value="BOOLEAN" />
            <el-option label="INT" value="INT" />
            <el-option label="FLOAT" value="FLOAT" />
            <el-option label="DOUBLE" value="DOUBLE" />
            <el-option label="STRING" value="STRING" />
          </el-select>
        </el-form-item>
        <el-form-item label="读写类型" prop="readWriter">
          <el-select v-model="formData.readWriter" placeholder="请选择读写类型">
            <el-option label="R（只读）" value="R" />
            <el-option label="RW（读写）" value="RW" />
            <el-option label="W（只写）" value="W" />
          </el-select>
        </el-form-item>
        <el-form-item label="采集模式" prop="collectionMode">
          <el-select v-model="formData.collectionMode" placeholder="请选择采集模式">
            <el-option label="POLLING（轮询）" value="POLLING" />
            <el-option label="SUBSCRIPTION（订阅）" value="SUBSCRIPTION" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>

        <!-- 采集配置 -->
        <el-divider content-position="left">采集配置</el-divider>
        <el-form-item label="基础采集周期(ms)" prop="baseCollectionInterval">
          <el-input-number
            v-model="formData.baseCollectionInterval"
            :min="0"
            :step="100"
            placeholder="请输入基础采集周期"
          />
        </el-form-item>
        <el-form-item label="最小采集周期(ms)" prop="minCollectionInterval">
          <el-input-number
            v-model="formData.minCollectionInterval"
            :min="0"
            :step="100"
            placeholder="请输入最小采集周期"
          />
        </el-form-item>
        <el-form-item label="最大采集周期(ms)" prop="maxCollectionInterval">
          <el-input-number
            v-model="formData.maxCollectionInterval"
            :min="0"
            :step="100"
            placeholder="请输入最大采集周期"
          />
        </el-form-item>
        <el-form-item label="点位变化阈值" prop="pointChangeThreshold">
          <el-input-number
            v-model="formData.pointChangeThreshold"
            :min="0"
            placeholder="请输入点位变化阈值"
          />
        </el-form-item>
        <el-form-item label="最小值" prop="minValue">
          <el-input-number v-model="formData.minValue" placeholder="请输入最小值" />
        </el-form-item>
        <el-form-item label="最大值" prop="maxValue">
          <el-input-number v-model="formData.maxValue" placeholder="请输入最大值" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="formData.unit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item label="采集优先级" prop="priority">
          <el-input-number v-model="formData.priority" :min="0" placeholder="请输入采集优先级" />
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="formData.defaultValue" placeholder="请输入默认值" />
        </el-form-item>

        <!-- 缓存配置 -->
        <el-divider content-position="left">缓存配置</el-divider>
        <el-form-item label="是否启用点位缓存" prop="cacheEnabled">
          <el-select v-model="formData.cacheEnabled" placeholder="请选择是否启用点位缓存">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="缓存时长(秒)" prop="cacheDuration">
          <el-input-number v-model="formData.cacheDuration" :min="0" placeholder="请输入缓存时长" />
        </el-form-item>

        <!-- 告警配置 -->
        <el-divider content-position="left">告警配置</el-divider>
        <el-form-item label="是否启用告警" prop="alarmEnabled">
          <el-select v-model="formData.alarmEnabled" placeholder="请选择是否启用告警">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="告警规则" prop="alarmRule">
          <el-input
            v-model="formData.alarmRule"
            placeholder="请输入告警规则JSON格式"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <!-- 扩展配置 -->
        <el-divider content-position="left">扩展配置</el-divider>
        <el-form-item label="扩展配置" prop="additionalConfig">
          <el-input
            v-model="formData.additionalConfig"
            placeholder="请输入扩展配置JSON格式（上报字段、设备信息等）"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注说明"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CollectorPointApi, CollectorPointVO } from '@/api/iot/collector'

defineOptions({ name: 'IotCollectorPoint' })

// 响应式数据
const queryParams = reactive({
  deviceId: '',
  pointId: '',
  pointCode: '',
  pointName: '',
  dataType: '',
  readWriter: '',
  collectionMode: '',
  status: undefined
})

const loading = ref(false)
const tableData = ref<CollectorPointVO[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const queryFormRef = ref()
const formRef = ref()
const dialogVisible = ref(false)
const isUpdate = ref(false)

// 点位表单数据
const formData = reactive<CollectorPointVO>({
  deviceId: '',
  pointId: '',
  pointCode: '',
  pointName: '',
  unitId: undefined,
  address: '',
  dataType: 'INT',
  readWriter: 'R',
  collectionMode: 'POLLING',
  status: 1,
  baseCollectionInterval: 1000,
  minCollectionInterval: 500,
  maxCollectionInterval: 5000,
  pointChangeThreshold: undefined,
  minValue: undefined,
  maxValue: undefined,
  unit: '',
  priority: undefined,
  defaultValue: '',
  cacheEnabled: 1,
  cacheDuration: 60,
  alarmEnabled: 1,
  alarmRule: '',
  additionalConfig: '',
  remark: ''
})

// 表单验证规则
const formRules = reactive({
  deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
  pointId: [{ required: true, message: '请输入点位ID', trigger: 'blur' }],
  address: [{ required: true, message: '请输入点位地址', trigger: 'blur' }],
  dataType: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
  readWriter: [{ required: true, message: '请选择读写类型', trigger: 'change' }],
  collectionMode: [{ required: true, message: '请选择采集模式', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  cacheEnabled: [{ required: true, message: '请选择是否启用点位缓存', trigger: 'change' }],
  alarmEnabled: [{ required: true, message: '请选择是否启用告警', trigger: 'change' }]
})

// 方法定义
const getPointList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize
    }
    const data = await CollectorPointApi.getPointPage(params)
    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    ElMessage.error('获取点位列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  pagination.current = 1
  getPointList()
}

const handleReset = () => {
  queryFormRef.value.resetFields()
  pagination.current = 1
  getPointList()
}

const handleCreate = () => {
  isUpdate.value = false
  // 初始化表单数据
  formData.id = undefined
  formData.deviceId = ''
  formData.pointId = ''
  formData.pointCode = ''
  formData.pointName = ''
  formData.unitId = undefined
  formData.address = ''
  formData.dataType = 'INT'
  formData.readWriter = 'R'
  formData.collectionMode = 'POLLING'
  formData.status = 1
  formData.baseCollectionInterval = 1000
  formData.minCollectionInterval = 500
  formData.maxCollectionInterval = 5000
  formData.pointChangeThreshold = undefined
  formData.minValue = undefined
  formData.maxValue = undefined
  formData.unit = ''
  formData.priority = undefined
  formData.defaultValue = ''
  formData.cacheEnabled = 1
  formData.cacheDuration = 60
  formData.alarmEnabled = 1
  formData.alarmRule = ''
  formData.additionalConfig = ''
  formData.remark = ''

  dialogVisible.value = true
}

const handleEdit = async (row: CollectorPointVO) => {
  isUpdate.value = true
  try {
    const data = await CollectorPointApi.getPoint(row.id!)
    Object.assign(formData, data)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取点位详情失败')
    console.error('获取点位详情失败:', error)
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该点位配置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await CollectorPointApi.deletePoint(id)
    ElMessage.success('删除成功')
    getPointList()
  } catch (error) {
    // 取消删除时不做处理
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (isUpdate.value) {
          await CollectorPointApi.updatePoint(formData)
          ElMessage.success('更新成功')
        } else {
          await CollectorPointApi.createPoint(formData)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        getPointList()
      } catch (error: any) {
        ElMessage.error(isUpdate.value ? '更新失败' : '创建失败')
        console.error('提交失败:', error)
      }
    }
  })
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getPointList()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  getPointList()
}

const handleSelectionChange = (selection: CollectorPointVO[]) => {
  // 处理多选逻辑
}

// 生命周期
onMounted(() => {
  getPointList()
})
</script>
