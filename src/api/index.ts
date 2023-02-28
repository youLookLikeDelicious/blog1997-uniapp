import request from '@/utils/request'

// 删除评论
export function deleteComment(id: number | string) {
	return request.delete(`/comment/${id}`)
}

// 获取验证码
export function getCaptcha() {
  return request.get('/captcha')
}

// 获取当前用户
export function getCurrentUser() {
	return request.post('/oauth/currentUser')
}

// 首页数据
export function getIndex() {
	return request.get('')
}

// 获取评论的回复
export function getReply(rootId: string | number, offset: number) {
	return request.get(`/comment/reply/${rootId}/${offset}`)
}

// 登录
export function login (data: any) {
	return request.postWithCsrf<AnyObject>('/oauth/authorize', data)
}

// 邮箱登录
export function loginByEmail(data: any) {
	return request.postWithCsrf('/auth/login', data)
}

// 登出
export function logout() {
	return request.post('/oauth/logout')
}

// 举报
export function reportIllegalInfo (data: any) {
  return request.post('/report-illegal-info', data)
}

// 评论
export function saveComment(data: any) {
	return request.post<component.Comment>('/comment', data)
}

// 点赞
export function thumbUp(data: { able_id: string | number, able_type: string }) {
	return request.post('/thumb-up', data)
}
