import request, {requestJson} from '../utils/request';

//========================================删除接口
export async function commonDelete(param) {
    return request('/cloud/gzzhsw/api/cp/data/verify/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//========================================下拉接口
//参数下拉
//业务范围下拉
export async function loadCommonParamSelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/parameter/list.smvc', {
        method: 'post',
        body: param,
    })
}

//事业部下拉
export async function loadBusinessUnitSelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/getBusinessUnitList.smvc', {
        method: 'post',
        body: {
            isControlPermission: 0
        },
    })
}

//区域公司下拉
export async function loadRegionalCompanySelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/getRegionalCompanyList.smvc', {
        method: 'post',
        body: {
            isControlPermission: 0
        }
    })
}

//业务范围下拉
export async function loadBusinessSelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/parameter/list.smvc', {
        method: 'post',
        body: param,
    })
}

//水厂下拉
export async function loadWaterFactorySelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/getWaterFactoryList.smvc', {
        method: 'post',
        body: {
            isControlPermission: !!param ? param.isControlPermission : 0
        }
    })
}
//水厂-基础信息下拉
export async function loadBasicInformationSelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/getWaterFactoryList.smvc', {
        method: 'post',
        body: {
            isControlPermission: !!param ? param.isControlPermission : 0
        }
    })
}
//水厂-一厂一档下拉
export async function loadFactoryFileSelect(param) {
    return request('/cloud/gzzhsw/api/cp/common/getWaterFactoryList.smvc', {
        method: 'post',
        body: {
            isControlPermission: !!param ? param.isControlPermission : 0
        }
    })
}

// 枚举
export async function loadEnum(param) {
    return request('/cloud/gzzhsw/api/cp/common/loadEnumValue.smvc', {
        method: 'post',
        body: param,
    })
}


//=========================================工艺类别，业务范围，项目类别，指标类型，指标单位  接口
//验重
export async function commonCheckRepeat(param) {
    return request('/cloud/gzzhsw/api/cp/common/parameter/check.smvc', {
        method: 'post',
        body: param,
    })
}

//分页
export async function getCraftClassesList(param) {
    return request('/cloud/gzzhsw/api/cp/common/parameter/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addCraftClasses(param) {
    return requestJson('/cloud/gzzhsw/api/cp/common/parameter/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateCraftClasses(param) {
    return requestJson('/cloud/gzzhsw/api/cp/common/parameter/update.smvc', {
        method: 'post',
        body: param,
    })
}

//====================================================事业部========================================
//分页
export async function getBusinessUnitList(param) {
    return request('/cloud/gzzhsw/api/cp/business/unit/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addBusinessUnit(param) {
    return requestJson('/cloud/gzzhsw/api/cp/business/unit/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateBusinessUnit(param) {
    return requestJson('/cloud/gzzhsw/api/cp/business/unit/update.smvc', {
        method: 'post',
        body: param,
    })
}

//===========================================区域公司===============================================
//分页
export async function getRegionalCompanyList(param) {
    return request('/cloud/gzzhsw/api/cp/regional/company/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addRegionalCompany(param) {
    return requestJson('/cloud/gzzhsw/api/cp/regional/company/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateRegionalCompany(param) {
    return requestJson('/cloud/gzzhsw/api/cp/regional/company/update.smvc', {
        method: 'post',
        body: param,
    })
}

//=========================================水厂==============================================
//分页
export async function getWaterFactoryList(param) {
    return request('/cloud/gzzhsw/api/cp/water/factory/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addWaterFactory(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/factory/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateWaterFactory(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/factory/update.smvc', {
        method: 'post',
        body: param,
    })
}
//=========================================水厂-基础信息==============================================
//分页
export async function getBasicInformationList(param) {
    console.log('基础信息分页')
    return request('/cloud/gzzhsw/api/cp/water/factory/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addBasicInformation(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/factory/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateBasicInformation(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/factory/update.smvc', {
        method: 'post',
        body: param,
    })
}
//=========================================水厂-一厂一档
//分页
export async function getFactoryFileList(param) {
    return request('/cloud/gzzhsw/api/cp/basic/0neFactoryOneGear/page.smvc', {
        method: 'get',
        body: param,
    })
}

//新增
export async function addFactoryFile(param) {
    return requestJson('/cloud/gzzhsw/api/cp/basic/0neFactoryOneGear/save.smvc', {
        method: 'post',
        body: param,
    })
}

//=========================================水厂-排污管理
//分页
export async function getSewageManagementList(param) {
    return request('/cloud/gzzhsw/api/cp/water/sewageDischargePermission/page', {
        method: 'get',
        body: param,
    })
}

//新增
export async function addSewageManagement(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/sewageDischargePermission/save', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateSewageManagement(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/sewageDischargePermission/update', {
        method: 'post',
        body: param,
    })
}

// 历史查询
export async function getFactoryHistory(param) {
    return requestJson('/cloud/gzzhsw/api/cp/water/factoryHistory/list', {
        method: 'get',
        body: param,
    })
}

//=========================================指标库=================================================
//分页
export async function getTargetLibraryList(param) {
    return request('/cloud/gzzhsw/api/cp/target/library/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addTargetLibrary(param) {
    return requestJson('/cloud/gzzhsw/api/cp/target/library/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateTargetLibrary(param) {
    return requestJson('/cloud/gzzhsw/api/cp/target/library/update.smvc', {
        method: 'post',
        body: param,
    })
}

//================================指标模版==================================
//分页
export async function getTargetTemplateList(param) {
    return request('/cloud/gzzhsw/api/cp/target/template/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addTargetTemplate(param) {
    return requestJson('/cloud/gzzhsw/api/cp/target/template/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateTargetTemplate(param) {
    return requestJson('/cloud/gzzhsw/api/cp/target/template/update.smvc', {
        method: 'post',
        body: param,
    })
}

//查询指标库列表
export async function getTargetLibrarySelect(param) {
    return request('/cloud/gzzhsw/api/cp/target/library/list.smvc', {
        method: 'post',
        body: param,
    })
}

//====================================指标配置=====================================
//查询指标模版列表
export async function getTargetTemplateSelect(param) {
    return request('/cloud/gzzhsw/api/cp/target/template/list.smvc', {
        method: 'post',
        body: param,
    })
}

//通过指标模版id查询指标
export async function getTargetsByTemplateId(param) {
    return request('/cloud/gzzhsw/api/cp/target/template/library/list.smvc', {
        method: 'post',
        body: param,
    })
}

//分页
export async function getTargetConfigList(param) {
    return request('/cloud/gzzhsw/api/cp/target/config/page.smvc', {
        method: 'post',
        body: param,
    })
}

//新增
export async function addTargetConfig(param) {
    return requestJson('/cloud/gzzhsw/api/cp/target/config/save.smvc', {
        method: 'post',
        body: param,
    })
}

//修改
export async function updateTargetConfig(param) {
    return requestJson('/cloud/gzzhsw/api/cp/target/config/update.smvc', {
        method: 'post',
        body: param,
    })
}

//=================================================生产数据填报
//填报数据查询
export async function getProductionFillList(param) {
    return request('/cloud/gzzhsw/api/cp/data/fill/get.smvc', {
        method: 'post',
        body: param,
    })
}

//保存填报数据
export async function saveProductionFill(param) {
    return requestJson('/cloud/gzzhsw/api/cp/data/fill/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}

//填报历史查询
export async function getFillHistory(param) {
    return request('/cloud/gzzhsw/api/cp/data/fill/historyList.smvc', {
        method: 'post',
        body: param,
    })
}

//非原始指标计算
export async function calculateTargetValue(param) {
    return requestJson('/cloud/gzzhsw/api/cp/arithmetic/calculate.smvc', {
        method: 'post',
        body: param,
    })
}


//单耗非原始指标计算
export async function calculateConsumeTargetValue(param) {
    return requestJson('/cloud/gzzhsw/api/cp/arithmetic/otherCalculate.smvc', {
        method: 'post',
        body: param,
    })
}


//导出压缩包
export function exportFiles(postData) {
    return request('/vortex/rest/cloud/np/file/downloadBatch', {
        body: postData
    });
}