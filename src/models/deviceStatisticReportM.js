import { deviceStatisticReportService, totalCountService } from '../services/overHaulService';
import { loadWaterFactorySelect,loadRegionalCompanySelect } from '../services/remoteData'
const u = require('updeep');
import { VtxUtil } from '../utils/util';
import _ from 'lodash'
import { message } from 'antd';

// 查询条件
let initQueryParams = {
    waterFactoryId : undefined, // 水厂名称
    regionalCompanyId:undefined,//区域公司
};

const defaultNewItem = {
    id: '',
    templateName: '',  // 模板名称
    orderIndex: '',  // 排序
    device: [],  // 设备选择
};

const check = [
    {label: '设备总数', value: 'deviceTotalNum', key: 'deviceTotalNum'},
    {label: '在用设备数', value: 'deviceUseNum', key: 'deviceUseNum'},
    {label: '停用设备数', value: 'deviceUnUseNum', key: 'deviceUnUseNum'},
    {label: '报废设备数', value: 'deviceDropNum', key: 'deviceDropNum'},
    {label: '完好设备数', value: 'deviceOkNum', key: 'deviceOkNum'},
    {label: '维修设备数', value: 'deviceMaintainNum', key: 'deviceMaintainNum'},
    {label: '技改设备数', value: 'deviceTechNum', key: 'deviceTechNum'},
    {label: '大修设备数', value: 'deviceBigRepareNum', key: 'deviceBigRepareNum'},
    {label: '更新设备数', value: 'deviceUpdateNum', key: 'deviceUpdateNum'},
    {label: '设备完好率', value: 'deviceOkPercent', key: 'deviceOkPercent'},
    {label: 'A类设备完好率', value: 'deviceGradeAOkpercent', key: 'deviceGradeAOkpercent'},
    {label: '养护完成率', value: 'maintainCompletePercent', key: 'maintainCompletePercent'},
    {label: '养护完成及时率', value: 'maintainCompleteOnTimePercent', key: 'maintainCompleteOnTimePercent'},
    {label: '大修完成率', value: 'bigRepareCompletePercent', key: 'bigRepareCompletePercent'},
    {label: '大修完成及时率', value: 'bigRepareCompleteOnTimePercent', key: 'bigRepareCompleteOnTimePercent'},
    {label: '技改完成率', value: 'techCompletePercent', key: 'techCompletePercent'},
    {label: '技改完成及时率', value: 'techCompleteOnTimePercent', key: 'techCompleteOnTimePercent'},
    {label: '更新完成率', value: 'updateCompletePercent', key: 'updateCompletePercent'},
    {label: '更新完成及时率', value: 'updateCompleteOnTimePercent', key: 'updateCompleteOnTimePercent'},

]

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    waterFactorySelect : [], // 水厂名称下拉数据
    regionalCompanySelect: [], // 区域公司下拉数据
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
    columnsCopy: [
        ['设备总数', 'deviceTotalNum'],
        ['在用设备数', 'deviceUseNum'],
        ['停用设备数', 'deviceUnUseNum'],
        ['报废设备数', 'deviceDropNum'],
        ['完好设备数', 'deviceOkNum'],
        ['维修设备数', 'deviceMaintainNum'],
        ['技改设备数', 'deviceTechNum'],
        ['大修设备数', 'deviceBigRepareNum'],
        ['更新设备数', 'deviceUpdateNum'],
        ['设备完好率', 'deviceOkPercent'],
        ['A类设备完好率', 'deviceGradeAOkpercent'],
        ['养护完成率', 'maintainCompletePercent'],
        ['养护完成及时率', 'maintainCompleteOnTimePercent'],
        ['大修完成率', 'bigRepareCompletePercent'],
        ['大修完成及时率', 'bigRepareCompleteOnTimePercent'],
        ['技改完成率', 'techCompletePercent'],
        ['技改完成及时率', 'techCompleteOnTimePercent'],
        ['更新完成率', 'updateCompletePercent'],
        ['更新完成及时率', 'updateCompleteOnTimePercent'],
    ],

    modelLonding: false,
    newItem : {...defaultNewItem},

    subCurrentPage : 1, // 页码
    subPageSize : 10, // 每页条数
    subLoading : false, // 列表是否loading
    subDataSource : [], // 列表数据源
    subTotal : 0, // 列表总条数
    subVisable: false,
    selectedRowKeys: [],
    selectedRowKeys2: [],
    radiochoose: '',

    ssubVisable: false,
    ssubLoading : false,
    plainOptions: check,
    chexkBox: [],

};

export default {

    namespace : 'deviceStatisticReport',

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/deviceStatisticReport') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求水厂名称下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                    // 请求区域公司下拉数据
                    dispatch({type : 'loadRegionalCompanySelect'});
                    dispatch({type : 'getListMB'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    

    effects : {
        // 水厂名称下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            waterFactorySelect : data.data
                        }
                    })
                }
            }
        },
        // 区域公司下拉
        *loadRegionalCompanySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadRegionalCompanySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            regionalCompanySelect: data.data
                        }
                    })
                }
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({deviceStatisticReport}) => deviceStatisticReport);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(totalCountService.getList, params);
            let dataSource = [], total = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item, 
                        key : item.id
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                total,
                loading : false
            }
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

        // 获取列表
        *getListMB({ payload = {} }, { call, put, select }) {
            // yield put({ type : 'updateState', payload : {loading : true} });
            let params = {};
            const { data } = yield call(deviceStatisticReportService.getList, params);
            let subDataSource = [], columnsCopy = [], status = false, checkRows = [];
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    status = true;
                    subDataSource = data.data.map(item => ({
                        ...item, 
                        key : item.id
                    }));

                    if (data.data.length !== 0) {
                        for (let i in data.data[0]) {
                            if (data.data[0][i] === 1) {
                                checkRows.push(i);
                            }
                        }
                        let columns = JSON.parse(JSON.stringify(check));
                        columnsCopy = columns.filter(item => checkRows.includes(item.value)).map(item => {
                            return [item.label, item.value]
                        })
                    }
                }
            }
            let uState = data.data.length == 0?{
                subDataSource,
            }:{
                subDataSource,
                radiochoose: data.data[0].id,
                columnsCopy,
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

         // 保存
        *save(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {ssubLoading : true} });
            const { newItem, chexkBox } = yield select( ({deviceStatisticReport}) => deviceStatisticReport );
            const params = {
                id: newItem.id,
                templateName: newItem.templateName, 
                orderIndex: newItem.orderIndex, 
                deviceTotalNum: chexkBox.includes('deviceTotalNum')?1:0,
                deviceUseNum: chexkBox.includes('deviceUseNum')?1:0,
                deviceUnUseNum: chexkBox.includes('deviceUnUseNum')?1:0,
                deviceDropNum: chexkBox.includes('deviceDropNum')?1:0,
                deviceOkNum: chexkBox.includes('deviceOkNum')?1:0,
                deviceMaintainNum: chexkBox.includes('deviceMaintainNum')?1:0,
                deviceBigRepareNum: chexkBox.includes('deviceBigRepareNum')?1:0,
                deviceOkPercent: chexkBox.includes('deviceOkPercent')?1:0,
                deviceGradeAOkpercent: chexkBox.includes('deviceGradeAOkpercent')?1:0,
                maintainCompletePercent: chexkBox.includes('maintainCompletePercent')?1:0,
                maintainCompleteOnTimePercent: chexkBox.includes('maintainCompleteOnTimePercent')?1:0,
                bigRepareCompletePercent: chexkBox.includes('bigRepareCompletePercent')?1:0,
                bigRepareCompleteOnTimePercent: chexkBox.includes('bigRepareCompleteOnTimePercent')?1:0,
                techCompletePercent: chexkBox.includes('techCompletePercent')?1:0,
                techCompleteOnTimePercent: chexkBox.includes('techCompleteOnTimePercent')?1:0,
                updateCompletePercent: chexkBox.includes('updateCompletePercent')?1:0,
                updateCompleteOnTimePercent: chexkBox.includes('updateCompleteOnTimePercent')?1:0,
            };
            let { data } = yield call(deviceStatisticReportService.save, params);
            if(!!data && data.result == 0){
                yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('新增成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {ssubLoading : false} });
        },

        // 编辑
        *update(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {ssubLoading : true} });
            const { newItem, chexkBox } = yield select( ({deviceStatisticReport}) => deviceStatisticReport );
            const params = {
                id: newItem.id,
                templateName: newItem.templateName, 
                orderIndex: newItem.orderIndex, 
                deviceTotalNum: chexkBox.includes('deviceTotalNum')?1:0,
                deviceUseNum: chexkBox.includes('deviceUseNum')?1:0,
                deviceUnUseNum: chexkBox.includes('deviceUnUseNum')?1:0,
                deviceDropNum: chexkBox.includes('deviceDropNum')?1:0,
                deviceOkNum: chexkBox.includes('deviceOkNum')?1:0,
                deviceMaintainNum: chexkBox.includes('deviceMaintainNum')?1:0,
                deviceBigRepareNum: chexkBox.includes('deviceBigRepareNum')?1:0,
                deviceOkPercent: chexkBox.includes('deviceOkPercent')?1:0,
                deviceGradeAOkpercent: chexkBox.includes('deviceGradeAOkpercent')?1:0,
                maintainCompletePercent: chexkBox.includes('maintainCompletePercent')?1:0,
                maintainCompleteOnTimePercent: chexkBox.includes('maintainCompleteOnTimePercent')?1:0,
                bigRepareCompletePercent: chexkBox.includes('bigRepareCompletePercent')?1:0,
                bigRepareCompleteOnTimePercent: chexkBox.includes('bigRepareCompleteOnTimePercent')?1:0,
                techCompletePercent: chexkBox.includes('techCompletePercent')?1:0,
                techCompleteOnTimePercent: chexkBox.includes('techCompleteOnTimePercent')?1:0,
                updateCompletePercent: chexkBox.includes('updateCompletePercent')?1:0,
                updateCompleteOnTimePercent: chexkBox.includes('updateCompleteOnTimePercent')?1:0,
            };
            let { data } = yield call(deviceStatisticReportService.update, params);
            if(!!data && data.result == 0){
                yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('编辑成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {ssubLoading : false} });
        },

        // 删除
        *delete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids,
            };
            const { data } = yield call(deviceStatisticReportService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },
    },

    reducers : {
		updateState(state,action){
            return u(action.payload, state);
        },

        initParams(state,action) {
            return {
                ...state,
                newItem:{
                    ...defaultNewItem
                },
                chexkBox: [],
            }
        },

		updateQueryParams(state,action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                selectedRowKeys : [],
                currentPage : 1,
                queryParams : queryParams
            }
        },

        updateNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...state.newItem,
                    ...action.payload
                },
            }
        },

        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                currentPage : 1,
                pageSize : 10,
				 searchParams : initQueryParams,
                queryParams : initQueryParams
            }
        },

    }
}