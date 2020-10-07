import request, {requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/repareTask/page`, {
        method: 'post',
        body: params
    });
}

//获取详情
export async function getDetail(params) {
    return request(`/cloud/gzzhsw/api/cp/repareTask/get`, {
        method: 'post',
        body: params
    });
}

//回单
export async function publish(params) {
    return request(`/cloud/gzzhsw/api/cp/repareTask/publish`, {
        method: 'post',
        body: params
    });
}

//审核
export async function audit(params) {
    return request(`/cloud/gzzhsw/api/cp/repareTask/audit`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/repareTask/delete`, {
        method: 'post',
        body: params
    });
}
