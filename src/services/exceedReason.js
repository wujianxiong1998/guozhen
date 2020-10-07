import request, {requestJson} from '../utils/request';

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/excess/reason/page.smvc`, {
        method: 'post',
        body: params
    });
}

//新增或编辑
export async function saveOredit(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/excess/reason/saveOrUpdate.smvc`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/excess/reason/delete.smvc`, {
        method: 'post',
        body: params
    });
}
