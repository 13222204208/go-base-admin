import request from '@/utils/request'

export function storeGoodsType(params) {
  return request({
    url: '/goods_type',
    method: 'post',
    params: params
  })
}

export function goodsTypeList(listQuery) {
  return request({
    url: '/goods_type',
    method: 'get',
    params: listQuery
  })
}

export function delGoodsType(id) {
  return request({
    url: '/goods_type/'+id,
    method: 'delete'
  })
}

export function updateGoodsType(id,params) {
  return request({
    url: '/goods_type/'+id,//1只为替代，没有作用
    method: 'patch',
    params:params
  })
}

export function editGoodsType(id) {
  return request({
    url: '/goods_type/'+id+'/edit',
    method: 'get'
  })
}
