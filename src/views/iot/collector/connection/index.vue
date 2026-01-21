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
      <el-form-item label="连接类型" prop="connectionType">
        <el-select
          v-model="queryParams.connectionType"
          placeholder="请选择连接类型"
          clearable
          class="!w-240px"
        >
          <el-option label="TCP" value="TCP" />
          <el-option label="UDP" value="UDP" />
          <el-option label="SERIAL" value="SERIAL" />
        </el-select>
      </el-form-item>
      <el-form-item label="主机地址" prop="host">
        <el-input
          v-model="queryParams.host"
          placeholder="请输入主机地址"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleQuery"
          v-hasPermi="['iot:collector-connection:query']"
        >
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset" v-hasPermi="['iot:collector-connection:query']"
          >重置</el-button
        >
        <el-button
          type="success"
          @click="handleCreate"
          v-hasPermi="['iot:collector-connection:create']"
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
      <el-table-column prop="id" label="配置ID" width="80" sortable />
      <el-table-column prop="connectionType" label="连接类型" />
      <el-table-column label="连接地址" width="200">
        <template #default="scope">
          <template v-if="scope.row.connectionType === 'SERIAL'">
            {{ scope.row.serialPort }}
          </template>
          <template v-else> {{ scope.row.host }}:{{ scope.row.port }} </template>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="连接URL" width="200" />
      <el-table-column prop="connectTimeoutMs" label="连接超时(ms)" width="120" sortable />
      <el-table-column prop="readTimeoutMs" label="读超时(ms)" width="100" sortable />
      <el-table-column prop="writeTimeoutMs" label="写超时(ms)" width="100" sortable />
      <el-table-column prop="retries" label="重试次数" width="100" sortable />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="creator" label="创建人" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="180" sortable />
      <el-table-column prop="updater" label="更新人" width="100" />
      <el-table-column prop="updateTime" label="更新时间" width="180" sortable />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            v-hasPermi="['iot:collector-connection:update']"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['iot:collector-connection:delete']"
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
      :title="isUpdate ? '编辑连接配置' : '新增连接配置'"
      width="600px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="连接类型" prop="connectionType">
          <el-select
            v-model="formData.connectionType"
            placeholder="请选择连接类型"
            @change="handleConnectionTypeChange"
          >
            <el-option label="TCP" value="TCP" />
            <el-option label="UDP" value="UDP" />
            <el-option label="SERIAL" value="SERIAL" />
          </el-select>
        </el-form-item>

        <!-- TCP/UDP 配置项 -->
        <template v-if="formData.connectionType === 'TCP' || formData.connectionType === 'UDP'">
          <el-form-item label="主机地址" prop="host">
            <el-input v-model="formData.host" placeholder="请输入主机地址" />
          </el-form-item>
          <el-form-item label="端口号" prop="port">
            <el-input-number
              v-model="formData.port"
              :min="1"
              :max="65535"
              placeholder="请输入端口号"
            />
          </el-form-item>
          <el-form-item label="连接URL" prop="url">
            <el-input v-model="formData.url" placeholder="请输入连接URL" />
          </el-form-item>
        </template>

        <!-- 串口配置项 -->
        <template v-if="formData.connectionType === 'SERIAL'">
          <el-form-item label="串口名" prop="serialPort">
            <el-input v-model="formData.serialPort" placeholder="请输入串口名，如 COM3" />
          </el-form-item>
          <el-form-item label="波特率" prop="baudRate">
            <el-select v-model="formData.baudRate" placeholder="请选择波特率">
              <el-option label="9600" :value="9600" />
              <el-option label="19200" :value="19200" />
              <el-option label="38400" :value="38400" />
              <el-option label="57600" :value="57600" />
              <el-option label="115200" :value="115200" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据位" prop="dataBits">
            <el-select v-model="formData.dataBits" placeholder="请选择数据位">
              <el-option label="7" :value="7" />
              <el-option label="8" :value="8" />
            </el-select>
          </el-form-item>
          <el-form-item label="停止位" prop="stopBits">
            <el-select v-model="formData.stopBits" placeholder="请选择停止位">
              <el-option label="1" :value="1" />
              <el-option label="1.5" :value="1.5" />
              <el-option label="2" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="校验位" prop="parity">
            <el-select v-model="formData.parity" placeholder="请选择校验位">
              <el-option label="无" value="none" />
              <el-option label="奇校验" value="odd" />
              <el-option label="偶校验" value="even" />
            </el-select>
          </el-form-item>
          <el-form-item label="流控" prop="flowControl">
            <el-select v-model="formData.flowControl" placeholder="请选择流控">
              <el-option label="无" value="none" />
              <el-option label="硬件流控" value="hardware" />
              <el-option label="软件流控" value="software" />
            </el-select>
          </el-form-item>
        </template>

        <!-- 通用配置项 -->
        <el-form-item label="连接超时(ms)" prop="connectTimeoutMs">
          <el-input-number
            v-model="formData.connectTimeoutMs"
            :min="1000"
            :step="1000"
            placeholder="请输入连接超时时间"
          />
        </el-form-item>
        <el-form-item label="读超时(ms)" prop="readTimeoutMs">
          <el-input-number
            v-model="formData.readTimeoutMs"
            :min="1000"
            :step="1000"
            placeholder="请输入读超时时间"
          />
        </el-form-item>
        <el-form-item label="写超时(ms)" prop="writeTimeoutMs">
          <el-input-number
            v-model="formData.writeTimeoutMs"
            :min="1000"
            :step="1000"
            placeholder="请输入写超时时间"
          />
        </el-form-item>
        <el-form-item label="重试次数" prop="retries">
          <el-input-number
            v-model="formData.retries"
            :min="0"
            :max="10"
            placeholder="请输入重试次数"
          />
        </el-form-item>
        <el-form-item label="扩展参数" prop="extJson">
          <el-input
            v-model="formData.extJson"
            placeholder="请输入扩展参数JSON格式"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注信息"
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
import { ref, reactive, onMounted, computed } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CollectorConnectionApi, CollectorConnectionVO } from '@/api/iot/collector'

// 响应式数据
const queryParams = reactive({
  connectionType: '',
  host: ''
})

const loading = ref(false)
const tableData = ref<CollectorConnectionVO[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const queryFormRef = ref()
const formRef = ref()
const dialogVisible = ref(false)
const isUpdate = ref(false)
const formData = reactive<CollectorConnectionVO>({
  id: 0,
  connectionType: 'TCP',
  host: '',
  port: 0,
  url: '',
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
  extJson: '{}',
  remark: '',
  creator: '',
  createTime: new Date(),
  updater: '',
  updateTime: new Date()
})

// 表单验证规则
const formRules = reactive({
  connectionType: [{ required: true, message: '请选择连接类型', trigger: 'change' }],
  host: [
    {
      required: formData.connectionType === 'TCP' || formData.connectionType === 'UDP',
      message: '请输入主机地址',
      trigger: 'blur'
    }
  ],
  port: [
    {
      required: formData.connectionType === 'TCP' || formData.connectionType === 'UDP',
      message: '请输入端口号',
      trigger: 'blur'
    }
  ],
  serialPort: [
    { required: formData.connectionType === 'SERIAL', message: '请输入串口名', trigger: 'blur' }
  ]
})

// 方法定义
const getConnectionList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize
    }
    const res = await CollectorConnectionApi.getConnectionPage(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } catch (error) {
    ElMessage.error('获取连接配置列表失败')
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  pagination.current = 1
  getConnectionList()
}

const handleReset = () => {
  queryFormRef.value.resetFields()
  pagination.current = 1
  getConnectionList()
}

const handleCreate = () => {
  isUpdate.value = false
  formData.id = 0
  formData.connectionType = 'TCP'
  formData.host = ''
  formData.port = 0
  formData.url = ''
  formData.serialPort = ''
  formData.baudRate = 9600
  formData.dataBits = 8
  formData.stopBits = 1
  formData.parity = 'none'
  formData.flowControl = 'none'
  formData.connectTimeoutMs = 3000
  formData.readTimeoutMs = 2000
  formData.writeTimeoutMs = 2000
  formData.retries = 3
  formData.extJson = '{}'
  formData.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row: CollectorConnectionVO) => {
  isUpdate.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该连接配置吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await CollectorConnectionApi.deleteConnection(id)
    ElMessage.success('删除成功')
    getConnectionList()
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
          await CollectorConnectionApi.updateConnection(formData)
          ElMessage.success('更新成功')
        } else {
          await CollectorConnectionApi.createConnection(formData)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        getConnectionList()
      } catch (error) {
        ElMessage.error(isUpdate.value ? '更新失败' : '创建失败')
      }
    }
  })
}

const handleConnectionTypeChange = () => {
  // 切换连接类型时重置相关参数
  if (formData.connectionType === 'TCP' || formData.connectionType === 'UDP') {
    formData.serialPort = ''
    formData.baudRate = 9600
    formData.dataBits = 8
    formData.stopBits = 1
    formData.parity = 'none'
    formData.flowControl = 'none'
  } else {
    formData.host = ''
    formData.port = 0
  }
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getConnectionList()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  getConnectionList()
}

const handleSelectionChange = (selection: CollectorConnectionVO[]) => {
  // 处理多选逻辑
}

// 生命周期
onMounted(() => {
  getConnectionList()
})
</script>
