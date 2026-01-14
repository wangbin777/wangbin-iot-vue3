# 采集设备相关 API 接口文档

## 1. 采集设备分组 API

### 1.1 创建采集设备分组

**请求方式**：POST
**请求路径**：`/iot/collector-device-group/create`
**功能描述**：创建采集设备分组
**权限要求**：`iot:collector-device-group:create`

**请求体**：
```json
{
  "groupName": "分组名称",
  "groupCode": "分组编码",
  "parentId": 0,
  "remark": "备注信息"
}
```

**请求参数说明**：

| 字段名     | 类型   | 必填 | 描述                           | 示例         |
|------------|--------|------|--------------------------------|--------------|
| groupName  | String | 是   | 分组名称                       | PLC设备组    |
| groupCode  | String | 是   | 分组编码（唯一）               | PLC_GROUP_001|
| parentId   | Long   | 否   | 父分组ID，0表示根分组          | 0            |
| remark     | String | 否   | 备注信息                       | PLC设备分组  |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": 1 // 分组ID
}
```

### 1.2 更新采集设备分组

**请求方式**：POST
**请求路径**：`/iot/collector-device-group/update`
**功能描述**：更新采集设备分组
**权限要求**：`iot:collector-device-group:update`

**请求体**：
```json
{
  "id": 1,
  "groupName": "更新后的分组名称",
  "groupCode": "更新后的分组编码",
  "parentId": 0,
  "remark": "更新后的备注信息"
}
```

**请求参数说明**：

| 字段名     | 类型   | 必填 | 描述                           | 示例         |
|------------|--------|------|--------------------------------|--------------|
| id         | Long   | 是   | 分组ID                         | 1            |
| groupName  | String | 是   | 分组名称                       | 更新后的PLC设备组 |
| groupCode  | String | 是   | 分组编码（唯一）               | PLC_GROUP_001|
| parentId   | Long   | 否   | 父分组ID，0表示根分组          | 0            |
| remark     | String | 否   | 备注信息                       | 更新后的PLC设备分组 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 1.3 删除采集设备分组

**请求方式**：DELETE
**请求路径**：`/iot/collector-device-group/delete`
**功能描述**：删除采集设备分组
**权限要求**：`iot:collector-device-group:delete`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述     | 示例 |
|--------|--------|------|----------|------|
| id     | Long   | 是   | 分组ID   | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 1.4 获取采集设备分组详情

**请求方式**：GET
**请求路径**：`/iot/collector-device-group/get`
**功能描述**：根据ID获取采集设备分组详情
**权限要求**：`iot:collector-device-group:query`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述     | 示例 |
|--------|--------|------|----------|------|
| id     | Long   | 是   | 分组ID   | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "groupName": "PLC设备组",
    "groupCode": "PLC_GROUP_001",
    "parentId": 0,
    "remark": "PLC设备分组",
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

### 1.5 获取采集设备分组列表

**请求方式**：GET
**请求路径**：`/iot/collector-device-group/list`
**功能描述**：根据ID列表获取采集设备分组列表
**权限要求**：`iot:collector-device-group:query`

**请求参数**：

| 字段名 | 类型       | 必填 | 描述           | 示例       |
|--------|------------|------|----------------|------------|
| ids    | List<Long> | 是   | 分组ID列表     | 1,2,3      |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "groupName": "PLC设备组",
      "groupCode": "PLC_GROUP_001",
      "parentId": 0,
      "remark": "PLC设备分组",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

### 1.6 获取采集设备分组分页

**请求方式**：GET
**请求路径**：`/iot/collector-device-group/page`
**功能描述**：分页获取采集设备分组列表
**权限要求**：`iot:collector-device-group:query`

**请求参数**：

| 字段名     | 类型   | 必填 | 描述                           | 示例         |
|------------|--------|------|--------------------------------|--------------|
| pageNo     | Integer| 否   | 页码，默认1                    | 1            |
| pageSize   | Integer| 否   | 每页条数，默认10               | 10           |
| groupName  | String | 否   | 分组名称（模糊查询）           | PLC          |
| groupCode  | String | 否   | 分组编码（模糊查询）           | PLC_GROUP    |
| parentId   | Long   | 否   | 父分组ID                       | 0            |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "total": 10,
    "list": [
      {
        "id": 1,
        "groupName": "PLC设备组",
        "groupCode": "PLC_GROUP_001",
        "parentId": 0,
        "remark": "PLC设备分组",
        "creator": "admin",
        "createTime": "2026-01-12T10:00:00",
        "updater": "admin",
        "updateTime": "2026-01-12T10:00:00"
      }
    ],
    "pageNo": 1,
    "pageSize": 10
  }
}
```

## 2. 采集设备 API

### 2.1 创建采集设备

**请求方式**：POST
**请求路径**：`/iot/collector-device/create`
**功能描述**：创建采集设备
**权限要求**：`iot:collector-device:create`

**请求体**：
```json
{
  "deviceCode": "PLC001",
  "deviceName": "西门子S7-1200 PLC",
  "deviceAlias": "PLC设备1",
  "groupId": 1,
  "protocolType": "MODBUS_TCP",
  "connectionId": 1,
  "collectionIntervalMs": 5000,
  "reportIntervalS": 60,
  "enabled": true,
  "remark": "西门子PLC设备"
}
```

**请求参数说明**：

| 字段名                 | 类型   | 必填 | 描述                           | 示例         |
|------------------------|--------|------|--------------------------------|--------------|
| deviceCode             | String | 是   | 设备唯一业务ID                 | PLC001       |
| deviceName             | String | 是   | 设备名称                       | 西门子S7-1200 PLC |
| deviceAlias            | String | 否   | 设备别名                       | PLC设备1     |
| groupId                | Long   | 否   | 设备分组ID                     | 1            |
| protocolType           | String | 是   | 采集协议类型                   | MODBUS_TCP   |
| connectionId           | Long   | 是   | 连接配置ID                     | 1            |
| collectionIntervalMs   | Integer| 否   | 采集周期（毫秒）               | 5000         |
| reportIntervalS        | Integer| 否   | 上报周期（秒）                 | 60           |
| enabled                | Boolean| 是   | 是否启用                       | true         |
| remark                 | String | 否   | 备注信息                       | 西门子PLC设备 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": 1 // 设备ID
}
```

### 2.2 更新采集设备

**请求方式**：POST
**请求路径**：`/iot/collector-device/update`
**功能描述**：更新采集设备
**权限要求**：`iot:collector-device:update`

**请求体**：
```json
{
  "id": 1,
  "deviceCode": "PLC001",
  "deviceName": "西门子S7-1200 PLC（更新）",
  "deviceAlias": "PLC设备1",
  "groupId": 1,
  "protocolType": "MODBUS_TCP",
  "connectionId": 1,
  "collectionIntervalMs": 10000,
  "reportIntervalS": 60,
  "enabled": true,
  "remark": "更新后的西门子PLC设备"
}
```

**请求参数说明**：

| 字段名                 | 类型   | 必填 | 描述                           | 示例         |
|------------------------|--------|------|--------------------------------|--------------|
| id                     | Long   | 是   | 设备ID                         | 1            |
| deviceCode             | String | 是   | 设备唯一业务ID                 | PLC001       |
| deviceName             | String | 是   | 设备名称                       | 西门子S7-1200 PLC（更新） |
| deviceAlias            | String | 否   | 设备别名                       | PLC设备1     |
| groupId                | Long   | 否   | 设备分组ID                     | 1            |
| protocolType           | String | 是   | 采集协议类型                   | MODBUS_TCP   |
| connectionId           | Long   | 是   | 连接配置ID                     | 1            |
| collectionIntervalMs   | Integer| 否   | 采集周期（毫秒）               | 10000        |
| reportIntervalS        | Integer| 否   | 上报周期（秒）                 | 60           |
| enabled                | Boolean| 是   | 是否启用                       | true         |
| remark                 | String | 否   | 备注信息                       | 更新后的西门子PLC设备 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 2.3 删除采集设备

**请求方式**：DELETE
**请求路径**：`/iot/collector-device/delete`
**功能描述**：删除采集设备
**权限要求**：`iot:collector-device:delete`

**请求参数**：
| 字段名 | 类型   | 必填 | 描述     | 示例 |
|--------|--------|------|----------|------|
| id     | Long   | 是   | 设备ID   | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 2.4 获取采集设备详情

**请求方式**：GET
**请求路径**：`/iot/collector-device/get`
**功能描述**：根据ID获取采集设备详情
**权限要求**：`iot:collector-device:query`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述     | 示例 |
|--------|--------|------|----------|------|
| id     | Long   | 是   | 设备ID   | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "deviceCode": "PLC001",
    "deviceName": "西门子S7-1200 PLC",
    "deviceAlias": "PLC设备1",
    "groupId": 1,
    "protocolType": "MODBUS_TCP",
    "connectionId": 1,
    "collectionIntervalMs": 5000,
    "reportIntervalS": 60,
    "enabled": true,
    "status": "ONLINE",
    "remark": "西门子PLC设备",
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

### 2.5 获取采集设备列表

**请求方式**：GET
**请求路径**：`/iot/collector-device/list`
**功能描述**：根据ID列表获取采集设备列表
**权限要求**：`iot:collector-device:query`

**请求参数**：

| 字段名 | 类型       | 必填 | 描述           | 示例       |
|--------|------------|------|----------------|------------|
| ids    | List<Long> | 是   | 设备ID列表     | 1,2,3      |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceCode": "PLC001",
      "deviceName": "西门子S7-1200 PLC",
      "deviceAlias": "PLC设备1",
      "groupId": 1,
      "protocolType": "MODBUS_TCP",
      "connectionId": 1,
      "collectionIntervalMs": 5000,
      "reportIntervalS": 60,
      "enabled": true,
      "status": "ONLINE",
      "remark": "西门子PLC设备",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

### 2.6 获取采集设备分页

**请求方式**：GET
**请求路径**：`/iot/collector-device/page`
**功能描述**：分页获取采集设备列表
**权限要求**：`iot:collector-device:query`

**请求参数**：

| 字段名                 | 类型   | 必填 | 描述                           | 示例         |
|------------------------|--------|------|--------------------------------|--------------|
| pageNo                 | Integer| 否   | 页码，默认1                    | 1            |
| pageSize               | Integer| 否   | 每页条数，默认10               | 10           |
| deviceCode             | String | 否   | 设备编码（模糊查询）           | PLC          |
| deviceName             | String | 否   | 设备名称（模糊查询）           | 西门子       |
| groupId                | Long   | 否   | 设备分组ID                     | 1            |
| protocolType           | String | 否   | 采集协议类型                   | MODBUS_TCP   |
| enabled                | Boolean| 否   | 是否启用                       | true         |
| status                 | String | 否   | 设备状态                       | ONLINE       |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "total": 10,
    "list": [
      {
        "id": 1,
        "deviceCode": "PLC001",
        "deviceName": "西门子S7-1200 PLC",
        "deviceAlias": "PLC设备1",
        "groupId": 1,
        "protocolType": "MODBUS_TCP",
        "connectionId": 1,
        "collectionIntervalMs": 5000,
        "reportIntervalS": 60,
        "enabled": true,
        "status": "ONLINE",
        "remark": "西门子PLC设备",
        "creator": "admin",
        "createTime": "2026-01-12T10:00:00",
        "updater": "admin",
        "updateTime": "2026-01-12T10:00:00"
      }
    ],
    "pageNo": 1,
    "pageSize": 10
  }
}
```

## 3. 采集连接配置 API

### 3.1 创建采集连接配置

**请求方式**：POST
**请求路径**：`/iot/collector-connection/create`
**功能描述**：创建采集连接配置
**权限要求**：`iot:collector-connection:create`

**请求体**：
```json
{
  "connectionType": "TCP",
  "host": "192.168.1.100",
  "port": 502,
  "connectTimeoutMs": 3000,
  "readTimeoutMs": 2000,
  "writeTimeoutMs": 2000,
  "retries": 3,
  "remark": "MODBUS TCP连接"
}
```

**请求参数说明**：

| 字段名               | 类型   | 必填 | 描述                           | 示例         |
|----------------------|--------|------|--------------------------------|--------------|
| connectionType       | String | 是   | 连接类型：TCP/UDP/SERIAL       | TCP          |
| host                 | String | 否   | 主机地址：IP或域名（TCP/UDP有效） | 192.168.1.100 |
| port                 | Integer| 否   | 端口号（TCP/UDP有效）          | 502          |
| serialPort           | String | 否   | 串口名（SERIAL有效）           | COM3         |
| baudRate             | Integer| 否   | 波特率（SERIAL有效）           | 9600         |
| dataBits             | Integer| 否   | 数据位（SERIAL有效）           | 8            |
| stopBits             | Double | 否   | 停止位（SERIAL有效）           | 1.0          |
| parity               | String | 否   | 校验位（SERIAL有效）           | none         |
| flowControl          | String | 否   | 流控（SERIAL有效）             | none         |
| connectTimeoutMs     | Integer| 否   | 连接超时毫秒                   | 3000         |
| readTimeoutMs        | Integer| 否   | 读超时毫秒                     | 2000         |
| writeTimeoutMs       | Integer| 否   | 写超时毫秒                     | 2000         |
| retries              | Integer| 否   | 重试次数                       | 3            |
| extJson              | String | 否   | 扩展连接参数JSON               | {}           |
| remark               | String | 否   | 备注信息                       | MODBUS TCP连接 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": 1 // 连接配置ID
}
```

### 3.2 更新采集连接配置

**请求方式**：POST
**请求路径**：`/iot/collector-connection/update`
**功能描述**：更新采集连接配置
**权限要求**：`iot:collector-connection:update`

**请求体**：
```json
{
  "id": 1,
  "connectionType": "TCP",
  "host": "192.168.1.101",
  "port": 502,
  "connectTimeoutMs": 3000,
  "readTimeoutMs": 2000,
  "writeTimeoutMs": 2000,
  "retries": 3,
  "remark": "更新后的MODBUS TCP连接"
}
```

**请求参数说明**：

| 字段名               | 类型   | 必填 | 描述                           | 示例         |
|----------------------|--------|------|--------------------------------|--------------|
| id                   | Long   | 是   | 连接配置ID                     | 1            |
| connectionType       | String | 是   | 连接类型：TCP/UDP/SERIAL       | TCP          |
| host                 | String | 否   | 主机地址：IP或域名（TCP/UDP有效） | 192.168.1.101 |
| port                 | Integer| 否   | 端口号（TCP/UDP有效）          | 502          |
| serialPort           | String | 否   | 串口名（SERIAL有效）           | COM3         |
| baudRate             | Integer| 否   | 波特率（SERIAL有效）           | 9600         |
| dataBits             | Integer| 否   | 数据位（SERIAL有效）           | 8            |
| stopBits             | Double | 否   | 停止位（SERIAL有效）           | 1.0          |
| parity               | String | 否   | 校验位（SERIAL有效）           | none         |
| flowControl          | String | 否   | 流控（SERIAL有效）             | none         |
| connectTimeoutMs     | Integer| 否   | 连接超时毫秒                   | 3000         |
| readTimeoutMs        | Integer| 否   | 读超时毫秒                     | 2000         |
| writeTimeoutMs       | Integer| 否   | 写超时毫秒                     | 2000         |
| retries              | Integer| 否   | 重试次数                       | 3            |
| extJson              | String | 否   | 扩展连接参数JSON               | {}           |
| remark               | String | 否   | 备注信息                       | 更新后的MODBUS TCP连接 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 3.3 删除采集连接配置

**请求方式**：DELETE
**请求路径**：`/iot/collector-connection/delete`
**功能描述**：删除采集连接配置
**权限要求**：`iot:collector-connection:delete`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述     | 示例 |
|--------|--------|------|----------|------|
| id     | Long   | 是   | 连接配置ID | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 3.4 获取采集连接配置详情

**请求方式**：GET
**请求路径**：`/iot/collector-connection/get`
**功能描述**：根据ID获取采集连接配置详情
**权限要求**：`iot:collector-connection:query`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述     | 示例 |
|--------|--------|------|----------|------|
| id     | Long   | 是   | 连接配置ID | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "connectionType": "TCP",
    "host": "192.168.1.100",
    "port": 502,
    "connectTimeoutMs": 3000,
    "readTimeoutMs": 2000,
    "writeTimeoutMs": 2000,
    "retries": 3,
    "remark": "MODBUS TCP连接",
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

### 3.5 获取采集连接配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-connection/list`
**功能描述**：根据ID列表获取采集连接配置列表
**权限要求**：`iot:collector-connection:query`

**请求参数**：

| 字段名 | 类型       | 必填 | 描述           | 示例       |
|--------|------------|------|----------------|------------|
| ids    | List<Long> | 是   | 连接配置ID列表 | 1,2,3      |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "connectionType": "TCP",
      "host": "192.168.1.100",
      "port": 502,
      "connectTimeoutMs": 3000,
      "readTimeoutMs": 2000,
      "writeTimeoutMs": 2000,
      "retries": 3,
      "remark": "MODBUS TCP连接",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

### 3.6 获取采集连接配置分页

**请求方式**：GET
**请求路径**：`/iot/collector-connection/page`
**功能描述**：分页获取采集连接配置列表
**权限要求**：`iot:collector-connection:query`

**请求参数**：

| 字段名               | 类型   | 必填 | 描述                           | 示例         |
|----------------------|--------|------|--------------------------------|--------------|
| pageNo               | Integer| 否   | 页码，默认1                    | 1            |
| pageSize             | Integer| 否   | 每页条数，默认10               | 10           |
| connectionType       | String | 否   | 连接类型：TCP/UDP/SERIAL       | TCP          |
| host                 | String | 否   | 主机地址（模糊查询）           | 192.168.1.   |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "total": 10,
    "list": [
      {
        "id": 1,
        "connectionType": "TCP",
        "host": "192.168.1.100",
        "port": 502,
        "connectTimeoutMs": 3000,
        "readTimeoutMs": 2000,
        "writeTimeoutMs": 2000,
        "retries": 3,
        "remark": "MODBUS TCP连接",
        "creator": "admin",
        "createTime": "2026-01-12T10:00:00",
        "updater": "admin",
        "updateTime": "2026-01-12T10:00:00"
      }
    ],
    "pageNo": 1,
    "pageSize": 10
  }
}
```

## 4. 采集设备运行态 API

### 4.1 创建采集设备运行态

**请求方式**：POST
**请求路径**：`/iot/collector-device-runtime/create`
**功能描述**：创建采集设备运行态记录
**权限要求**：`iot:collector-device-runtime:create`

**请求体**：
```json
{
  "deviceId": 1,
  "online": true,
  "lastOnlineAt": "2026-01-12T10:00:00",
  "lastHeartbeatAt": "2026-01-12T10:00:00",
  "retryCount": 0,
  "consecutiveFail": 0
}
```

**请求参数说明**：

| 字段名               | 类型   | 必填 | 描述                           | 示例                     |
|----------------------|--------|------|--------------------------------|--------------------------|
| deviceId             | Long   | 是   | 采集设备主键ID                 | 1                        |
| online               | Boolean| 是   | 是否在线：1在线/0离线          | true                     |
| lastOnlineAt         | String | 否   | 最后一次在线时间               | 2026-01-12T10:00:00      |
| lastHeartbeatAt      | String | 否   | 最后一次心跳/成功采集时间      | 2026-01-12T10:00:00      |
| lastErrorCode        | String | 否   | 最后错误码                     | CONNECTION_TIMEOUT       |
| lastErrorMsg         | String | 否   | 最后错误信息                   | 连接超时                 |
| retryCount           | Integer| 是   | 当前连续失败重试次数           | 0                        |
| consecutiveFail      | Integer| 否   | 连续失败次数                   | 0                        |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": 1 // 运行态记录ID
}
```

### 4.2 更新采集设备运行态

**请求方式**：POST
**请求路径**：`/iot/collector-device-runtime/update`
**功能描述**：更新采集设备运行态记录
**权限要求**：`iot:collector-device-runtime:update`

**请求体**：
```json
{
  "id": 1,
  "deviceId": 1,
  "online": true,
  "lastOnlineAt": "2026-01-12T10:05:00",
  "lastHeartbeatAt": "2026-01-12T10:05:00",
  "retryCount": 0,
  "consecutiveFail": 0
}
```

**请求参数说明**：

| 字段名               | 类型   | 必填 | 描述                           | 示例                     |
|----------------------|--------|------|--------------------------------|--------------------------|
| id                   | Long   | 是   | 运行态记录ID                   | 1                        |
| deviceId             | Long   | 是   | 采集设备主键ID                 | 1                        |
| online               | Boolean| 是   | 是否在线：1在线/0离线          | true                     |
| lastOnlineAt         | String | 否   | 最后一次在线时间               | 2026-01-12T10:05:00      |
| lastHeartbeatAt      | String | 否   | 最后一次心跳/成功采集时间      | 2026-01-12T10:05:00      |
| lastErrorCode        | String | 否   | 最后错误码                     | CONNECTION_TIMEOUT       |
| lastErrorMsg         | String | 否   | 最后错误信息                   | 连接超时                 |
| retryCount           | Integer| 是   | 当前连续失败重试次数           | 0                        |
| consecutiveFail      | Integer| 否   | 连续失败次数                   | 0                        |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 4.3 删除采集设备运行态

**请求方式**：DELETE
**请求路径**：`/iot/collector-device-runtime/delete`
**功能描述**：删除采集设备运行态记录
**权限要求**：`iot:collector-device-runtime:delete`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述         | 示例 |
|--------|--------|------|--------------|------|
| id     | Long   | 是   | 运行态记录ID | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

### 4.4 获取采集设备运行态详情

**请求方式**：GET
**请求路径**：`/iot/collector-device-runtime/get`
**功能描述**：根据ID获取采集设备运行态详情
**权限要求**：`iot:collector-device-runtime:query`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述         | 示例 |
|--------|--------|------|--------------|------|
| id     | Long   | 是   | 运行态记录ID | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "deviceId": 1,
    "online": true,
    "lastOnlineAt": "2026-01-12T10:00:00",
    "lastHeartbeatAt": "2026-01-12T10:00:00",
    "retryCount": 0,
    "consecutiveFail": 0,
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

### 4.5 获取采集设备运行态列表

**请求方式**：GET
**请求路径**：`/iot/collector-device-runtime/list`
**功能描述**：根据ID列表获取采集设备运行态列表
**权限要求**：`iot:collector-device-runtime:query`

**请求参数**：

| 字段名 | 类型       | 必填 | 描述             | 示例       |
|--------|------------|------|------------------|------------|
| ids    | List<Long> | 是   | 运行态记录ID列表 | 1,2,3      |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": 1,
      "online": true,
      "lastOnlineAt": "2026-01-12T10:00:00",
      "lastHeartbeatAt": "2026-01-12T10:00:00",
      "retryCount": 0,
      "consecutiveFail": 0,
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

### 4.6 获取采集设备运行态分页

**请求方式**：GET
**请求路径**：`/iot/collector-device-runtime/page`
**功能描述**：分页获取采集设备运行态列表
**权限要求**：`iot:collector-device-runtime:query`

**请求参数**：

| 字段名               | 类型   | 必填 | 描述                           | 示例         |
|----------------------|--------|------|--------------------------------|--------------|
| pageNo               | Integer| 否   | 页码，默认1                    | 1            |
| pageSize             | Integer| 否   | 每页条数，默认10               | 10           |
| deviceId             | Long   | 否   | 设备ID                         | 1            |
| online               | Boolean| 否   | 是否在线：1在线/0离线          | true         |
| lastErrorCode        | String | 否   | 最后错误码                     | CONNECTION_TIMEOUT |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "total": 10,
    "list": [
      {
        "id": 1,
        "deviceId": 1,
        "online": true,
        "lastOnlineAt": "2026-01-12T10:00:00",
        "lastHeartbeatAt": "2026-01-12T10:00:00",
        "retryCount": 0,
        "consecutiveFail": 0,
        "creator": "admin",
        "createTime": "2026-01-12T10:00:00",
        "updater": "admin",
        "updateTime": "2026-01-12T10:00:00"
      }
    ],
    "pageNo": 1,
    "pageSize": 10
  }
}
```

### 4.7 根据设备ID获取采集设备运行态

**请求方式**：GET
**请求路径**：`/iot/collector-device-runtime/get-by-device-id`
**功能描述**：根据设备ID获取采集设备运行态
**权限要求**：`iot:collector-device-runtime:query`

**请求参数**：

| 字段名   | 类型   | 必填 | 描述         | 示例 |
|----------|--------|------|--------------|------|
| deviceId | Long   | 是   | 设备ID       | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "deviceId": 1,
    "online": true,
    "lastOnlineAt": "2026-01-12T10:00:00",
    "lastHeartbeatAt": "2026-01-12T10:00:00",
    "retryCount": 0,
    "consecutiveFail": 0,
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

### 4.8 根据设备ID集合获取采集设备运行态列表

**请求方式**：GET
**请求路径**：`/iot/collector-device-runtime/list-by-device-ids`
**功能描述**：根据设备ID集合获取采集设备运行态列表
**权限要求**：`iot:collector-device-runtime:query`

**请求参数**：

| 字段名     | 类型       | 必填 | 描述         | 示例       |
|------------|------------|------|--------------|------------|
| deviceIds  | List<Long> | 是   | 设备ID集合   | 1,2,3      |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": 1,
      "online": true,
      "lastOnlineAt": "2026-01-12T10:00:00",
      "lastHeartbeatAt": "2026-01-12T10:00:00",
      "retryCount": 0,
      "consecutiveFail": 0,
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

### 4.9 根据在线状态获取采集设备运行态列表

**请求方式**：GET
**请求路径**：`/iot/collector-device-runtime/list-by-online`
**功能描述**：根据在线状态获取采集设备运行态列表
**权限要求**：`iot:collector-device-runtime:query`

**请求参数**：

| 字段名 | 类型   | 必填 | 描述                 | 示例  |
|--------|--------|------|----------------------|-------|
| online | Boolean| 是   | 是否在线：true/false | true  |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": 1,
      "online": true,
      "lastOnlineAt": "2026-01-12T10:00:00",
      "lastHeartbeatAt": "2026-01-12T10:00:00",
      "retryCount": 0,
      "consecutiveFail": 0,
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 5. 通用响应格式

所有API接口的响应格式统一如下：

```json
{
  "code": 0, // 状态码：0成功，非0失败
  "msg": "成功", // 响应消息
  "data": {} // 响应数据，根据接口不同返回不同的数据结构
}
```

**状态码说明**：

| 状态码 | 描述         |
|--------|--------------|
| 0      | 成功         |
| 1050005002 | 设备分组编码已存在 |
| 1050006000 | 连接配置不存在 |
| 1050007000 | 设备运行态不存在 |
| 1050007001 | 设备已存在运行态记录 |

## 6. 权限说明

所有API接口都需要携带有效的认证信息，并且需要具有相应的权限才能访问。权限格式为：`iot:资源类型:操作`，例如：

- `iot:collector-device:create`：创建采集设备权限
- `iot:collector-device:query`：查询采集设备权限
- `iot:collector-device:update`：更新采集设备权限
- `iot:collector-device:delete`：删除采集设备权限

## 7. 注意事项

1. 所有API接口都遵循RESTful设计原则
2. 请求参数中的日期时间格式为ISO-8601格式：`YYYY-MM-DDTHH:mm:ss`
3. 分页查询默认页码为1，每页条数为10
4. 所有创建和更新操作都需要进行参数验证
5. 所有删除操作都是逻辑删除，不会物理删除数据
6. 设备运行态记录与设备是1:1关系，一个设备只能有一条运行态记录