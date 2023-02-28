import request from '@/utils/request'

// 获取文章详情
export function getArticleInfo(id: string, data: Record<string, string>)  {
	return request.get<component.ArticleInfo>(`/article/${id}`, data)
}

// 获取文章列表
export function getArticleList(data: Record<string, string>) {
	return request.get('/article/search', data)
}

// 获取文章的评论
export function getComments (id: number | string, data: any) {
  return request.post(`/article/comments/${id}`, data)
}

// 获取专题列表
export function getTags() {
	return request.get('/tag/all')
}