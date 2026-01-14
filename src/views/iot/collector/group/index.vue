<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="分组名称" prop="groupName">
        <el-input
          v-model="queryParams.groupName"
          placeholder="请输入分组名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="分组编码" prop="groupCode">
        <el-input
          v-model="queryParams.groupCode"
          placeholder="请输入分组编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="父分组" prop="parentId">
        <el-select
          v-model="queryParams.parentId"
          placeholder="请选择父分组"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="group in parentGroups"
            :key="group.id"
            :label="group.groupName"
            :value="group.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" v-hasPermi="['iot:collector-device-group:query']">
          <el-icon><Search /></el-icon>
          查询
        </el-button>
        <el-button @click="handleReset" v-hasPermi="['iot:collector-device-group:query']">重置</el-button>
        <el-button type="success" @click="handleCreate" v-hasPermi="['iot:collector-device-group:create']">
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
      <el-table-column prop="groupName" label="分组名称" sortable />
      <el-table-column prop="groupCode" label="分组编码" sortable />
      <el-table-column prop="parentId" label="父分组ID" width="100" sortable />
      <el-table-column prop="sortNo" label="排序" width="80" sortable />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            v-hasPermi="['iot:collector-device-group:update']"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['iot:collector-device-group:delete']"
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
      :title="isUpdate ? '编辑采集设备分组' : '新增采集设备分组'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="formData.groupName" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="分组编码" prop="groupCode">
          <el-input v-model="formData.groupCode" placeholder="请输入分组编码" />
        </el-form-item>
        <el-form-item label="父分组ID" prop="parentId">
          <el-select v-model="formData.parentId" placeholder="请选择父分组">
            <el-option label="根分组" value="0" />
            <el-option
              v-for="group in parentGroups"
              :key="group.id"
              :label="group.groupName"
              :value="group.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortNo">
          <el-input-number
            v-model="formData.sortNo"
            placeholder="请输入排序号"
            :min="0"
            :precision="0"
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
import { ref, reactive, onMounted } from 'vue'
import { Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { CollectorDeviceGroupApi, CollectorDeviceGroupVO } from '@/api/iot/collector'

defineOptions({ name: 'IotCollectorGroup' })

// 响应式数据
const queryParams = reactive({
  groupName: '',
  groupCode: '',
  parentId: undefined
})

const loading = ref(false)
const tableData = ref<CollectorDeviceGroupVO[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const queryFormRef = ref()
const formRef = ref()
const dialogVisible = ref(false)
const isUpdate = ref(false)
const formData = reactive<CollectorDeviceGroupVO>({
  id: 0,
  groupName: '',
  groupCode: '',
  parentId: 0,
  sortNo: 0,
  remark: '',
  creator: '',
  createTime: new Date(),
  updater: '',
  updateTime: new Date()
})

const parentGroups = ref<CollectorDeviceGroupVO[]>([])

// 表单验证规则
const formRules = reactive({
  groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
  groupCode: [{ required: true, message: '请输入分组编码', trigger: 'blur' }]
})

// 方法定义
const getGroupList = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      pageNo: pagination.current,
      pageSize: pagination.pageSize
    }
    const data = await CollectorDeviceGroupApi.getGroupPage(params)
    tableData.value = data.list
    pagination.total = data.total
  } catch (error) {
    ElMessage.error('获取分组列表失败')
  } finally {
    loading.value = false
  }
}

const getParentGroups = async () => {
  try {
    const data = await CollectorDeviceGroupApi.getGroupPage({ pageSize: 100 })
    parentGroups.value = data.list
  } catch (error) {
    ElMessage.error('获取父分组列表失败')
  }
}

const handleQuery = () => {
  pagination.current = 1
  getGroupList()
}

const handleReset = () => {
  queryFormRef.value.resetFields()
  pagination.current = 1
  getGroupList()
}

const handleCreate = () => {
  isUpdate.value = false
  formData.id = 0
  formData.groupName = ''
  formData.groupCode = ''
  formData.parentId = 0
  formData.sortNo = 0
  formData.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row: CollectorDeviceGroupVO) => {
  isUpdate.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该分组吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await CollectorDeviceGroupApi.deleteGroup(id)
    ElMessage.success('删除成功')
    getGroupList()
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
          await CollectorDeviceGroupApi.updateGroup(formData)
          ElMessage.success('更新成功')
        } else {
          await CollectorDeviceGroupApi.createGroup(formData)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        getGroupList()
      } catch (error) {
        ElMessage.error(isUpdate.value ? '更新失败' : '创建失败')
      }
    }
  })
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getGroupList()
}

const handleCurrentChange = (current: number) => {
  pagination.current = current
  getGroupList()
}

const handleSelectionChange = (selection: CollectorDeviceGroupVO[]) => {
  // 处理多选逻辑
}

// 生命周期
onMounted(() => {
  getGroupList()
  getParentGroups()
})
</script>
