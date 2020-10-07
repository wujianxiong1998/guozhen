import request, {requestJson} from '../utils/request';

//获取行业动态
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/news/notice/page`, {
        method: 'post',
        body: params
    });
}

//新增
export async function addSave(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/news/notice/add`, {
        method: 'post',
        body: params
    });
}

//编辑
export async function addUpdate(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/news/notice/update`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/news/notice/delete`, {
        method: 'post',
        body: params
    });
}
