# 使用指南

# 打包插件
```
yarn build
```

# 打开浏览器管理扩展
![打开开发人员模式](\mdimg\PixPin_2024-05-27_17-39-20.png)

选择【加载解压缩的扩展即可使用】

## 网页端发送表单数据方法

vue
```javascript

import {watchEffect} from 'vue'
import type {Ref} from 'vue'
export default function (formData:Ref<any>,title = 'default'){
  watchEffect(()=>{
    const jsonData = JSON.parse(JSON.stringify(formData.value)) ;
    window.postMessage({type:'form_data_observe_extension', payload:jsonData,title}, '*');
  })
}

```
react

```javascript
import {useEffect} from 'react'
export default function (formData:any,title = 'default'){
  const dependencyList = []
 
  if(!Array.isArray(formData)){
    dependencyList.push(formData)
  }else{
    dependencyList.push(...formData)
  }
  useEffect(()=>{
    const payload = Array.isArray(formData)?{
      formData:formData
    }:formData
    window.postMessage({type:'form_data_observe_extension', payload:payload,title}, '*');
  },dependencyList)
}

```
