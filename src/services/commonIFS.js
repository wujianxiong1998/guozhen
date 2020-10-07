import request, {requestJson} from '../utils/request';
//权限
export async function getAccessControl(param) {
    return request('http://103.14.132.101:8003/cloud/management/rest/np/function/getFunctionsByUsreIdAndSystem.read', {
        method: 'get',
        body: { parameters: JSON.stringify(param) },
    })
}

//获取租户信息
export function getInfoByTenantIdIFS(param) {
    return request('/cloud/management/rest/np/tenant/getTenantById', {
        method: 'post',
        body: param
    })
}

//获取人员树
export function loadStaffTree(param) {
    return request('/cloud/gzzhsw/api/cp/common/loadStaffTree.smvc', {
        method: 'post',
        body: param
    })
}

//获取人员树-new
export function loadStaffTreeNew(param) {
    return request('/cloud/management/rest/np/staff/loadTreeByFilter.read', {
        method: 'get',
        body: param
    })
}

//获取机构树
export function loadOrgTree(param) {
    return request('/cloud/gzzhsw/api/cp/common/loadOrgTreeByPermission.smvc', {
        method: 'post',
        body: param
    })
}


//获取当前登录用户信息
export function getUserDetail(param) {
    return request('/cloud/gzzhsw/api/cp/common/getUserDetail.smvc', {
        method: 'post',
        body: param
    })
}
