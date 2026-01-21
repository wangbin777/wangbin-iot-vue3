<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="80px"
    >
      <el-form-item label="设备编码" prop="deviceCode">
        <el-input
          v-model="queryParams.deviceCode"
          placeholder="请输入设备编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          v-model="queryParams.deviceName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="设备分组" prop="groupId">
        <el-select
          v-model="queryParams.groupId"
          placeholder="请选择设备分组"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="group in groups"
            :key="group.id"
            :label="group.groupName"
            :value="group.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="协议类型" prop="protocolType">
        <el-select
          v-model="queryParams.protocolType"
          placeholder="请选择协议类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="type in protocolTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择设备状态"
          clearable
          class="!w-240px"
        >
          <el-option label="在线" value="ONLINE" />
          <el-option label="离线" value="OFFLINE" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否启用" prop="enabled">
        <el-select
          v-model="queryParams.enabled"
          placeholder="请选择是否启用"
          clearable
          class="!w-240px"
        >
          <el-option label="启用" :value="true" />
          <el-option label="禁用" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" v-hasPermi="['iot:collector-device:query']">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset" v-hasPermi="['iot:collector-device:query']">重置</el-button>
        <el-button
          type="success"
          @click="handleCreate"
          v-hasPermi="['iot:collector-device:create']"
        >
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
      <el-table-column prop="deviceCode" label="设备编码" sortable />
      <el-table-column prop="deviceName" label="设备名称" sortable />
      <el-table-column prop="deviceAlias" label="设备别名" />
      <el-table-column prop="groupName" label="设备分组" />
      <el-table-column prop="protocolType" label="协议类型" />
      <el-table-column prop="enabled" label="是否启用" width="100">
        <template #default="scope">
          <el-switch
            v-model="scope.row.enabled"
            @change="handleEnableChange(scope.row)"
            active-value="true"
            inactive-value="false"
            v-hasPermi="['iot:collector-device:update']"
          />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="设备状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'ONLINE' ? 'success' : 'danger'">
            {{ scope.row.status === 'ONLINE' ? '在线' : '离线' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="collectionIntervalMs" label="采集周期(ms)" width="120" sortable />
      <el-table-column prop="reportIntervalS" label="上报周期(s)" width="120" sortable />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            v-hasPermi="['iot:collector-device:update']"
          >
            编辑
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
      :title="isUpdate ? '编辑采集设备' : '新增采集设备'"
      width="800px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <!-- 基础信息 -->
        <el-divider content-position="left">基础信息</el-divider>
        <el-form-item label="设备编码" prop="deviceCode">
          <el-input v-model="formData.deviceCode" placeholder="请输入设备编码" />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="formData.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备别名" prop="deviceAlias">
          <el-input v-model="formData.deviceAlias" placeholder="请输入设备别名" />
        </el-form-item>
        <el-form-item label="设备分组" prop="groupId">
          <el-select v-model="formData.groupId" placeholder="请选择设备分组">
            <el-option
              v-for="group in groups"
              :key="group.id"
              :label="group.groupName"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="协议类型" prop="protocolType">
          <el-select v-model="formData.protocolType" placeholder="请选择协议类型">
            <el-option
              v-for="type in protocolTypes"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="采集周期(ms)" prop="collectionIntervalMs">
          <el-input-number
            v-model="formData.collectionIntervalMs"
            :min="1000"
            :step="1000"
            placeholder="请输入采集周期"
          />
        </el-form-item>
        <el-form-item label="上报周期(s)" prop="reportIntervalS">
          <el-input-number
            v-model="formData.reportIntervalS"
            :min="1"
            :step="1"
            placeholder="请输入上报周期"
          />
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="formData.enabled" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注信息"
            type="textarea"
            :rows="3"
          />
        </el-form-item>

        <!-- 连接配置 -->
        <el-divider content-position="left">连接配置</el-divider>
        <el-form-item label="连接类型" prop="connection.connectionType">
          <el-select v-model="formData.connection.connectionType" placeholder="请选择连接类型">
            <el-option label="TCP" value="TCP" />
            <el-option label="UDP" value="UDP" />
            <el-option label="SERIAL" value="SERIAL" />
          </el-select>
        </el-form-item>

        <!-- TCP/UDP 配置 -->
        <template v-if="['TCP', 'UDP'].includes(formData.connection.connectionType)">
          <el-form-item label="主机地址" prop="connection.host">
            <el-input v-model="formData.connection.host" placeholder="请输入主机地址" />
          </el-form-item>
          <el-form-item label="端口号" prop="connection.port">
            <el-input-number
              v-model="formData.connection.port"
              :min="1"
              :max="65535"
              placeholder="请输入端口号"
            />
          </el-form-item>
        </template>

        <!-- 串口配置 -->
        <template v-if="formData.connection.connectionType === 'SERIAL'">
          <el-form-item label="串口名" prop="connection.serialPort">
            <el-input
              v-model="formData.connection.serialPort"
              placeholder="请输入串口名，如 COM3"
            />
          </el-form-item>
          <el-form-item label="波特率" prop="connection.baudRate">
            <el-select v-model="formData.connection.baudRate" placeholder="请选择波特率">
              <el-option label="9600" :value="9600" />
              <el-option label="19200" :value="19200" />
              <el-option label="38400" :value="38400" />
              <el-option label="57600" :value="57600" />
              <el-option label="115200" :value="115200" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据位" prop="connection.dataBits">
            <el-select v-model="formData.connection.dataBits" placeholder="请选择数据位">
              <el-option label="7" :value="7" />
              <el-option label="8" :value="8" />
            </el-select>
          </el-form-item>
          <el-form-item label="停止位" prop="connection.stopBits">
            <el-select v-model="formData.connection.stopBits" placeholder="请选择停止位">
              <el-option label="1" :value="1" />
              <el-option label="1.5" :value="1.5" />
              <el-option label="2" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="校验位" prop="connection.parity">
            <el-select v-model="formData.connection.parity" placeholder="请选择校验位">
              <el-option label="无" value="none" />
              <el-option label="奇校验" value="odd" />
              <el-option label="偶校验" value="even" />
            </el-select>
          </el-form-item>
          <el-form-item label="流控" prop="connection.flowControl">
            <el-select v-model="formData.connection.flowControl" placeholder="请选择流控">
              <el-option label="无" value="none" />
              <el-option label="硬件流控" value="hardware" />
              <el-option label="软件流控" value="software" />
            </el-select>
          </el-form-item>
        </template>

        <!-- 通用连接配置 -->
        <el-form-item label="连接超时(ms)" prop="connection.connectTimeoutMs">
          <el-input-number
            v-model="formData.connection.connectTimeoutMs"
            :min="1000"
            :step="1000"
            placeholder="请输入连接超时时间"
          />
        </el-form-item>
        <el-form-item label="读超时(ms)" prop="connection.readTimeoutMs">
          <el-input-number
            v-model="formData.connection.readTimeoutMs"
            :min="1000"
            :step="1000"
            placeholder="请输入读超时时间"
          />
        </el-form-item>
        <el-form-item label="写超时(ms)" prop="connection.writeTimeoutMs">
          <el-input-number
            v-model="formData.connection.writeTimeoutMs"
            :min="1000"
            :step="1000"
            placeholder="请输入写超时时间"
          />
        </el-form-item>
        <el-form-item label="重试次数" prop="connection.retries">
          <el-input-number
            v-model="formData.connection.retries"
            :min="0"
            :max="10"
            placeholder="请输入重试次数"
          />
        </el-form-item>
        <el-form-item label="扩展参数" prop="connection.extJson">
          <div class="w-full">
            <div class="mb-2">
              <el-button type="primary" size="small" @click="addExtParam">
                <el-icon><Plus /></el-icon>
                添加参数
              </el-button>
            </div>
            <div v-if="extParamsList.length === 0" class="text-gray-400 text-sm">
              暂无扩展参数，点击上方按钮添加
            </div>
            <div v-for="(item, index) in extParamsList" :key="index" class="flex gap-2 mb-2">
              <el-input v-model="item.key" placeholder="参数名" class="flex-1" />
              <el-input v-model="item.value" placeholder="参数值" class="flex-1" />
              <el-button type="danger" size="small" @click="removeExtParam(index)">删除</el-button>
            </div>
          </div>
        </el-form-item>

        <!-- 运行态配置 -->
        <el-divider content-position="left">运行态配置</el-divider>
        <el-form-item label="初始在线状态" prop="runtime.online">
          <el-select v-model="formData.runtime.online" placeholder="请选择初始在线状态">
            <el-option label="在线" :value="true" />
            <el-option label="离线" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="重试次数" prop="runtime.retryCount">
          <el-input-number
            v-model="formData.runtime.retryCount"
            :min="0"
            :max="10"
            placeholder="请输入重试次数"
          />
        </el-form-item>
        <el-form-item label="连续失败次数" prop="runtime.consecutiveFail">
          <el-input-number
            v-model="formData.runtime.consecutiveFail"
            :min="0"
            :max="100"
            placeholder="请输入连续失败次数"
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
import {
  CollectorConnectionApi,
  CollectorDeviceApi,
  CollectorDeviceGroupApi,
  CollectorDeviceRuntimeApi,
  CollectorDeviceVO
} from '@/api/iot/collector'

defineOptions({ name: 'IotCollectorDevice' })

// 连接配置子表单接口
interface ConnectionForm {
  connectionType: string // 连接类型：TCP/UDP/SERIAL
  host: string // 主机地址：IP或域名（TCP/UDP有效）
  port: number // 端口号（TCP/UDP有效）
  serialPort: string // 串口名（SERIAL有效）
  baudRate: number // 波特率（SERIAL有效）
  dataBits: number // 数据位（SERIAL有效）
  stopBits: number // 停止位（SERIAL有效）
  parity: string // 校验位（SERIAL有效）
  flowControl: string // 流控（SERIAL有效）
  connectTimeoutMs: number // 连接超时毫秒
  readTimeoutMs: number // 读超时毫秒
  writeTimeoutMs: number // 写超时毫秒
  retries: number // 重试次数
  extJson: string // 扩展连接参数JSON
}

// 运行态配置子表单接口
interface RuntimeForm {
  online: boolean // 是否在线：true在线/false离线
  retryCount: number // 当前连续失败重试次数
  consecutiveFail: number // 连续失败次数
}

// 整合后的设备表单接口
interface DeviceFormData {
  id: number // 设备ID
  deviceCode: string // 设备唯一业务ID
  deviceName: string // 设备名称
  deviceAlias: string // 设备别名
  groupId: number // 设备分组ID
  protocolType: string // 采集协议类型
  collectionIntervalMs: number // 采集周期（毫秒）
  reportIntervalS: number // 上报周期（秒）
  enabled: boolean // 是否启用
  status: string // 设备状态
  remark: string // 备注信息
  connection: ConnectionForm // 连接配置
  runtime: RuntimeForm // 运行态配置
}

// 响应式数据
const queryParams = reactive({
  deviceCode: '',
  deviceName: '',
  groupId: undefined,
  protocolType: '',
  enabled: undefined,
  status: ''
})

const loading = ref(false)
const tableData = ref<any[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const queryFormRef = ref()
const formRef = ref()
const dialogVisible = ref(false)
const isUpdate = ref(false)
const extParamsList = ref<Array<{ key: string; value: string }>>([])

// 设备表单数据
const formData = reactive<DeviceFormData>({
  id: 0,
  deviceCode: '',
  deviceName: '',
  deviceAlias: '',
  groupId: 0,
  protocolType: 'MODBUS_TCP',
  collectionIntervalMs: 5000,
  reportIntervalS: 60,
  enabled: true,
  status: 'OFFLINE',
  remark: '',
  connection: {
    connectionType: 'TCP',
    host: '',
    port: 0,
    serialPort: '',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: 'none',
    connectTimeoutMs: 3000,
    readTimeoutMs: 2000,
    writeTimeoutMs: 2000,
    retries: 3,
    extJson: '{}'
  },
  runtime: {
    online: false,
    retryCount: 0,
    consecutiveFail: 0
  }
})

const groups = ref<any[]>([])
const connections = ref<any[]>([])
const protocolTypes = [
  { label: 'MODBUS_TCP', value: 'MODBUS_TCP' },
  { label: 'MODBUS_RTU', value: 'MODBUS_RTU' },
  { label: 'OPCUA', value: 'OPCUA' },
  { label: 'MQTT', value: 'MQTT' }
]

// 表单验证规则
const formRules = reactive({
  deviceCode: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  protocolType: [{ required: true, message: '请选择协议类型', trigger: 'change' }],
  groupId: [{ required: true, message: '请选择设备分组', trigger: 'change' }],
  'connection.connectionType': [{ required: true, message: '请选择连接类型', trigger: 'change' }],
  'connection.host': [
    {
      required: () => ['TCP', 'UDP'].includes(formData.connection.connectionType),
      message: '请输入主机地址',
      trigger: 'blur'
    }
  ],
  'connection.port': [
    {
      required: () => ['TCP', 'UDP'].includes(formData.connection.connectionType),
      message: '请输入端口号',
      trigger: 'blur'
    }
  ],
  'connection.serialPort': [
    {
      required: () => formData.connection.connectionType === 'SERIAL',
      message: '请输入串口名',
      trigger: 'blur'
    }
  ]
})

// 方法定义
const getDeviceList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize
    }
    const data = await CollectorDeviceApi.getDevicePage(params)
    // 合并分组名称信息
    const deviceList = data.list.map((device: any) => {
      const group = groups.value.find((g) => g.id === device.groupId)
      return {
        ...device,
        groupName: group ? group.groupName : ''
      }
    })
    tableData.value = deviceList
    pagination.total = data.total
  } catch (error) {
    ElMessage.error('获取设备列表失败')
  } finally {
    loading.value = false
  }
}

const getGroups = async () => {
  try {
    const data = await CollectorDeviceGroupApi.getGroupPage({ pageSize: 100 })
    groups.value = data.list
  } catch (error) {
    ElMessage.error('获取分组列表失败')
  }
}

const getConnections = async () => {
  try {
    const data = await CollectorConnectionApi.getConnectionPage({ pageSize: 100 })
    connections.value = data.list
  } catch (error) {
    ElMessage.error('获取连接配置列表失败')
  }
}

const handleQuery = () => {
  pagination.current = 1
  getDeviceList()
}

const handleReset = () => {
  queryFormRef.value.resetFields()
  pagination.current = 1
  getDeviceList()
}

const handleCreate = () => {
  isUpdate.value = false
  // 初始化表单数据
  formData.id = 0
  formData.deviceCode = ''
  formData.deviceName = ''
  formData.deviceAlias = ''
  formData.groupId = 0
  formData.protocolType = 'MODBUS_TCP'
  formData.collectionIntervalMs = 5000
  formData.reportIntervalS = 60
  formData.enabled = true
  formData.status = 'OFFLINE'
  formData.remark = ''

  // 初始化连接配置
  formData.connection = {
    connectionType: 'TCP',
    host: '',
    port: 0,
    serialPort: '',
    baudRate: 9600,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
    flowControl: 'none',
    connectTimeoutMs: 3000,
    readTimeoutMs: 2000,
    writeTimeoutMs: 2000,
    retries: 3,
    extJson: '{}'
  }

  // 初始化运行态配置
  formData.runtime = {
    online: false,
    retryCount: 0,
    consecutiveFail: 0
  }

  // 初始化扩展参数列表
  extParamsList.value = []

  dialogVisible.value = true
}

const handleEdit = async (row: CollectorDeviceVO) => {
  isUpdate.value = true
  try {
    // 1. 获取设备基本信息
    const deviceData = await CollectorDeviceApi.getDevice(row.id)

    // 2. 获取连接配置信息
    const connectionData = await CollectorConnectionApi.getConnection(deviceData.connectionId)

    // 3. 获取运行态配置信息
    const runtimeData = await CollectorDeviceRuntimeApi.getRuntimeByDeviceId(row.id)

    // 合并数据到表单
    Object.assign(formData, {
      ...deviceData,
      connection: connectionData,
      runtime: runtimeData
    })

    // 解析扩展参数
    parseJsonToExtParams(connectionData.extJson || '{}')

    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取设备详情失败')
    console.error('获取设备详情失败:', error)
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该设备吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await CollectorDeviceApi.deleteDevice(id)
    ElMessage.success('删除成功')
    getDeviceList()
  } catch (error) {
    // 取消删除时不做处理
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        formData.connection.extJson = convertExtParamsToJson()
        if (isUpdate.value) {
          // 更新设备逻辑
          // 1. 更新连接配置
          // 2. 更新设备信息
          // 3. 更新运行态配置
          await CollectorConnectionApi.updateConnection(formData.connection)
          await CollectorDeviceApi.updateDevice(formData)
          await CollectorDeviceRuntimeApi.updateRuntime({
            ...formData.runtime,
            deviceId: formData.id
          })
          ElMessage.success('更新成功')
        } else {
          // 创建设备逻辑
          // 1. 创建连接配置
          const connectionId = await CollectorConnectionApi.createConnection(formData.connection)

          // 2. 创建设备
          const deviceId = await CollectorDeviceApi.createDevice({
            ...formData,
            connectionId
          })

          // 3. 创建运行态配置
          await CollectorDeviceRuntimeApi.createRuntime({
            ...formData.runtime,
            deviceId
          })

          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        getDeviceList()
      } catch (error: any) {
        ElMessage.error(isUpdate.value ? '更新失败' : '创建失败')
        console.error('提交失败:', error)
      }
    }
  })
}

const handleEnableChange = async (row: any) => {
  try {
    await CollectorDeviceApi.updateDevice({
      ...row,
      enabled: row.enabled
    })
    ElMessage.success('更新成功')
  } catch (error) {
    ElMessage.error('更新失败')
    // 恢复原来的状态
    row.enabled = !row.enabled
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getDeviceList()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  getDeviceList()
}

const handleSelectionChange = (selection: any[]) => {
  // 处理多选逻辑
}

const addExtParam = () => {
  extParamsList.value.push({ key: '', value: '' })
}

const removeExtParam = (index: number) => {
  extParamsList.value.splice(index, 1)
}

const convertExtParamsToJson = () => {
  const obj: Record<string, string> = {}
  extParamsList.value.forEach((item) => {
    if (item.key) {
      obj[item.key] = item.value
    }
  })
  return JSON.stringify(obj)
}

const parseJsonToExtParams = (jsonStr: string) => {
  try {
    const obj = JSON.parse(jsonStr || '{}')
    extParamsList.value = Object.keys(obj).map((key) => ({
      key,
      value: obj[key]
    }))
  } catch (error) {
    extParamsList.value = []
  }
}

// 生命周期
onMounted(() => {
  getGroups()
  getConnections()
  getDeviceList()
})
</script>
