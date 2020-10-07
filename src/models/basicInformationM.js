import { getBasicInformationList,addBasicInformation,commonDelete,updateBasicInformation,
    loadCommonParamSelect,loadBusinessUnitSelect,loadRegionalCompanySelect,getFactoryHistory } from '../services/remoteData';

const u = require('updeep');
import { VtxUtil,deleteMessage } from '../utils/util';

// 查询条件
let initQueryParams = {
    name : '', // 名称
    businessUnitId : '', // 事业部
    regionalCompanyId : '' // 区域公司
};

// 新增参数
let defaultNewItem = {
    name : '', // 名称
    longitude:'',//经度
    latitude:'',//纬度
    floorArea : '', // 占地面积
    businessUnitId:'',//事业部
    regionalCompanyId:'',//区域公司
    businessId : '', // 业务范围
    processTypeId : '', // 工艺类型
    productTypeId : '', // 项目类别
    startDate : '', // 项目开始时间
    endDate : '', // 项目结束时间
    processSize : '', // 处理规模
    waterStandard : '', // 出水标准
    minWaterFlow : '', // 保底水价
    feeWaterFlow: '', // 收费水量
    waterPrice : '', // 水价
    putIntoOperationDate: '' // 投运时间
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    businessUnitSelect : [], // 事业部下拉数据
    regionalCompanySelect : [], // 区域公司下拉数据
    businessSelect : [], // 业务范围下拉数据
    processTypeSelect : [], // 工艺类型下拉数据
    productTypeSelect : [], // 项目类别下拉数据
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
    selectedRowKeys : [],
    newItem : {...defaultNewItem}, // 新增参数
    editItem:{ // 编辑参数
        visible:false,
        loading:false
    },
    viewItem: { // 查看参数
        visible:false
    },
    historyData: [] // 历史查询数据
};

export default {

    namespace : 'basicInformation', // 水厂

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/basicInformation') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求事业部下拉数据
                    dispatch({type : 'loadBusinessUnitSelect'});
                    // 请求区域公司下拉数据
                    dispatch({type : 'loadRegionalCompanySelect'});
                    // 请求业务范围下拉数据
                    dispatch({type : 'loadBusinessSelect'});
                    // 请求工艺类型下拉数据
                    dispatch({type : 'loadProcessTypeSelect'});
                    // 请求项目类别下拉数据
                    dispatch({type : 'loadProductTypeSelect'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 事业部下拉
        *loadBusinessUnitSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadBusinessUnitSelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            businessUnitSelect : data.data
                        }
                    })
                }
            }
        },

        // 区域公司下拉
        *loadRegionalCompanySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadRegionalCompanySelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            regionalCompanySelect : data.data
                        }
                    })
                }
            }
        },

        // 业务范围下拉
        *loadBusinessSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'businessScope',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            businessSelect : data.data
                        }
                    })
                }
            }
        },

        // 工艺类型下拉
        *loadProcessTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'processType',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            processTypeSelect : data.data
                        }
                    })
                }
            }
        },

        // 项目类别下拉
        *loadProductTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'productType',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            productTypeSelect : data.data
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
            } = yield select(({basicInformation}) => basicInformation);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getBasicInformationList, VtxUtil.submitTrim(params));
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
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },
        
        // 新增or编辑
        *saveOrUpdate({ payload }, { call, put, select }) {
            const { coordType } = yield select(({ common }) => common)
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
            const { newItem, editItem } = yield select( ({basicInformation}) => basicInformation );
            const {
                id, name, floorArea, businessId, processTypeId, productTypeId, startDate, businessUnitId,
                regionalCompanyId,endDate, processSize, waterStandard, minWaterFlow, waterPrice,longitude,latitude,feeWaterFlow, putIntoOperationDate
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id, name, floorArea, businessId, processTypeId, productTypeId, startDate, businessUnitId,
                regionalCompanyId, endDate, processSize, waterStandard, minWaterFlow, waterPrice, longitude, latitude,feeWaterFlow, putIntoOperationDate,
                coord:coordType,
                tenantId: VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call( payload.btnType === 'add' ? 
                    addBasicInformation : updateBasicInformation, VtxUtil.submitTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError();
            }
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : false }
                }
            });
        },
        
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(','),
                type:'basicInformation'
            };
            const { data } = yield call(commonDelete, params);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                deleteMessage(data)
            }
        },

        // 历史查询
        *getHistory({ payload }, { call, put, select}) {
            const { data } = yield call(getFactoryHistory, payload)
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            historyData : data.data
                        }
                    })
                }
            }
        }
    },

    reducers : {
		updateState(state,action){
            return u(action.payload, state);
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

        initNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...defaultNewItem
                }
            }
        }
    }
}