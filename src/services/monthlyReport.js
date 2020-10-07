import request, {requestJson} from '../utils/request';

//是否可以填报
export async function wheatherExit(params) {
    return request(`/cloud/gzzhsw/api/cp/report/fill/wheatherExit.smvc`, {
        method: 'post',
        body: params
    });
}

//获取数据
export async function getOne(params) {
    return request(`/cloud/gzzhsw/api/cp/report/fill/getOne.smvc`, {
        method: 'post',
        body: params
    });
}

//超标原因
export async function getReasonList(params) {
    return request(`/cloud/gzzhsw/api/cp/excess/reason/list.smvc`, {
        method: 'post',
        body: params
    });
}

//获取列表
export async function pageList(params) {
    return request(`/cloud/gzzhsw/api/cp/report/fill/page.smvc`, {
        method: 'post',
        body: params
    });
}

//保存或编辑
export async function saveOredit(params) {
    return requestJson(`/cloud/gzzhsw/api/cp/report/fill/saveOrUpdate.smvc`, {
        method: 'post',
        body: params
    });
}

//删除
export async function deleteEntity(params) {
    return request(`/cloud/gzzhsw/api/cp/report/fill/delete.smvc`, {
        method: 'post',
        body: params
    });
}

//审核
export async function audit(params) {
    return request(`/cloud/gzzhsw/api/cp/report/fill/audit.smvc`, {
        method: 'post',
        body: params
    });
}

//获取区域公司
export async function getRegionalCompanyList(params) {
    return request(`/cloud/gzzhsw/api/cp/common/getRegionalCompanyList.smvc`, {
        method: 'post',
        body: params
    });
}

//水厂下拉(增加区域过滤)
export async function getFactoryListWithRegional(params) {
    return request(`/cloud/gzzhsw/api/cp/common/getFactoryListWithRegional.smvc`, {
        method: 'post',
        body: params
    });
}
