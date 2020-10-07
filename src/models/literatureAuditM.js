import { getLiteratureAuditList, auditLiterature, deleteLiteratureAudit, addLiterature, getMyKnowledge } from '../services/expertService';
import {loadCommonParamSelect} from '../services/remoteData'
const u = require('updeep');
import moment from 'moment'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    knowledgeTypeId : '', // 类别
    uploadDateStart : '', // 上传日期
    uploadDateEnd : '', // 上传日期
    uploadUnit : '', // 上传单位
    title : '' // 关键词
};

const defaultNewItem = {
    title: '',//文献标题
    businessId: '',//业务范围
    knowledgeTypeId: '',//知识类型
    author: '',//作者
    contact: '',//联系方式
    attachment: [],
    fileListVersion: new Date().getTime()

}
const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    typeSelect : [], // 类别下拉数据
    uploadUnitSelect : [], // 上传单位下拉数据
    businessSelect: [],//业务范围下拉
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
    selectedRowKeys : [],
    uploaderInfo:{
        uploadManId:'',
        uploadManName:'',
        uploadUnit:'',
        uploadUnitName:'',

    },
    newItem:{
        ...defaultNewItem
    },
    editItem:{ // 编辑参数
        visible:false,
        loading:false
    },
    viewItem: { // 查看参数
        visible:false
    }
};

export default {

    namespace : 'literatureAudit', // 文献审核

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/literatureAudit') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求类别下拉数据
                    dispatch({type : 'loadTypeSelect'});
                    dispatch({ type: 'loadBusinessSelect' });
                    dispatch({ type: 'getMyKnowledge' });
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        //获取我的信息
        *getMyKnowledge({ payload }, { call, put, select }) {
            const {data} = yield call(getMyKnowledge)
            if(data&&!data.result){
                const result = data.data
                 yield put({
                     type:'updateState',
                     payload:{
                         uploaderInfo:{
                             uploadManId: result.userId,
                             uploadManName: result.userName,
                             uploadUnit: result.waterFactoryId,
                             uploadUnitName: result.waterFactoryName,
                         }
                     }
                 })
            }

        },
        // 类别下拉
        *loadTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'knowledgeType',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            typeSelect : data.data
                        }
                    })
                }
            }
        },
        // 业务范围下拉
        *loadBusinessSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'businessScope',
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            businessSelect: data.data
                        }
                    })
                }
            }
        },
        // 上传单位下拉
        *loadUploadUnitSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadUploadUnitSelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            uploadUnitSelect : data.data
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
            } = yield select(({literatureAudit}) => literatureAudit);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getLiteratureAuditList, VtxUtil.submitTrim(params));
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
        
        // 审核
        *handleAudit({ payload }, { call, put, select }) {
            const { auditStatus } = payload
        	yield put({
                type : 'updateState',
                payload : {
                    editItem : { loading : true }
                }
            });
            const { editItem } = yield select( ({literatureAudit}) => literatureAudit );
            const {
                id, auditReason,
            } = editItem;
            let params = {
                id, auditReason,
                auditStatus,
            };
            const { data } = yield call(auditLiterature, VtxUtil.submitTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'');
            }
        	yield put({
                type : 'updateState',
                payload : {
                    editItem : { loading : false }
                }
            });
        },
        *saveFile({ payload }, { call, put, select }) {
            const { newItem,uploaderInfo } = yield select(({ literatureAudit }) => literatureAudit)
            yield put({
                type: 'updateState',
                payload: {
                    newItem:{
                        loading: true
                    }
                }
            })
            const { title, businessId, knowledgeTypeId, author, contact,attachment} = newItem
            const {uploadManId,uploadManName,uploadUnit,uploadUnitName} = uploaderInfo
            let params = {
                title, businessId, knowledgeTypeId, author, contact,
                annx:JSON.stringify(attachment),
                uploadManId, uploadUnit,
                uploadManName, uploadUnitName,
                auditStatus:'dsh'
            }
            const { data } = yield call(addLiterature, VtxUtil.submitTrim(params));
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data ? data.msg : '');
            }
            yield put({
                type: 'updateState',
                payload: {
                    newItem: {
                        loading: false
                    }
                }
            })
        },
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { id } = payload;
            const {viewItem} = yield select(({literatureAudit}) => literatureAudit)
            const {auditReason} = viewItem
            const params = {
                id,
                auditReason,
                auditStatus:'ysc'
            };
            const { data } = yield call(auditLiterature, params);
            if(!!data && data.result==0){
                payload.onSuccess(id);
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
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
        initNewItem(state, action) {
            return {
                ...state,
                newItem: {
                    ...defaultNewItem
                }
            }
        }

    }
}