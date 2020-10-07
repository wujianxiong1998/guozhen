import request, {requestJson} from '../utils/request';

//保存或编辑
export async function saveOredit(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/report/config/saveOrUpdate.smvc`, {
        method: 'post',
        body: params
    });
}

//获取月报设置
export async function getOne(params) {
    return request(`/cloud/gzzhsw/api/cp/report/config/getOne.smvc`, {
        method: 'post',
        body: params
    });
}
