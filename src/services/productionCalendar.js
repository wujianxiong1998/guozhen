import request, {requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/work/daily/page`, {
        method: 'post',
        body: params
    });
}

export async function pageListH(params) {
    return request(`/cloud/gzzhsw/api/cp/work/daily/list`, {
        method: 'post',
        body: params
    });
}

//新增
export async function addSave(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/work/daily/add`, {
        method: 'post',
        body: params
    });
}

//编辑
export async function addUpdate(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/work/daily/update`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/work/daily/delete`, {
        method: 'post',
        body: params
    });
}
