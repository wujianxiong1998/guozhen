import request, {requestJson} from '../utils/request';

//--------------------------------------生产计划----------------------------------------
//分页
export async function getProductionPlanList(param) {
    return request('/cloud/gzzhsw/api/cp/produce/data/fill/page.smvc', {
        method: 'post',
        body: param,
    })
}
//获取填报数据初始数据
export async function getDefaultProductionFill(param) {
    return request('/cloud/gzzhsw/api/cp/produce/data/fill/firstView.smvc', {
        method: 'post',
        body: param,
    })
}
//删除
export async function deleteProductionPlan(param) {
    return request('/cloud/gzzhsw/api/cp/produce/data/fill/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//保存或修改
export async function saveProductionPlan(param) {
    return requestJson('/cloud/gzzhsw/api/cp/produce/data/fill/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//审核
export async function auditProductionPlan(params) {
    return request(`/cloud/gzzhsw/api/cp/produce/data/fill/audit.smvc`, {
        method: 'post',
        body: params
    });
}
//查看
export async function getProductionPlanDetail(params) {
    return request(`/cloud/gzzhsw/api/cp/produce/data/fill/view.smvc`, {
        method: 'post',
        body: params
    });
}
//验重
export async function ifExistProductionPlan(params) {
    return request(`/cloud/gzzhsw/api/cp/produce/data/fill/ifExitRecord.smvc`, {
        method: 'post',
        body: params
    });
}
//--------------------------数据填报-----------------------------

//分页(管网)
export async function getPipelineList(param) {
    return request('/cloud/gzzhsw/api/cp/basic/pipelineNetPerformance/page.smvc', {
        method: 'get',
        body: param,
    })
}

//分页（污水厂
export async function getSewageReport(param) {
    return request('/cloud/gzzhsw/api/cp/basic/sewageFactory/page.smvc', {
        method: 'get',
        body: param,
    })
}

//分页（业绩汇总
export async function getPerformanceReport(param) {
    return request('/cloud/gzzhsw/api/cp/basic/PerformanceSummary/page.smvc', {
        method: 'get',
        body: param,
    })
}

//删除
export async function deletePerformanceTable(param, searchParams) {
    if(searchParams.dataFillType==='produce') {
        return request(`/cloud/gzzhsw/api/cp/water/sewageDischargePermission/delete`, {
            method: 'post',
            body: {
                ids: param.ids
            }
        })
    }
    return request(`/cloud/gzzhsw/api/cp/water/sewageDischargeReport/delete`, {
        method: 'post',
        body: {
            ids: param.ids
        }
    })
    
}

//修改
export async function savePerformanceTable(param) {
    return requestJson('/cloud/gzzhsw/api/cp/data/fill/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//获取填报数据初始数据
export async function getDefaultPerformanceTable(param) {
    return request('/cloud/gzzhsw/api/cp/data/fill/get.smvc', {
        method: 'post',
        body: param,
    })
}
//获取详情
export async function getPerformanceTableDetail(param) {
    return request('/cloud/gzzhsw/api/cp/data/fill/view.smvc', {
        method: 'post',
        body: param,
    })
}
//审核
export async function auditPerformanceTable(params) {
    return request(`/cloud/gzzhsw/api/cp/data/fill/audit.smvc`, {
        method: 'post',
        body: params
    });
}
//验重
export async function ifExistPerformanceTable(params) {
    return request(`/cloud/gzzhsw/api/cp/data/fill/ifExitRecord.smvc`, {
        method: 'post',
        body: params
    });
}
//近七天化验数据
export async function getSevenDayData(params) {
    return request(`/cloud/gzzhsw/api/cp/data/fill/getSevenDayData.smvc`, {
        method: 'post',
        body: params
    });
}
//是否为管理员
export async function isAdministrator(params) {
    return request(`/cloud/gzzhsw/api/cp/common/wheatherAdminByUserId.smvc`, {
        method: 'post',
        body: params
    });
}
//-------------------------异常小类-----------------------------
//分页
export async function getAbormoalTypeSmallList(param) {
    return request('/cloud/gzzhsw/api/cp/exception/small/type/page.smvc', {
        method: 'post',
        body: param,
    })
}
//删除
export async function deleteAbormoalTypeSmall(param) {
    return request('/cloud/gzzhsw/api/cp/exception/small/type/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//保存或修改
export async function saveAbormoalTypeSmall(param) {
    return requestJson('/cloud/gzzhsw/api/cp/exception/small/type/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//--------------------------异常任务-------------------------------
//分页
export async function getAbormoalTaskList(param) {
    return request('/cloud/gzzhsw/api/cp/exception/task/page.smvc', {
        method: 'post',
        body: param,
    })
}
//删除
export async function deleteAbormoalTask(param) {
    return request('/cloud/gzzhsw/api/cp/exception/task/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//上传回单
export async function uploadAbormoalTask(param) {
    return requestJson('/cloud/gzzhsw/api/cp/exception/task/dealTask.smvc', {
        method: 'post',
        body: param,
    })
}
//审核
export async function auditAbormoalTask(param) {
    return request('/cloud/gzzhsw/api/cp/exception/task/auditTask.smvc', {
        method: 'post',
        body: param,
    })
}
//------------------------------异常上报--------------------------
//分页
export async function getAbnormalReportList(param) {
    return request('/cloud/gzzhsw/api/cp/exception/report/page.smvc', {
        method: 'post',
        body: param,
    })
}
//删除
export async function deleteAbnormalReport(param) {
    return request('/cloud/gzzhsw/api/cp/exception/report/delete.smvc', {
        method: 'post',
        body: param,
    })
}

//保存或修改
export async function saveAbnormalReport(param) {
    return requestJson('/cloud/gzzhsw/api/cp/exception/report/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//任务下达
export async function assignMission(param) {
    return requestJson('/cloud/gzzhsw/api/cp/exception/report/createTask.smvc', {
        method: 'post',
        body: param,
    })
}
//忽略
export async function neglectAbnormalReport(param) {
    return request('/cloud/gzzhsw/api/cp/exception/report/ignore.smvc', {
        method: 'post',
        body: param,
    })
}
//异常小类下拉
export async function loadExceptionSmallTypeSelect(param) {
    return request('/cloud/gzzhsw/api/cp/exception/small/type/list.smvc', {
        method: 'post',
        body: param,
    })
}
//-----------------------------异常记录----------------------------------
export async function getAbnormalRecordList(param) {
    return request('/cloud/gzzhsw/api/cp/exception/task/record/page.smvc', {
        method: 'post',
        body: param,
    })
}
//-----------------------------信息稽查---数据填报------------------------------

//分页
export async function getDataFillStatisticsList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/dataFillPage.smvc', {
        method: 'post',
        body: param,
    })
}
//----------------------------信息稽查---生产月报-----------------------------------
//运行天数说明及停产分析
export async function getWorkDayAndStopAnalysis(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/workDayAndStopAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}
//处理水量分析
export async function getDealWaterAnalysis(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/dealWaterAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}
//进出水水质及达标率分析
export async function getWaterInOutAnalysis(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/waterInOutAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}
//电耗及电单耗分析
export async function getPowerConsumeAnalysis(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/powerConsumeAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}
//药耗及药单耗分析
export async function getDrugAnalysis(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/drugAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}
//污泥脱水系统运行及污泥量分析
export async function getMudCakeAnalysis(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/mudCakeAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}
//工艺调整情况
export async function getProcessChange(param) {
    return request('/cloud/gzzhsw/api/cp/month/report/view/processChange.smvc', {
        method: 'post',
        body: param,
    })
}
//--------------------------数据查看
//生产总量（多厂）分页
export async function getProductionDataList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/page.smvc', {
        method: 'post',
        body: param,
    })
}
//生产单耗（单厂）分页
export async function getProductionConsumeSingleList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/singleView.smvc', {
        method: 'post',
        body: param,
    })
}
//化验数据单厂获取折线图曲线
export async function getAssaySingleChart(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/line.smvc', {
        method: 'post',
        body: param,
    })
}


//==============================数据稽查====================================

//------------------------------数据填报日期配置-------------------------------
export async function getFillConfigData(param) {
    return request('/cloud/gzzhsw/api/cp/fill/config/findOne.smvc', {
        method: 'post',
        body: param,
    })
}
export async function saveFillConfigData(param) {
    return requestJson('/cloud/gzzhsw/api/cp/fill/config/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//---------------------------数据填报未完成任务---------------------------------
export async function getDataFillUnfinishedList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/dataFillWithOutOver.smvc', {
        method: 'post',
        body: param,
    })
}
//--------------------------数据上报审核完成率-----------------------------------
export async function getDataReportFinishList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/dataFillFinish.smvc', {
        method: 'post',
        body: param,
    })
}
//---------------------------数据上报审核及时率---------------------------------
export async function getDataReportIntimeList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/inTimeData.smvc', {
        method: 'post',
        body: param,
    })
}
//------------------------------数据上报延迟审批--------------------------------
//分页
export async function getReportDelayAuditList(param) {
    return request('/cloud/gzzhsw/api/cp/fill/delay/page.smvc', {
        method: 'post',
        body: param,
    })
}
//审核
export async function auditReportDelayAudit(param) {
    return request('/cloud/gzzhsw/api/cp/fill/delay/auditRecord.smvc', {
        method: 'post',
        body: param,
    })
}
//删除
export async function deleteReportDelayAudit(param) {
    return request('/cloud/gzzhsw/api/cp/fill/delay/delete.smvc', {
        method: 'post',
        body: param,
    })
}
//新增
export async function saveReportDelayAudit(param) {
    return requestJson('/cloud/gzzhsw/api/cp/fill/delay/saveOrUpdate.smvc', {
        method: 'post',
        body: param,
    })
}
//------------------------月报审核及时率--------------------------------
//分页
export async function geMonthAuditIntimeList(param) {
    return request('/cloud/gzzhsw/api/cp/data/view/fillInTimeData.smvc', {
        method: 'post',
        body: param,
    })
}

//--------------------------计划分析-----------------------------------
//获取指标选择下拉
export async function getTargetSelect(param) {
    return request('/cloud/gzzhsw/api/cp/plan/analysis/simpleTargetLibraryDTOS.smvc', {
        method: 'post',
        body: param,
    })
}
//获取水厂信息
export async function getWaterFactoryInfo(param) {
    return request('/cloud/gzzhsw/api/cp/plan/analysis/waterFactorInfo.smvc', {
        method: 'post',
        body: param,
    })
}
//获取环比数据
export async function getPlanAnalysisChart(param) {
    return request('/cloud/gzzhsw/api/cp/plan/analysis/tableData.smvc', {
        method: 'post',
        body: param,
    })
}
//获取进度条数据
export async function getPlanAnalysisProgress(param) {
    return request('/cloud/gzzhsw/api/cp/plan/analysis/targetCountList.smvc', {
        method: 'post',
        body: param,
    })
}

//-----------------------------水量分析-------------------------------------
//获取基本信息
export async function getWaterAnalysisInfo(param) {
    return request('/cloud/gzzhsw/api/cp/water/analysis/waterAnalysis.smvc', {
        method: 'post',
        body: param,
    })
}

//获取图表信息

export async function getWaterAnalysisChart(param) {
    return request('/cloud/gzzhsw/api/cp/water/analysis/waterAnalysisData.smvc', {
        method: 'post',
        body: param,
    })
}
//------------------------------药耗分析---------------------------------
//获取图表信息

export async function getDrugAnalysisChart(param) {
    return request('/cloud/gzzhsw/api/cp/drug/analysis/drugAnalysisData.smvc', {
        method: 'post',
        body: param,
    })
}
//--------------------------电耗分析--------------------------------------
//获取图表信息

export async function getElecAnalysisChart(param) {
    return request('/cloud/gzzhsw/api/cp/power/analysis/powerAnalysisData.smvc', {
        method: 'post',
        body: param,
    })
}

//---------------------------对标分析-----------------------------------
//获取图表信息

export async function getBenchmarkAnalysisChart(param) {
    return request('/cloud/gzzhsw/api/cp/benchmark/analysis/benchmarkAnalysisData.smvc', {
        method: 'post',
        body: param,
    })
}

//------------------------设备分析--------------------------------------
//获取设备下拉
export async function getDeviceList(param) {
    return request('/cloud/gzzhsw/api/cp/device/list', {
        method: 'post',
        body: param,
    })
}
//获取故障频次图表
export async function getMalfunctionData(param) {
    return request('/cloud/gzzhsw/api/cp/equipment/analysis/sameBusinessUnitData.smvc', {
        method: 'post',
        body: param,
    })
}
//获取图表
export async function getDeviceChartData(param) {
    return request('/cloud/gzzhsw/api/cp/equipment/analysis/data.smvc', {
        method: 'post',
        body: param,
    })
}