import { getAbnormalRecordList,deleteAbormoalTask } from '../services/produtionService';
import { loadEnum } from '../services/remoteData';
const u = require('updeep');
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    startTime: '', // 开始时间
    endTime: '', // 结束时间
    auditStatus: '',//审核状态
};

const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    queryParams: { ...initQueryParams }, // 查询列表参数
    auditStatusSelect: [],//任务状态下拉
    currentPage: 1, // 页码
    pageSize: 10, // 每页条数
    loading: false, // 列表是否loading
    dataSource: [], // 列表数据源
    total: 0, // 列表总条数
    selectedRowKeys: [],
    viewItem: { // 查看参数
        visible: false
    }
};

export default {

    namespace: 'abnormalRecord', // 异常记录

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/abnormalRecord') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })

                    dispatch({ type: 'loadAuditStatusSelect' })
                    dispatch({ type: 'getList' });
                }
            })
        }
    },

    effects: {
        // 任务状态下拉
        *loadAuditStatusSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadEnum, {
                enumName: 'AuditStatusEnum'
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            auditStatusSelect: data.data
                        }
                    })
                }
            }
        },
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({ abnormalRecord }) => abnormalRecord);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page: currentPage - 1,
                size: pageSize
            };
            const { data } = yield call(getAbnormalRecordList, VtxUtil.submitTrim(params));
            let dataSource = [], total = 0, status = false;
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item,
                        key: item.id
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
        },
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids: ids.join(',')
            };
            const { data } = yield call(deleteAbormoalTask, params);
            if (!!data && data.result == 0) {
                payload.onSuccess(ids);
            }
            else {
                payload.onError(data ? data.msg : '删除失败');
            }
        }
    },

    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },

        updateQueryParams(state, action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                selectedRowKeys: [],
                currentPage: 1,
                queryParams: queryParams
            }
        },

        initQueryParams(state, action) {
            return {
                ...state,
                ...action.payload,
                currentPage: 1,
                pageSize: 10,
                searchParams: initQueryParams,
                queryParams: initQueryParams
            }
        },
    }
}