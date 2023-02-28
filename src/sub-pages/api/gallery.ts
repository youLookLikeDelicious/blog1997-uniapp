import request from '@/utils/request'

// 批量删除图片
export function batchDeleteGallery(data: any) {
  return request.delete('/admin/gallery', data)
}

// 删除相册
export function deleteAlbum(id: number) {
  return request.delete(`/admin/gallery/album/${id}`)
}

// 获取全部的相册
export function getAllAlbum() {
  return request.get('/admin/gallery/album-all')
}

// 分页获取相册
export function getAlbum(data: any) {
  return request.get('/admin/gallery/album', data)
}

// 获取相册图片
export function getGallery(data: any) {
  return request.get('/admin/gallery', data)
}

// 获取相册图片详情
export function getGalleryInfo(id: number) {
  return request.get(`/admin/gallery/${id}`)
}

// 添加备注
export function updateGallery(id: number, data: any) {
  return request.put(`/admin/gallery/${id}`, data)
}

// 上传图片
export function uploadGallery(data: any, header?: Record<string, any>) {
  return request.post<{ data: { data: { album_id:number } } }>('/admin/gallery', data, header)
}