import { deviceSelfService } from '../services/overHaulService';
import { loadWaterFactorySelect,loadRegionalCompanySelect } from '../services/remoteData'
const u = require('updeep');
import { VtxUtil } from '../utils/util';
import _ from 'lodash'
import { message } from 'antd';

// 查询条件
let initQueryParams = {
    waterFactoryId : undefined, // 水厂名称
    regionalCompanyId:undefined,//区域公司
    businessId: undefined,//事业部
    startDay: '',
    endDay: ''
};

const defaultNewItem = {
    id: '',
    templateName: '',  // 模板名称
    orderIndex: '',  // 排序
    device: [],  // 设备选择
};

const check = [
    {label: '大修费用', value: 'bigRepareMoney', key: 'bigRepareMoney'},
    {label: '大修次数', value: 'bigRepareNum', key: 'bigRepareNum'},
    {label: '投用时长', value: 'buyDays', key: 'buyDays'},
    {label: '规格型号', value: 'dimension', key: 'dimension'},
    {label: '养护次数', value: 'maintainNum', key: 'maintainNum'},
    {label: '生产厂家', value: 'manufacturer', key: 'manufacturer'},
    {label: '设备编号', value: 'code', key: 'code'},
    {label: '购买价格', value: 'price', key: 'price'},
    {label: '安装位置', value: 'structuresName', key: 'structuresName'},
    {label: '技改费用', value: 'techMoney', key: 'techMoney'},
    {label: '总维修费用', value: 'totalRepareMoney', key: 'totalRepareMoney'},
    {label: '总维修次数', value: 'totalRepareNum', key: 'totalRepareNum'},
    {label: '更新费用', value: 'updateMoney', key: 'updateMoney'},
    {label: '设备名称', value: 'name', key: 'name'},
    {label: '设备类型', value: 'typeName', key: 'typeName'},
    {label: '投用时间', value: 'operationDate', key: 'operationDate'},
    {label: '全生命周期费用', value: 'totalMoney', key: 'totalMoney'},
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
        ['大修费用', 'bigRepareMoney'],
        ['大修次数', 'bigRepareNum'],
        ['投用时长', 'buyDays'],
        ['规格型号', 'dimension'],
        ['养护次数', 'maintainNum'],
        ['生产厂家', 'manufacturer'],
        ['设备编号', 'code'],
        ['购买价格', 'price'],
        ['安装位置', 'structuresName'],
        ['技改费用', 'techMoney'],
        ['总维修费用', 'totalRepareMoney'],
        ['总维修次数', 'totalRepareNum'],
        ['更新费用', 'updateMoney'],
        ['设备名称', 'name'],
        ['设备类型', 'typeName'],
        ['投用时间', 'operationDate'],
        ['全生命周期费用', 'totalMoney'],
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
    radiochoose: '',

    ssubVisable: false,
    ssubLoading : false,
    plainOptions: check,
    chexkBox: [],

};

export default {

    namespace : 'deviceSelfReport',

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/deviceSelfReport') {
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
            } = yield select(({deviceSelfReport}) => deviceSelfReport);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(deviceSelfService.getList, params);
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