import request, {requestJson} from '../utils/request';

//获取用户信息
export async function getUserRole(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getUserRoleDetail.smvc`, {
        method: 'post',
        body: params
    });
}

//WaterworksComponent 内容数据
export async function waterFactory(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/waterFactory.smvc`, {
        method: 'post',
        body: params
    });
}

//WaterworksComponent 内容数据
export async function waterFactoryContent(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getFactoryCountNum.smvc`, {
        method: 'post',
        body: params
    });
}

// 根据水厂ids获取水厂列表
export async function getWaterFactoryList(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getWaterFactoryList.smvc`, {
        method: 'post',
        body: params
    });
}

//获取报警信息
export async function getAlarmNum(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getAlarmNum.smvc`, {
        method: 'post',
        body: params
    });
}

//根据水厂id获取COD,氨氮,TP,TN
export async function getLineReportByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getLineReportByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//根据水厂id获取处理水量和负载率
export async function getBarReportByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getBarReportByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//根据用户id获取权限下技术支持
export async function getTechByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getTechByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//根据水厂ids获取权限下月度污水处理量统计（TOP5）
export async function getMonthDealWaterByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getMonthDealWaterByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//根据用户id获取权限下待办事项
export async function getUnDoThingByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getUnDoThingByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//根据水厂ids获取权限下处理水量圆圈图
export async function getThreeYearsByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getThreeYearsByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//根据水厂ids获取权限下运营动态
export async function getWorkingStatusByWaterFactoryId(params) {
    return request(`/cloud/gzzhsw/api/cp/mh/getWorkingStatusByWaterFactoryId.smvc`, {
        method: 'post',
        body: params
    });
}

//退出登录
export async function exitSys(params) {
    return request(`/cas/logout`, {
        method: 'post',
        body: params
    });
}
