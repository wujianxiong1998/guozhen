import request, {requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/repareDown/page`, {
        method: 'post',
        body: params
    });
}

//新增
export async function addSave(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/repareDown/save`, {
        method: 'post',
        body: params
    });
}

//详情
export async function getDetail(params) {
    return request(`/cloud/gzzhsw/api/cp/repareDown/get`, {
        method: 'post',
        body: params
    });
}

//编辑
export async function addUpdate(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/repareDown/update`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/repareDown/delete`, {
        method: 'post',
        body: params
    });
}

//任务下达
export async function publish(params) {
    return request(`/cloud/gzzhsw/api/cp/repareDown/publish`, {
        method: 'post',
        body: params
    });
}

//忽略
export async function ignore(params) {
    return request(`/cloud/gzzhsw/api/cp/repareDown/ignore`, {
        method: 'post',
        body: params
    });
}
