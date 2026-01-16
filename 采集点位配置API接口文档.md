# 采集点位配置 API 接口文档

## 1. 创建采集点位配置

**请求方式**：POST
**请求路径**：`/iot/collector-point/create`
**功能描述**：创建采集点位配置
**权限要求**：`iot:collector-point:create`

**请求体**：
```json
{
  "deviceId": "PLC001",
  "pointId": "IOA_0001",
  "pointCode": "IOA_0001",
  "pointName": "温度传感器1",
  "unitId": 1,
  "address": "40001",
  "dataType": "INT",
  "readWrite": "R",
  "collectionMode": "POLLING",
  "status": 1,
  "baseCollectionInterval": 1000,
  "minCollectionInterval": 500,
  "maxCollectionInterval": 5000,
  "minValue": -40.0,
  "maxValue": 100.0,
  "unit": "℃",
  "priority": 1,
  "defaultValue": "0",
  "cacheEnabled": 1,
  "cacheDuration": 60,
  "alarmEnabled": 1,
  "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
  "additionalConfig": "{}",
  "remark": "温度传感器点位"
}
```

**请求参数说明**：

| 字段名                 | 类型    | 必填 | 描述                           | 示例         |
|------------------------|---------|------|--------------------------------|--------------|
| deviceId               | String  | 是   | 设备ID（采集设备）             | PLC001       |
| pointId               | String  | 是   | 点位ID（设备内唯一）           | IOA_0001     |
| pointCode             | String  | 否   | 点位编码（IOA_0001 / COIL_001 等） | IOA_0001     |
| pointName             | String  | 否   | 点位名称                       | 温度传感器1   |
| unitId                | Integer | 否   | 单元ID（Modbus unitId / IEC104 保留） | 1            |
| address               | String  | 是   | 点位地址（IOA / 寄存器 / OID / NodeId / URI） | 40001        |
| dataType              | String  | 是   | 数据类型：BOOLEAN / INT / FLOAT / DOUBLE / STRING | INT          |
| readWrite             | String  | 是   | 读写类型：R / RW / W          | R            |
| collectionMode        | String  | 是   | 采集模式：POLLING / SUBSCRIPTION | POLLING      |
| status                | Integer | 是   | 状态：1启用 0停用            | 1            |
| baseCollectionInterval | Integer | 否   | 基础采集周期(ms)             | 1000         |
| minCollectionInterval | Integer | 否   | 最小采集周期(ms)               | 500          |
| maxCollectionInterval | Integer | 否   | 最大采集周期(ms)               | 5000         |
| minValue              | Double  | 否   | 最小值                         | -40.0        |
| maxValue              | Double  | 否   | 最大值                         | 100.0        |
| unit                  | String  | 否   | 单位                           | ℃            |
| priority              | Integer | 否   | 采集优先级                     | 1            |
| defaultValue          | String  | 否   | 默认值                         | 0            |
| cacheEnabled          | Integer | 是   | 是否启用点位缓存               | 1            |
| cacheDuration         | Integer | 否   | 缓存时长（秒）                 | 60           |
| alarmEnabled          | Integer | 是   | 是否启用告警                   | 1            |
| alarmRule             | String  | 否   | 告警规则 JSON                  | {"threshold":80,"type":"high"} |
| additionalConfig       | String  | 否   | 扩展配置（上报字段、设备信息等） | {}           |
| remark                | String  | 否   | 备注说明                       | 温度传感器点位 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": 1 // 点位配置ID
}
```

## 2. 更新采集点位配置

**请求方式**：POST
**请求路径**：`/iot/collector-point/update`
**功能描述**：更新采集点位配置
**权限要求**：`iot:collector-point:update`

**请求体**：
```json
{
  "id": 1,
  "deviceId": "PLC001",
  "pointId": "IOA_0001",
  "pointCode": "IOA_0001",
  "pointName": "温度传感器1（更新）",
  "unitId": 1,
  "address": "40001",
  "dataType": "INT",
  "readWrite": "R",
  "collectionMode": "POLLING",
  "status": 1,
  "baseCollectionInterval": 2000,
  "minCollectionInterval": 500,
  "maxCollectionInterval": 5000,
  "minValue": -40.0,
  "maxValue": 100.0,
  "unit": "℃",
  "priority": 1,
  "defaultValue": "0",
  "cacheEnabled": 1,
  "cacheDuration": 60,
  "alarmEnabled": 1,
  "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
  "additionalConfig": "{}",
  "remark": "更新后的温度传感器点位"
}
```

**请求参数说明**：

| 字段名                 | 类型    | 必填 | 描述                           | 示例         |
|------------------------|---------|------|--------------------------------|--------------|
| id                     | Long    | 是   | 点位配置ID                     | 1            |
| deviceId               | String  | 是   | 设备ID（采集设备）             | PLC001       |
| pointId               | String  | 是   | 点位ID（设备内唯一）           | IOA_0001     |
| pointCode             | String  | 否   | 点位编码（IOA_0001 / COIL_001 等） | IOA_0001     |
| pointName             | String  | 否   | 点位名称                       | 温度传感器1（更新） |
| unitId                | Integer | 否   | 单元ID（Modbus unitId / IEC104 保留） | 1            |
| address               | String  | 是   | 点位地址（IOA / 寄存器 / OID / NodeId / URI） | 40001        |
| dataType              | String  | 是   | 数据类型：BOOLEAN / INT / FLOAT / DOUBLE / STRING | INT          |
| readWrite             | String  | 是   | 读写类型：R / RW / W          | R            |
| collectionMode        | String  | 是   | 采集模式：POLLING / SUBSCRIPTION | POLLING      |
| status                | Integer | 是   | 状态：1启用 0停用            | 1            |
| baseCollectionInterval | Integer | 否   | 基础采集周期(ms)             | 2000         |
| minCollectionInterval | Integer | 否   | 最小采集周期(ms)               | 500          |
| maxCollectionInterval | Integer | 否   | 最大采集周期(ms)               | 5000         |
| minValue              | Double  | 否   | 最小值                         | -40.0        |
| maxValue              | Double  | 否   | 最大值                         | 100.0        |
| unit                  | String  | 否   | 单位                           | ℃            |
| priority              | Integer | 否   | 采集优先级                     | 1            |
| defaultValue          | String  | 否   | 默认值                         | 0            |
| cacheEnabled          | Integer | 是   | 是否启用点位缓存               | 1            |
| cacheDuration         | Integer | 否   | 缓存时长（秒）                 | 60           |
| alarmEnabled          | Integer | 是   | 是否启用告警                   | 1            |
| alarmRule             | String  | 否   | 告警规则 JSON                  | {"threshold":90,"type":"high"} |
| additionalConfig       | String  | 否   | 扩展配置（上报字段、设备信息等） | {}           |
| remark                | String  | 否   | 备注说明                       | 更新后的温度传感器点位 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

## 3. 删除采集点位配置

**请求方式**：DELETE
**请求路径**：`/iot/collector-point/delete`
**功能描述**：删除采集点位配置
**权限要求**：`iot:collector-point:delete`

**请求参数**：
| 字段名 | 类型   | 必填 | 描述         | 示例 |
|--------|--------|------|--------------|------|
| id     | Long   | 是   | 点位配置ID   | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": true
}
```

## 4. 获取采集点位配置详情

**请求方式**：GET
**请求路径**：`/iot/collector-point/get`
**功能描述**：根据ID获取采集点位配置详情
**权限要求**：`iot:collector-point:query`

**请求参数**：
| 字段名 | 类型   | 必填 | 描述         | 示例 |
|--------|--------|------|--------------|------|
| id     | Long   | 是   | 点位配置ID   | 1    |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "deviceId": "PLC001",
    "pointId": "IOA_0001",
    "pointCode": "IOA_0001",
    "pointName": "温度传感器1",
    "unitId": 1,
    "address": "40001",
    "dataType": "INT",
    "readWrite": "R",
    "collectionMode": "POLLING",
    "status": 1,
    "baseCollectionInterval": 1000,
    "minCollectionInterval": 500,
    "maxCollectionInterval": 5000,
    "minValue": -40.0,
    "maxValue": 100.0,
    "unit": "℃",
    "priority": 1,
    "defaultValue": "0",
    "cacheEnabled": 1,
    "cacheDuration": 60,
    "alarmEnabled": 1,
    "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
    "additionalConfig": "{}",
    "remark": "温度传感器点位",
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

## 5. 获取采集点位配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-point/list`
**功能描述**：根据ID列表获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：
| 字段名 | 类型       | 必填 | 描述           | 示例       |
|--------|------------|------|----------------|------------|
| ids    | List<Long> | 是   | 点位配置ID列表 | 1,2,3      |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": "PLC001",
      "pointId": "IOA_0001",
      "pointCode": "IOA_0001",
      "pointName": "温度传感器1",
      "unitId": 1,
      "address": "40001",
      "dataType": "INT",
      "readWrite": "R",
      "collectionMode": "POLLING",
      "status": 1,
      "baseCollectionInterval": 1000,
      "minCollectionInterval": 500,
      "maxCollectionInterval": 5000,
      "minValue": -40.0,
      "maxValue": 100.0,
      "unit": "℃",
      "priority": 1,
      "defaultValue": "0",
      "cacheEnabled": 1,
      "cacheDuration": 60,
      "alarmEnabled": 1,
      "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
      "additionalConfig": "{}",
      "remark": "温度传感器点位",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 6. 获取采集点位配置分页

**请求方式**：GET
**请求路径**：`/iot/collector-point/page`
**功能描述**：分页获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名                 | 类型    | 必填 | 描述                           | 示例         |
|------------------------|---------|------|--------------------------------|--------------|
| pageNo                 | Integer | 否   | 页码，默认1                    | 1            |
| pageSize               | Integer | 否   | 每页条数，默认10               | 10           |
| deviceId               | String  | 否   | 设备ID（采集设备）             | PLC001       |
| pointId               | String  | 否   | 点位ID（设备内唯一）           | IOA_0001     |
| pointCode             | String  | 否   | 点位编码（模糊查询）           | IOA          |
| pointName             | String  | 否   | 点位名称（模糊查询）           | 温度         |
| dataType              | String  | 否   | 数据类型                       | INT          |
| readWrite             | String  | 否   | 读写类型                       | R            |
| collectionMode        | String  | 否   | 采集模式                       | POLLING      |
| status                | Integer | 否   | 状态：1启用 0停用            | 1            |

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
        "deviceId": "PLC001",
        "pointId": "IOA_0001",
        "pointCode": "IOA_0001",
        "pointName": "温度传感器1",
        "unitId": 1,
        "address": "40001",
        "dataType": "INT",
        "readWrite": "R",
        "collectionMode": "POLLING",
        "status": 1,
        "baseCollectionInterval": 1000,
        "minCollectionInterval": 500,
        "maxCollectionInterval": 5000,
        "minValue": -40.0,
        "maxValue": 100.0,
        "unit": "℃",
        "priority": 1,
        "defaultValue": "0",
        "cacheEnabled": 1,
        "cacheDuration": 60,
        "alarmEnabled": 1,
        "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
        "additionalConfig": "{}",
        "remark": "温度传感器点位",
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

## 7. 根据设备ID获取采集点位配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-point/list-by-device-id`
**功能描述**：根据设备ID获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名   | 类型   | 必填 | 描述         | 示例   |
|----------|--------|------|--------------|----------|
| deviceId | String | 是   | 设备ID       | PLC001  |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": "PLC001",
      "pointId": "IOA_0001",
      "pointCode": "IOA_0001",
      "pointName": "温度传感器1",
      "unitId": 1,
      "address": "40001",
      "dataType": "INT",
      "readWrite": "R",
      "collectionMode": "POLLING",
      "status": 1,
      "baseCollectionInterval": 1000,
      "minCollectionInterval": 500,
      "maxCollectionInterval": 5000,
      "minValue": -40.0,
      "maxValue": 100.0,
      "unit": "℃",
      "priority": 1,
      "defaultValue": "0",
      "cacheEnabled": 1,
      "cacheDuration": 60,
      "alarmEnabled": 1,
      "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
      "additionalConfig": "{}",
      "remark": "温度传感器点位",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 8. 根据点位ID获取采集点位配置

**请求方式**：GET
**请求路径**：`/iot/collector-point/get-by-point-id`
**功能描述**：根据点位ID获取采集点位配置
**权限要求**：`iot:collector-point:query`

**请求参数**：
| 字段名  | 类型   | 必填 | 描述         | 示例     |
|---------|--------|------|--------------|-----------|
| pointId | String | 是   | 点位ID       | IOA_0001  |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "deviceId": "PLC001",
    "pointId": "IOA_0001",
    "pointCode": "IOA_0001",
    "pointName": "温度传感器1",
    "unitId": 1,
    "address": "40001",
    "dataType": "INT",
    "readWrite": "R",
    "collectionMode": "POLLING",
    "status": 1,
    "baseCollectionInterval": 1000,
    "minCollectionInterval": 500,
    "maxCollectionInterval": 5000,
    "minValue": -40.0,
    "maxValue": 100.0,
    "unit": "℃",
    "priority": 1,
    "defaultValue": "0",
    "cacheEnabled": 1,
    "cacheDuration": 60,
    "alarmEnabled": 1,
    "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
    "additionalConfig": "{}",
    "remark": "温度传感器点位",
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

## 9. 根据设备ID和点位ID获取采集点位配置

**请求方式**：GET
**请求路径**：`/iot/collector-point/get-by-device-id-and-point-id`
**功能描述**：根据设备ID和点位ID获取采集点位配置
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名   | 类型   | 必填 | 描述         | 示例     |
|----------|--------|------|--------------|-----------|
| deviceId | String | 是   | 设备ID       | PLC001    |
| pointId  | String | 是   | 点位ID       | IOA_0001  |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 1,
    "deviceId": "PLC001",
    "pointId": "IOA_0001",
    "pointCode": "IOA_0001",
    "pointName": "温度传感器1",
    "unitId": 1,
    "address": "40001",
    "dataType": "INT",
    "readWrite": "R",
    "collectionMode": "POLLING",
    "status": 1,
    "baseCollectionInterval": 1000,
    "minCollectionInterval": 500,
    "maxCollectionInterval": 5000,
    "minValue": -40.0,
    "maxValue": 100.0,
    "unit": "℃",
    "priority": 1,
    "defaultValue": "0",
    "cacheEnabled": 1,
    "cacheDuration": 60,
    "alarmEnabled": 1,
    "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
    "additionalConfig": "{}",
    "remark": "温度传感器点位",
    "creator": "admin",
    "createTime": "2026-01-12T10:00:00",
    "updater": "admin",
    "updateTime": "2026-01-12T10:00:00"
  }
}
```

## 10. 根据设备ID集合获取采集点位配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-point/list-by-device-ids`
**功能描述**：根据设备ID集合获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名    | 类型         | 必填 | 描述         | 示例          |
|-----------|--------------|------|--------------|---------------|
| deviceIds | List<String> | 是   | 设备ID集合   | PLC001,PLC002 |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": "PLC001",
      "pointId": "IOA_0001",
      "pointCode": "IOA_0001",
      "pointName": "温度传感器1",
      "unitId": 1,
      "address": "40001",
      "dataType": "INT",
      "readWrite": "R",
      "collectionMode": "POLLING",
      "status": 1,
      "baseCollectionInterval": 1000,
      "minCollectionInterval": 500,
      "maxCollectionInterval": 5000,
      "minValue": -40.0,
      "maxValue": 100.0,
      "unit": "℃",
      "priority": 1,
      "defaultValue": "0",
      "cacheEnabled": 1,
      "cacheDuration": 60,
      "alarmEnabled": 1,
      "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
      "additionalConfig": "{}",
      "remark": "温度传感器点位",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 11. 根据状态获取采集点位配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-point/list-by-status`
**功能描述**：根据状态获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名 | 类型    | 必填 | 描述                 | 示例 |
|--------|---------|------|----------------------|-------|
| status | Integer | 是   | 状态：1启用 0停用 | 1     |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": "PLC001",
      "pointId": "IOA_0001",
      "pointCode": "IOA_0001",
      "pointName": "温度传感器1",
      "unitId": 1,
      "address": "40001",
      "dataType": "INT",
      "readWrite": "R",
      "collectionMode": "POLLING",
      "status": 1,
      "baseCollectionInterval": 1000,
      "minCollectionInterval": 500,
      "maxCollectionInterval": 5000,
      "minValue": -40.0,
      "maxValue": 100.0,
      "unit": "℃",
      "priority": 1,
      "defaultValue": "0",
      "cacheEnabled": 1,
      "cacheDuration": 60,
      "alarmEnabled": 1,
      "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
      "additionalConfig": "{}",
      "remark": "温度传感器点位",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 12. 根据数据类型获取采集点位配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-point/list-by-data-type`
**功能描述**：根据数据类型获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名   | 类型   | 必填 | 描述                                             | 示例 |
|----------|--------|------|--------------------------------------------------|-------|
| dataType | String | 是   | 数据类型：BOOLEAN / INT / FLOAT / DOUBLE / STRING | INT   |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": "PLC001",
      "pointId": "IOA_0001",
      "pointCode": "IOA_0001",
      "pointName": "温度传感器1",
      "unitId": 1,
      "address": "40001",
      "dataType": "INT",
      "readWrite": "R",
      "collectionMode": "POLLING",
      "status": 1,
      "baseCollectionInterval": 1000,
      "minCollectionInterval": 500,
      "maxCollectionInterval": 5000,
      "minValue": -40.0,
      "maxValue": 100.0,
      "unit": "℃",
      "priority": 1,
      "defaultValue": "0",
      "cacheEnabled": 1,
      "cacheDuration": 60,
      "alarmEnabled": 1,
      "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
      "additionalConfig": "{}",
      "remark": "温度传感器点位",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 13. 根据读写类型获取采集点位配置列表

**请求方式**：GET
**请求路径**：`/iot/collector-point/list-by-read-write`
**功能描述**：根据读写类型获取采集点位配置列表
**权限要求**：`iot:collector-point:query`

**请求参数**：

| 字段名   | 类型   | 必填 | 描述                 | 示例 |
|----------|--------|------|----------------------|-------|
| readWrite | String | 是   | 读写类型：R / RW / W | R     |

**响应数据**：
```json
{
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "deviceId": "PLC001",
      "pointId": "IOA_0001",
      "pointCode": "IOA_0001",
      "pointName": "温度传感器1",
      "unitId": 1,
      "address": "40001",
      "dataType": "INT",
      "readWrite": "R",
      "collectionMode": "POLLING",
      "status": 1,
      "baseCollectionInterval": 1000,
      "minCollectionInterval": 500,
      "maxCollectionInterval": 5000,
      "minValue": -40.0,
      "maxValue": 100.0,
      "unit": "℃",
      "priority": 1,
      "defaultValue": "0",
      "cacheEnabled": 1,
      "cacheDuration": 60,
      "alarmEnabled": 1,
      "alarmRule": "[{\"threshold\":80,\"type\":\"high\"}]",
      "additionalConfig": "{}",
      "remark": "温度传感器点位",
      "creator": "admin",
      "createTime": "2026-01-12T10:00:00",
      "updater": "admin",
      "updateTime": "2026-01-12T10:00:00"
    }
  ]
}
```

## 14. 通用响应格式

所有API接口的响应格式统一如下：

```json
{
  "code": 0, // 状态码：0成功，非0失败
  "msg": "成功", // 响应消息
  "data": {} // 响应数据，根据接口不同返回不同的数据结构
}
```

**状态码说明**：

| 状态码 | 描述                   |
|--------|------------------------|
| 0      | 成功                   |
| 1050009000 | 采集点位配置不存在 |
| 1050009001 | 点位ID在设备内已存在 |

## 15. 权限说明

所有API接口都需要携带有效的认证信息，并且需要具有相应的权限才能访问。权限格式为：`iot:资源类型:操作`，例如：

- `iot:collector-point:create`：创建采集点位配置权限
- `iot:collector-point:query`：查询采集点位配置权限
- `iot:collector-point:update`：更新采集点位配置权限
- `iot:collector-point:delete`：删除采集点位配置权限

## 16. 注意事项

1. 所有API接口都遵循RESTful设计原则
2. 请求参数中的日期时间格式为ISO-8601格式：`YYYY-MM-DDTHH:mm:ss`
3. 分页查询默认页码为1，每页条数为10
4. 所有创建和更新操作都需要进行参数验证
5. 所有删除操作都是逻辑删除，不会物理删除数据
6. 点位ID在设备内必须唯一，同一设备下不能有重复的点位ID
7. 数据类型支持的值：BOOLEAN / INT / FLOAT / DOUBLE / STRING
8. 读写类型支持的值：R（只读）/ RW（读写）/ W（只写）
9. 采集模式支持的值：POLLING（轮询）/ SUBSCRIPTION（订阅）
10. 状态值：1（启用）/ 0（停用）
11. 告警规则字段为JSON格式，可根据实际需求自定义告警规则
12. 扩展配置字段为JSON格式，用于存储额外的配置信息