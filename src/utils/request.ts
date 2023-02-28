const API_URL = import.meta.env.VITE_API_URL

type ResponseData<T = any[]> = {
	data: {
		data: T,
		meta: Record<string, any>,
		status: number,
		message: Record<string, []>
	},
	cookies?: string[]
}

const baseRequest = <T = any[]>(url: string, method: "POST" | "OPTIONS" | "GET" | "HEAD" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | undefined, data?: Record<string, any>, customHeader?: Record<string, any>): Promise<ResponseData<T>> => {
  const token = uni.getStorageSync('app_token')
  const header = {
    Authorization: ''
  }

	if (customHeader) {
		Object.assign(header, customHeader)
	}

  if (token) {
    header.Authorization = `Bearer ${token}`
  }
	return new Promise((resolve, reject) => {
		uni.request({
			url:`${API_URL}${url}`,
			method,
			header,
			data,
			success(res) {
				if ([400, 500, 422, 405].includes(res.statusCode)) {
					const data = res.data as { message: [[]] }
					const error = Object.values(data.message).map(item => item.join(',')).join('\n')
					uni.showToast({
						title: error,
						icon: 'error'
					})
					reject(res)
					return
				}
				resolve(res as unknown as ResponseData<T>)
			},
			fail(err) {
				uni.showToast({
					title: 'err.data'
				})
				reject(err)
			}
		})
	})
}

// get请求
const get = <T = any[]>(url: string, data?: Record<string, any>) => {
	return baseRequest<T>(url, 'GET', data)
}

// post请求
const post = <T>(url: string, data?: Record<string, any>, customHeader?: Record<string, any>) => {
  return baseRequest<T>(url, 'POST', data, customHeader)
}

// delete请求
const deleteRequest = (url: string, data?: Record<string, any>, customHeader?: Record<string, any>) => {
  return baseRequest(url, 'DELETE', data, customHeader)
}

// put请求
const put = (url: string, data?: Record<string, any>, customHeader?: Record<string, any>) => {
  return baseRequest(url, 'PUT', data, customHeader)
}

const cookieValuePatten = /[\w-_]+\=[^;]+/
const request = {
	get,
  post,
	put,
	delete: deleteRequest,
	postWithCsrf<T>(url: string, data?: Record<string, any>) {
		return get('/csrf')
			.then((tokenData) => {
				const cookies = tokenData.cookies || []
				const token =  cookies.filter((cookie: string )=> /XSRF\-TOKEN\=/.test(cookie)).join('').match(cookieValuePatten)?.[0].replace('XSRF-TOKEN=', '')

				const header = {
					Accept: 'application/json',
					'X-XSRF-TOKEN': token?.replace('%3D', '='),
					'Cookie': cookies.map((cookie: string) => cookie.match(cookieValuePatten)?.[0]).join('; ')
				}
				return post<T>(url, data, header)
			})
	}
}


export default request
