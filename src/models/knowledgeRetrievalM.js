import {loadCommonParamSelect} from '../services/remoteData'
import {getLiteratureAuditList} from '../services/expertService'
const u = require('updeep');
import { VtxUtil, } from '../utils/util';
const initState = {
    searchParams:{
        keyword:'',//关键词
        businessIds:[],//业务范围
        knowledgeTypeIds:[],//知识类型
    },
    businessScopeList:[],//业务范围所有选项
    knowledgeTypeSelect: [], // 知识类型所有选项
    currentPage: 1, // 页码
    pageSize: 10, // 每页条数
    loading: false, // 列表是否loading
    dataSource: [], // 列表数据源
    total: 0, // 列表总条数
};
export default {

    namespace: 'knowledgeRetrieval', // 知识检索

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/knowledgeRetrieval') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState,
                            searchParams:{
                                keyword: decodeURI(VtxUtil.getUrlParam('title') || '')
                            }
                        }
                    })
                    dispatch({ type: 'getList' });
                    dispatch({ type: 'getBusinessScope' });
                    dispatch({ type: 'getKnowledgeType' });
                }
            })
        }
    },

    effects: {
        // 获取业务范围
        *getBusinessScope({ payload = {} }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'businessScope'
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            businessScopeList: data.data
                        }
                    })
                }
            }
        },
        //获取知识类型
        *getKnowledgeType({ payload = {} }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'knowledgeType',
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            knowledgeTypeSelect: data.data
                        }
                    })
                }
            }
        },
        //获取列表
        *getList({ payload = {} }, { call, put, select }) {
            const { searchParams, currentPage, pageSize } = yield select(({ knowledgeRetrieval}) => knowledgeRetrieval)
            const { keyword,businessIds,knowledgeTypeIds} = searchParams
            yield put({
                type:'updateState',
                payload:{
                    loading: true
                }
            })
            let params = {
                title:keyword,
                businessIds:businessIds.join(),
                knowledgeTypeId:knowledgeTypeIds.join(),
                page: currentPage-1,
                size: pageSize,
                auditStatus:'ysh'
            };
            const { data } = yield call(getLiteratureAuditList, VtxUtil.submitTrim(params));
            let dataSource = [], total = 0, status = false;
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item,
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                total,
                loading: false
            };
            // 请求成功 更新传入值
            status && (uState = { ...uState, ...payload });
            yield put({
                type: 'updateState',
                payload: { ...uState }
            })
        }
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },
    }
}