import request, {requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/device/page`, {
        method: 'post',
        body: params
    });
}

//名称验重
export async function nameExist(params) {
    return request(`/cloud/gzzhsw/api/cp/device/validate`, {
        method: 'post',
        body: params
    });
}

//获取安装位置
export async function getStructureList(params) {
    return request(`/cloud/gzzhsw/api/cp/device/getStructureList.smvc`, {
        method: 'post',
        body: params
    });
}

//生产厂家模糊匹配
export async function getManufacturerList(params) {
    return request(`/cloud/gzzhsw/api/cp/device/getManufacturerList.smvc`, {
        method: 'post',
        body: params
    });
}

//新增
export async function addSave(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/device/save`, {
        method: 'post',
        body: params
    });
}

//查看详情
export async function getDetail(params) {
    return request(`/cloud/gzzhsw/api/cp/device/get`, {
        method: 'post',
        body: params
    });
}

//编辑
export async function addUpdate(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/device/update`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/device/delete`, {
        method: 'post',
        body: params
    });
}
