import request from '@/utils/request'

export function updateUser(id: number, data: any) {
  request.post(`/user/update/${id}`, data)
}
