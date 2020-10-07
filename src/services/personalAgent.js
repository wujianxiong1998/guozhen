import request,{requestJson} from '../utils/request';

// 根据用户id获取权限下待办事项
export async function getUnDotingList(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getUnDotingList.smvc`, {
        method: 'post',
        body: params
    });
}

// 根据用户id获取权限下办结事项
export async function getDonetingList(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getDonetingList.smvc`, {
        method: 'post',
        body: params
    });
}
