import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import dynamic from 'dva/dynamic';

const routes = [
    { //工艺类别
        path: '/craftClasses',
        models: () => [import('./models/craftClassesM'), import('./models/common/accessControlM')],
        component: () => import('./routes/CraftClasses'),
    }, { //出水指标
        path: '/effluentTarget',
        models: () => [import('./models/effluentTargetM'), import('./models/common/accessControlM')],
        component: () => import('./routes/EffluentTarget'),
    }, {//项目类别
        path: '/projectClasses',
        models: () => [import('./models/projectClassesM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProjectClasses'),
    }, {//业务范围
        path: '/businessScope',
        models: () => [import('./models/businessScopeM'), import('./models/common/accessControlM')],
        component: () => import('./routes/BusinessScope'),
    }, {//指标大类
        path: '/indicatorClasses',
        models: () => [import('./models/indicatorClassesM'), import('./models/common/accessControlM')],
        component: () => import('./routes/IndicatorClasses'),
    }, {//指标小类
        path: '/indicatorClassesSmall',
        models: () => [import('./models/indicatorClassesSmallM'), import('./models/common/accessControlM')],
        component: () => import('./routes/IndicatorClassesSmall'),
    }, {//指标单位
        path: '/indicatorUnit',
        models: () => [import('./models/indicatorUnitM'), import('./models/common/accessControlM')],
        component: () => import('./routes/IndicatorUnit'),
    }, {//事业部
        path: '/businessUnit',
        models: () => [import('./models/businessUnitM'), import('./models/common/accessControlM')],
        component: () => import('./routes/BusinessUnit'),
    }, {//区域公司
        path: '/regionalCompany',
        models: () => [import('./models/regionalCompanyM'), import('./models/common/accessControlM')],
        component: () => import('./routes/RegionalCompany'),
    }, {//水厂
        path: '/waterFactory',
        models: () => [import('./models/waterFactoryM'), import('./models/commonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/WaterFactory'),
    }, {//水厂--基础信息
        path: '/basicInformation',
        models: () => [import('./models/basicInformationM'), import('./models/commonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/BasicInformation'),
    }, {//水厂--一厂一档
        path: '/factoryFile',
        models: () => [import('./models/factoryFileM'), import('./models/commonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/FactoryFile'),
    }, {//水厂--排污管理
        path: '/sewageManagement',
        models: () => [import('./models/sewageManagementM'), import('./models/commonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/SewageManagement'),
    }, {//水厂--业绩表
        path: '/performanceTable',
        models: () => [import('./models/performanceTableM'), import('./models/commonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/PerformanceTable'),
    }, {//指标库
        path: '/targetLibrary',
        models: () => [import('./models/targetLibraryM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TargetLibrary'),
    }, {//指标模版
        path: '/targetTemplate',
        models: () => [import('./models/targetTemplateM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TargetTemplate'),
    }, {//指标配置
        path: '/targetConfig',
        models: () => [import('./models/targetConfigM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TargetConfig'),
    }, {//生产数据填报
        path: '/productionFill',
        models: () => [import('./models/productionFillM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionFill'),
    }, {//化验数据填报
        path: '/assayFill',
        models: () => [import('./models/assayFillM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AssayFill'),
    }, {//生产数据填报历史
        path: '/productionHistory',
        models: () => [import('./models/productionHistoryM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionHistory'),
    }, {//化验数据填报历史
        path: '/assayHistory',
        models: () => [import('./models/assayHistoryM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AssayHistory'),
    }, {//生产计划
        path: '/productionPlan',
        models: () => [import('./models/productionPlanM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionPlan'),
    }, {//生产管理--数据填报
        path: '/productionManageFill',
        models: () => [import('./models/productionManageFillM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionManageFill'),
    }, {//公式展示
        path: '/formulaDisplay',
        component: () => import('./routes/FormulaDisplay'),
    }, {//异常大类
        path: '/abnormalTypeBig',
        models: () => [import('./models/abnormalTypeBigM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AbnormalTypeBig'),
    }, {//异常小类
        path: '/abnormalTypeSmall',
        models: () => [import('./models/abnormalTypeSmallM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AbnormalTypeSmall'),
    }, {//异常上报
        path: '/abnormalReport',
        models: () => [import('./models/abnormalReportM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AbnormalReport'),
    }, {//异常任务
        path: '/abnormalTask',
        models: () => [import('./models/abnormalTaskM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AbnormalTask'),
    }, {//异常记录
        path: '/abnormalRecord',
        models: () => [import('./models/abnormalRecordM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AbnormalRecord'),
    }, {//信息稽查--数据填报统计 --以下未配数据权限
        path: '/dataFillStatistics',
        models: () => [import('./models/dataFillStatisticsM')],
        component: () => import('./routes/DataFillStatistics'),
    }, {//信息稽查--生产月报
        path: '/productionMonthReport',
        models: () => [import('./models/productionMonthReportM')],
        component: () => import('./routes/ProductionMonthReport'),
    }, {//信息稽查--数据填报未完成任务
        path: '/dataFillUnfinish',
        models: () => [import('./models/dataFillUnfinishM')],
        component: () => import('./routes/DataFillUnfinish'),
    }, {//信息稽查--数据上报审核完成率
        path: '/dataReportFinish',
        models: () => [import('./models/dataReportFinishM')],
        component: () => import('./routes/DataReportFinish'),
    }, {//信息稽查--数据上报审核及时率
        path: '/dataReportIntime',
        models: () => [import('./models/dataReportIntimeM')],
        component: () => import('./routes/DataReportIntime'),
    }, {//信息稽查--数据上报延迟审批
        path: '/reportDelayAudit',
        models: () => [import('./models/reportDelayAuditM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ReportDelayAudit'),
    }, {//信息稽查--月报审核及时率
        path: '/monthAuditIntime',
        models: () => [import('./models/monthAuditIntimeM')],
        component: () => import('./routes/MonthAuditIntime'),
    }, {//数据填报日期配置
        path: '/fillDateConfig',
        models: () => [import('./models/fillDateConfigM')],
        component: () => import('./routes/FillDateConfig'),
    }, {//数据查看--生产总量（多厂）
        path: '/productionTotal',
        models: () => [import('./models/productionTotalM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionDataCheck/ProductionTotal'),
    }, {//数据查看--生产单耗（多厂）
        path: '/productionConsumeMultiple',
        models: () => [import('./models/productionConsumeMultipleM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionDataCheck/ProductionConsumeMultiple'),
    }, {//数据查看--化验数据（多厂）
        path: '/assayDataMultiple',
        models: () => [import('./models/assayDataMultipleM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionDataCheck/AssayDataMultiple'),
    }, {//数据查看--化验数据（单厂）
        path: '/assayDataSingle',
        models: () => [import('./models/assayDataSingleM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionDataCheck/AssayDataSingle'),
    }, {//数据查看--生产单耗（单厂）
        path: '/productionConsumeSingle',
        models: () => [import('./models/productionConsumeSingleM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ProductionDataCheck/ProductionConsumeSingle'),
    }, {//计划分析
        path: '/planAnalysis',
        models: () => [import('./models/planAnalysisM')],
        component: () => import('./routes/PlanAnalysis'),
    }, {//水量分析
        path: '/waterAnalysis',
        models: () => [import('./models/waterAnalysisM')],
        component: () => import('./routes/WaterAnalysis'),
    }, {//药耗分析
        path: '/drugAnalysis',
        models: () => [import('./models/drugAnalysisM')],
        component: () => import('./routes/DrugAnalysis'),
    }, {//电耗分析
        path: '/electricAnalysis',
        models: () => [import('./models/electricAnalysisM')],
        component: () => import('./routes/ElectricAnalysis'),
    }, {//设备分析
        path: '/deviceAnalysis',
        models: () => [import('./models/deviceAnalysisM')],
        component: () => import('./routes/DeviceAnalysis'),
    }, {//对标分析
        path: '/benchmarkAnalysis',
        models: () => [import('./models/benchmarkAnalysisM')],
        component: () => import('./routes/BenchmarkAnalysis'),
    },{//文献审核
        path: '/literatureAudit',
        models: () => [import('./models/literatureAuditM'), import('./models/common/accessControlM')],
        component: () => import('./routes/LiteratureAudit'),
    }, {//问题库
        path: '/questionLibrary',
        models: () => [import('./models/questionLibraryM'), import('./models/common/accessControlM')],
        component: () => import('./routes/QuestionLibrary'),
    }, {//名词解释
        path: '/nounExplain',
        models: () => [import('./models/nounExplainM'), import('./models/common/accessControlM')],
        component: () => import('./routes/NounExplain'),
    }, {//知识检索
        path: '/knowledgeRetrieval',
        models: () => [import('./models/knowledgeRetrievalM')],
        component: () => import('./routes/KnowledgeRetrieval'),
    }, {//知识检索--详情
        path: '/knowledgeDetail',
        models: () => [import('./models/knowledgeDetailM'), import('./models/knowledgeRetrievalM')],
        component: () => import('./routes/KnowledgeDetail'),
    }, {//问题诊断
        path: '/problemDiagnose',
        models: () => [import('./models/problemDiagnoseM')],
        component: () => import('./routes/ProblemDiagnose'),
    }, {//诊断配置
        path: '/diagnoseConfig',
        models: () => [import('./models/diagnoseConfigM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DiagnoseConfig'),
    }, {//技术支持
        path: '/technicalSupport',
        models: () => [import('./models/technicalSupportM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TechnicalSupport'),
    }, {//我的知识
        path: '/myKnowledge',
        models: () => [import('./models/myKnowledgeM')],
        component: () => import('./routes/MyKnowledge'),
    }, {//积分汇总及配置
        path: '/scoreConfig',
        models: () => [import('./models/scoreConfigM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ScoreConfig'),
    },
    //台账信息
    {
        path: '/accountInformation',
        models: () => [import('./models/accountInformationM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AccountInformation'),
    },
    //构筑物信息
    {
        path: '/buildingInformation',
        models: () => [import('./models/buildingInformationM'), import('./models/common/accessControlM')],
        component: () => import('./routes/BuildingInformation')
    },
    //备品备件库
    {
        path: '/spareParts',
        models: () => [import('./models/sparePartsM'), import('./models/common/accessControlM')],
        component: () => import('./routes/SpareParts')
    },
    //设备故障
    {
        path: '/equipmentFailure',
        models: () => [import('./models/equipmentFailureM'), import('./models/common/accessControlM')],
        component: () => import('./routes/EquipmentFailure')
    },
    //维修任务
    {
        path: '/repairTask',
        models: () => [import('./models/repairTaskM'), import('./models/common/accessControlM')],
        component: () => import('./routes/RepairTask')
    },
    //维修记录
    {
        path: '/repairRecord',
        models: () => [import('./models/repairRecordM'), import('./models/common/accessControlM')],
        component: () => import('./routes/RepairRecord')
    },
    //故障类型
    {
        path: '/faultType',
        models: () => [import('./models/faultTypeM'), import('./models/common/accessControlM')],
        component: () => import('./routes/FaultType')
    },
    //门户
    {
        path: '/homePage',
        models: () => [import('./models/homePageM')],
        component: () => import('./routes/HomePage')
    },
    //个人代办
    {
        path: '/personalAgent',
        models: () => [import('./models/personalAgentM')],
        component: () => import('./routes/PersonalAgent')
    },
    //早会纪要
    {
        path: '/meetingSummary',
        models: () => [import('./models/meetingSummaryM')],
        component: () => import('./routes/MeetingSummary')
    },
    //生产日历
    {
        path: '/productionCalendar',
        models: () => [import('./models/productionCalendarM')],
        component: () => import('./routes/ProductionCalendar')
    },
    //动态管理
    {
        path: '/newsManage',
        models: () => [import('./models/newsManageM')],
        component: () => import('./routes/NewsManage')
    },
    //月报填报
    {
        path: '/monthlyReport',
        models: () => [import('./models/monthlyReportM'), import('./models/common/accessControlM')],
        component: () => import('./routes/MonthlyReport')
    },
    //月报配置
    {
        path: '/monthlySetting',
        models: () => [import('./models/monthlySettingM')],
        component: () => import('./routes/MonthlySetting')
    },
    //超标原因
    {
        path: '/exceedReason',
        models: () => [import('./models/exceedReasonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/ExceedReason')
    },
    //生产日报
    {
        path: '/productionDaily',
        models: () => [import('./models/productionDailyM')],
        component: () => import('./routes/ProductionDaily')
    }
];

const SJBroutes = [
    // 养护计划    √按钮权限
    {
        path: '/maintainPlay',
        models: () => [import('./models/maintainPlayM'), import('./models/common/accessControlM')],
        component: () => import('./routes/MaintainPlay')
    },
    // 养护任务      √按钮权限
    {
        path: '/maintainTask',
        models: () => [import('./models/maintainTaskM'), import('./models/common/accessControlM')],
        component: () => import('./routes/MaintainTask')
    },
    // 养护记录         √按钮权限
    {
        path: '/maintainLog',
        models: () => [import('./models/maintainLogM'), import('./models/common/accessControlM')],
        component: () => import('./routes/MaintainLog')
    },
    // 全年养护计划
    {
        path: '/yearMaintainPlay',
        models: () => [import('./models/yearMaintainPlayM'), import('./models/common/accessControlM')],
        component: () => import('./routes/YearMaintainPlay')
    },
    // 巡检异常   √按钮权限
    {
        path: '/patrolAbnormal',
        models: () => [import('./models/patrolAbnormalM'), import('./models/common/accessControlM')],
        component: () => import('./routes/PatrolAbnormal')
    },
    // 巡检项目  √按钮权限
    {
        path: '/patrolProject',
        models: () => [import('./models/patrolProjectM'), import('./models/common/accessControlM')],
        component: () => import('./routes/PatrolProject')
    },
    // 巡检标准 √按钮权限
    {
        path: '/patrolStandard',
        models: () => [import('./models/patrolStandardM'), import('./models/common/accessControlM')],
        component: () => import('./routes/PatrolStandard')
    },
    // 大修计划 √按钮权限
    {
        path: '/overHaulPlay',
        models: () => [import('./models/overHaulPlayM'), import('./models/common/accessControlM')],
        component: () => import('./routes/OverHaulPlay')
    },
    // 大修方案 √按钮权限
    {
        path: '/overHaulDesign',
        models: () => [import('./models/overHaulDesignM'), import('./models/common/accessControlM')],
        component: () => import('./routes/OverHaulDesign')
    },
    // 大修任务 √按钮权限
    {
        path: '/overHaulMisson',
        models: () => [import('./models/overHaulMissonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/OverHaulMisson')
    },
    // 大修记录  √按钮权限
    {
        path: '/overHaulLog',
        models: () => [import('./models/overHaulLogM'), import('./models/common/accessControlM')],
        component: () => import('./routes/OverHaulLog')
    },
    // 设备变更---状态变更 √按钮权限
    {
        path: '/statusChange',
        models: () => [import('./models/statusChangeM'), import('./models/common/accessControlM')],
        component: () => import('./routes/StatusChange')
    },
    // 设备变更---设备调拨  √按钮权限
    {
        path: '/deviceAllocate',
        models: () => [import('./models/deviceAllocateM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceAllocate')
    },
    // 设备变更---设备报废  √按钮权限
    {
        path: '/deviceScrap',
        models: () => [import('./models/deviceScrapM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceScrap')
    },
    
    
    // 技改计划  √按钮权限
    {
        path: '/techniqueChangePlay',
        models: () => [import('./models/techniqueChangePlayM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TechniqueChangePlay')
    },
    // 技改方案 √按钮权限
    {
        path: '/techniqueChangeDesign',
        models: () => [import('./models/techniqueChangeDesignM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TechniqueChangeDesign')
    },
    // 技改任务 √按钮权限
    {
        path: '/techniqueChangeMisson',
        models: () => [import('./models/techniqueChangeMissonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TechniqueChangeMisson')
    },
    // 技改记录 √按钮权限
    {
        path: '/techniqueChangeLog',
        models: () => [import('./models/techniqueChangeLogM'), import('./models/common/accessControlM')],
        component: () => import('./routes/TechniqueChangeLog')
    },
    
    
    // 更新计划 √按钮权限
    {
        path: '/deviceUpdatePlay',
        models: () => [import('./models/deviceUpdatePlayM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceUpdatePlay')
    },
    // 更新方案 √按钮权限
    {
        path: '/deviceUpdateDesign',
        models: () => [import('./models/deviceUpdateDesignM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceUpdateDesign')
    },
    // 更新任务 √按钮权限
    {
        path: '/deviceUpdateMisson',
        models: () => [import('./models/deviceUpdateMissonM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceUpdateMisson')
    },
    // 更新记录 √按钮权限
    {
        path: '/deviceUpdateLog',
        models: () => [import('./models/deviceUpdateLogM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceUpdateLog')
    },
    
    //////  报警管理
    // 报警设置--单一报警
    {
        path: '/alarmSet',
        models: () => [import('./models/setAlarmM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmSet')
    },
    // 报警管理--单一报警
    {
        path: '/alarmManage',
        models: () => [import('./models/alarmManageM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmManage')
    },
    // 报警设置--综合报警
    {
        path: '/alarmSetMul',
        models: () => [import('./models/alarmSetMulM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmSetMul')
    },
    // 通知设置--综合报警
    {
        path: '/alarmNoticeMul',
        models: () => [import('./models/alarmNoticeMulM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmNoticeMul')
    },
    // 报警管理--综合报警
    {
        path: '/alarmManageMul',
        models: () => [import('./models/alarmManageMulM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmManageMul')
    },
    // 报警分析
    {
        path: '/alarmAnalyze',
        models: () => [import('./models/alarmAnalyzeM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmAnalyze')
    },
    // 报警历史
    {
        path: '/alarmHistory',
        models: () => [import('./models/alarmHistoryM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmHistory')
    },
    // 填报数据报警
    {
        path: '/alarmDataFill',
        models: () => [import('./models/alarmDataFillM'), import('./models/common/accessControlM')],
        component: () => import('./routes/AlarmDataFill')
    },
    //////////  档案管理
    // 档案检索
    {
        path: '/filesSearching',
        models: () => [import('./models/filesSearchingM'), import('./models/common/accessControlM')],
        component: () => import('./routes/FilesSearching')
    },
    // 档案归档
    {
        path: '/filesBack',
        models: () => [import('./models/filesBackM'), import('./models/common/accessControlM')],
        component: () => import('./routes/FilesBack')
    },
    // 档案类型
    {
        path: '/filesType',
        models: () => [import('./models/filesTypeM'), import('./models/common/accessControlM')],
        component: () => import('./routes/FilesType')
    },
    // 设备统计报表
    {
        path: '/deviceStatisticReport',
        models: () => [import('./models/deviceStatisticReportM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceStatisticReport')
    },
    
    // 设备自定义报表
    {
        path: '/deviceSelfReport',
        models: () => [import('./models/deviceSelfReportM'), import('./models/common/accessControlM')],
        component: () => import('./routes/DeviceSelfReport')
    },

];

function RouterConfig({history, app}) {
    return (
        <Router history={history}>
            <Switch>
                {
                    [...routes, ...SJBroutes].map(({path, ...dynamics}, key) => (
                        <Route
                            key={key}
                            exact
                            path={path}
                            component={dynamic({
                                app,
                                ...dynamics,
                            })}
                        />
                    ))
                }
            </Switch>
        </Router>
    );
}

export default RouterConfig;
