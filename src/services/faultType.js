import request,{requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/common/parameter/page.smvc`, {
        method: 'post',
        body: params
    });
}

//名称验重
export async function nameExist(params) {
    return request(`/cloud/gzzhsw/api/cp/common/parameter/checkV2.smvc`, {
        method: 'post',
        body: params
    });
}

//新增
export async function addSave(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/common/parameter/save.smvc`, {
        method: 'post',
        body: params
    });
}

//编辑
export async function addUpdate(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/common/parameter/update.smvc`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/data/verify/delete.smvc`, {
        method: 'post',
        body: params
    });
}
