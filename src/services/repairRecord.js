import request, {requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/repareRecord/page`, {
        method: 'post',
        body: params
    });
}

//获取详情
export async function getDetail(params) {
    return request(`/cloud/gzzhsw/api/cp/repareRecord/get`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/repareRecord/delete`, {
        method: 'post',
        body: params
    });
}
