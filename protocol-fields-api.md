# 根据协议类型获取字段配置接口

## 接口描述

根据指定的协议类型，返回该协议所需的字段配置信息，包括字段名称、类型、标签、是否必填、默认值和选项列表等。前端可以根据返回的字段配置动态生成表单。

## 接口信息

- **接口路径**: `/iot/collector-connection/protocol-fields`
- **请求方式**: `GET`
- **接口权限**: `iot:collector-connection:query`
- **Content-Type**: `application/x-www-form-urlencoded`

## 请求参数

| 参数名 | 类型 | 必填 | 说明 | 示例值 |
|--------|------|------|------|--------|
| protocolType | String | 是 | 协议类型 | MODBUS_RTU |

### 协议类型列表

| 协议类型 | 说明 |
|----------|------|
| MODBUS_RTU | Modbus RTU 协议（串口通信） |
| MODBUS_TCP | Modbus TCP 协议（以太网通信） |

## 响应参数

### 响应体结构

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": [
    {
      "fieldName": "slave_id",
      "fieldType": "number",
      "fieldLabel": "从站ID",
      "required": true,
      "defaultValue": "1",
      "options": null
    }
  ]
}
```

### 字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| code | Integer | 响应状态码，0表示成功 |
| msg | String | 响应消息 |
| data | Array | 字段配置列表 |

#### data 数组项说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| fieldName | String | 字段名称，用于表单提交时的参数名 |
| fieldType | String | 字段类型，前端用于选择合适的表单控件（number/string） |
| fieldLabel | String | 字段标签，用于表单显示的标签文本 |
| required | Boolean | 是否必填，true表示必填 |
| defaultValue | String | 默认值 |
| options | Array | 选项列表，用于下拉框控件，null表示不需要下拉框 |

## 响应示例

### MODBUS_RTU 协议响应示例

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": [
    {
      "fieldName": "slave_id",
      "fieldType": "number",
      "fieldLabel": "从站ID",
      "required": true,
      "defaultValue": "1",
      "options": null
    },
    {
      "fieldName": "serial_port",
      "fieldType": "string",
      "fieldLabel": "串口",
      "required": true,
      "defaultValue": "COM1",
      "options": null
    },
    {
      "fieldName": "baud_rate",
      "fieldType": "number",
      "fieldLabel": "波特率",
      "required": true,
      "defaultValue": "9600",
      "options": null
    },
    {
      "fieldName": "data_bits",
      "fieldType": "number",
      "fieldLabel": "数据位",
      "required": true,
      "defaultValue": "8",
      "options": null
    },
    {
      "fieldName": "stop_bits",
      "fieldType": "number",
      "fieldLabel": "停止位",
      "required": true,
      "defaultValue": "1",
      "options": null
    },
    {
      "fieldName": "parity",
      "fieldType": "string",
      "fieldLabel": "校验位",
      "required": true,
      "defaultValue": "none",
      "options": ["none", "odd", "even", "mark", "space"]
    },
    {
      "fieldName": "flow_control",
      "fieldType": "string",
      "fieldLabel": "流控",
      "required": false,
      "defaultValue": "none",
      "options": ["none", "rtscts", "xonxoff"]
    }
  ]
}
```

### MODBUS_TCP 协议响应示例

```json
{
  "code": 0,
  "msg": "操作成功",
  "data": [
    {
      "fieldName": "slave_id",
      "fieldType": "number",
      "fieldLabel": "从站ID",
      "required": true,
      "defaultValue": "1",
      "options": null
    },
    {
      "fieldName": "host",
      "fieldType": "string",
      "fieldLabel": "主机地址",
      "required": true,
      "defaultValue": "192.168.1.100",
      "options": null
    },
    {
      "fieldName": "port",
      "fieldType": "number",
      "fieldLabel": "端口号",
      "required": true,
      "defaultValue": "502",
      "options": null
    }
  ]
}
```

## 请求示例

### cURL 示例

```bash
curl -X GET "http://localhost:8080/iot/collector-connection/protocol-fields?protocolType=MODBUS_RTU" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/Fetch 示例

```javascript
fetch('http://localhost:8080/iot/collector-connection/protocol-fields?protocolType=MODBUS_RTU', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
```

### Axios 示例

```javascript
axios.get('/iot/collector-connection/protocol-fields', {
  params: {
    protocolType: 'MODBUS_RTU'
  },
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
  .then(response => {
    console.log(response.data);
  });
```

## 前端使用建议

### 1. 动态表单生成

根据返回的字段配置，可以使用以下方式动态生成表单：

```javascript
function generateForm(fields) {
  const form = document.createElement('form');

  fields.forEach(field => {
    const formGroup = document.createElement('div');

    const label = document.createElement('label');
    label.textContent = field.fieldLabel + (field.required ? ' *' : '');
    formGroup.appendChild(label);

    let input;
    if (field.options) {
      input = document.createElement('select');
      field.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        if (option === field.defaultValue) {
          optionElement.selected = true;
        }
        input.appendChild(optionElement);
      });
    } else {
      input = document.createElement('input');
      input.type = field.fieldType === 'number' ? 'number' : 'text';
      input.value = field.defaultValue || '';
    }

    input.name = field.fieldName;
    input.required = field.required;
    formGroup.appendChild(input);
    form.appendChild(formGroup);
  });

  return form;
}
```

### 2. Vue.js 示例

```vue
<template>
  <el-form :model="formData" :rules="rules" ref="formRef">
    <el-form-item
      v-for="field in fieldConfigs"
      :key="field.fieldName"
      :label="field.fieldLabel"
      :prop="field.fieldName"
      :required="field.required"
    >
      <el-select
        v-if="field.options"
        v-model="formData[field.fieldName]"
        :placeholder="`请选择${field.fieldLabel}`"
      >
        <el-option
          v-for="option in field.options"
          :key="option"
          :label="option"
          :value="option"
        />
      </el-select>
      <el-input
        v-else
        v-model="formData[field.fieldName]"
        :type="field.fieldType === 'number' ? 'number' : 'text'"
        :placeholder="`请输入${field.fieldLabel}`"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getProtocolFields } from '@/api/collector-connection';

const formData = ref({});
const fieldConfigs = ref([]);
const rules = ref({});

const loadFieldConfigs = async (protocolType) => {
  const { data } = await getProtocolFields({ protocolType });
  fieldConfigs.value = data;

  data.forEach(field => {
    formData.value[field.fieldName] = field.defaultValue || '';
    if (field.required) {
      rules.value[field.fieldName] = [
        { required: true, message: `请输入${field.fieldLabel}`, trigger: 'blur' }
      ];
    }
  });
};

onMounted(() => {
  loadFieldConfigs('MODBUS_RTU');
});
</script>
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0 | 操作成功 |
| 401 | 未授权，需要登录 |
| 403 | 无权限访问 |
| 400 | 请求参数错误 |

## 注意事项

1. 协议类型参数不区分大小写，`MODBUS_RTU`、`modbus_rtu`、`Modbus_Rtu` 均可
2. 如果传入的协议类型不存在，将返回空数组
3. 字段类型 `number` 对应前端数字输入框，`string` 对应文本输入框或下拉框
4. `options` 字段不为 null 时，前端应使用下拉框控件
5. 所有字段都包含 `defaultValue`，前端应使用该值作为初始值
