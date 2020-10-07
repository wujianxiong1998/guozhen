//主页面地址
var mainUrl = 'http://103.14.132.101:9391/layout.html?systemCode=SYSTEM_CODE_GZZHSW';
// var mainUrl = 'http://localhost:63342/国祯智慧水务_登录导航（定制）/layout.html?systemCode=SYSTEM_CODE_GZZHSW';
var jscUrl = 'http://103.14.132.101:8003/zhsw/zhswJsc/#/index';
var jscDetailUrl = 'http://103.14.132.101:8003/zhsw/zhswJscDetail/#/index';

//快捷入口
var fastEntory = [
    {name: '生产填报', src: 'sctb', menuName: 'productionManageFill', menuTab: 'produce'},
    {name: '专家知识库', src: 'zjzs', menuName: 'knowledgeRetrieval'},
    {name: '化验填报', src: 'hytb', menuName: 'productionManageFill', menuTab: 'assay'},
    {name: '技术支持', src: 'jszc', menuName: 'technicalSupport'},
    {name: '故障上报', src: 'gzsb', menuName: 'equipmentFailure'},
    {name: '维修回单', src: 'wxhd', menuName: 'repairTask'},
    {name: '养护回单', src: 'yhhd', menuName: 'maintainTask'},
    {name: '环保指标', src: 'hbzb', menuName: ''},
    {name: '物资管理', src: 'wzgl', menuName: 'spareParts'}
];

//一级功能
var primaryFunction = [
    {name: '驾驶舱', src: 'jsc', menuName: 'jsc'},
    {name: '实时监控', src: 'ssjk', menuName: ''},
    {name: '生产管理', src: 'scgl', menuName: 'productionManageFill'},
    {name: '设备管理', src: 'sbgl', menuName: 'accountInformation'},
    {name: '报警管理', src: 'bjgl', menuName: 'alarmHistory'},
    {name: '报表管理', src: 'bbgl', menuName: 'deviceStatisticReport'},
    {name: '数据分析', src: 'sjfx', menuName: 'benchmarkAnalysis'},
    {name: '专家系统', src: 'zjxt', menuName: 'myKnowledge'},
    {name: '更多', src: 'gd', menuName: ''}
];

//出水污染物浓度指标
var pollutionPotency = [
    {name: 'COD', code: 'COD'},
    {name: '氨氮', code: 'NH3N'},
    {name: 'TP', code: 'TP'},
    {name: 'TN', code: 'TN'}
];

//卡片颜色
var colors = ['#428ae4', '#f6b15a', '#38b8a7', '#57a050', '#007f9e'];

var reportUrl = 'http://103.14.132.101:8003/rps/#/rps?';

//运营动态
var yydtList = [
    {key: 'repare', menuName: 'repairTask'},
    {key: 'bigRepare', menuName: 'overHaulMisson'},
    {key: 'tech', menuName: 'techniqueChangeMisson'},
    {key: 'update', menuName: 'deviceUpdateMisson'},
];
