import { reactive, ref, computed } from 'vue'
import { onPullDownRefresh, onReachBottom, } from '@dcloudio/uni-app'

export interface ResponseData {
  data: {
    meta: Record<string, any>,
    data: []
  }
}

// 封装一些分页的数据和方法
export function usePage<T>(requestData?: Function, enableAutoPage = false) {
  // 查询条件
  const query = ref<Record<string, any>>({
    page: 1,
    total: 0,
    last_page: 1
  })

  // 列表数据
  const dataList = reactive<T[]>([])

  // 搜索
  const handleSearch = () => {
    query.value.page = 1
    dataList.splice(0, dataList.length)
    loadData()
  }

  // 重置
  const handleReset = () => {
    query.value = { page: 1 }
    dataList.splice(0, dataList.length)
    loadData()
  }

  // 更多选项
  const moreStatus = computed<string>(() => {
    if (loading.value) return 'loading'
    return query.value.page < query.value.last_page ? 'more' : 'noMore'
  })

  const loading = ref(false)
  // 载入数据
  const loadData = (direction: 'up' | 'down' = 'up') => {
    if (!requestData) return
    loading.value = true
    return requestData(query.value)
      .then((res: ResponseData) => {
        if (res.data.meta) {
          query.value.last_page = res.data.meta.last_page
          query.value.total = res.data.meta.total
        }
        if (!res.data.data.length) return []

        if (direction === 'up') {
          dataList.push(...res.data.data)
        } else {
          dataList.unshift(...res.data.data)
        }
        return res.data.data
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (enableAutoPage) {
    // 下拉刷新数据
    onPullDownRefresh(() => {
      query.value.page += 1
      loadData('down').then(uni.stopPullDownRefresh)
    })
  
    // 上拉刷新
    onReachBottom(() => {
      query.value.page += 1
      loadData()
    })
  }
  return { dataList, query, handleSearch, loadData, handleReset, loading, moreStatus }
}