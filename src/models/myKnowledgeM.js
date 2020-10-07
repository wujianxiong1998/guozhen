const u = require('updeep');
import { VtxUtil, } from '../utils/util';
import { acceptAnswer,getMyKnowledge, auditLiterature, getLiteratureAuditList, getTechnicalSupportList,
    getTechnicalSupportDetail, getMyAnswer } from '../services/expertService'

const initState = {
    userId:'',
    userInfo:{
        avatar:'',//头像
        userName:'',//姓名
        score:0,//积分
        uploadNum:0,//已上传次数
        askNum:0,//提问次数
        commentNum:0,//评论次数
    },
    selectedKey:'myUpload',//左侧选中tab
    dataSource: [],//
    currentPage: 1,
    pageSize: 10,
    total:0,
    loading:false,
    myUploadViewItem:{//我的上传
        visible:false
    },
    myAskViewItem: {//我的提问
        visible: false
    },
    myAnswerViewItem: {
        visible: false
    }
}

export default {
    namespace: 'myKnowledge',
    state: { ...initState },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/myKnowledge') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState,
                        }
                    })
                    dispatch({ type: 'getDetail',payload:{userId:VtxUtil.getUrlParam('userId')} });
                    dispatch({ type: 'getMyKnowledge' });
                    dispatch({ type: 'getUploadList' });
                }
            })
        }
    },
    effects: {
        //获取我的信息
        *getMyKnowledge({ payload }, { call, put, select }) {
            const { data } = yield call(getMyKnowledge)
            if (data && !data.result) {
                const result = data.data
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo: {
                            ...data.data
                        }
                    }
                })
            }

        },
        //获取我的上传列表
        *getUploadList({ payload = {} }, { call, put, select }){
            yield put({ type: 'updateState', payload: { loading: true } });
            const {currentPage,pageSize} = yield select(({myKnowledge}) => myKnowledge)
            const { data } = yield call(getLiteratureAuditList,{
                page: currentPage - 1,
                size: pageSize,
                checkManId: VtxUtil.getUrlParam('userId')
            })
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
        //获取我的提问列表
        *getAskList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            const { currentPage, pageSize } = yield select(({ myKnowledge }) => myKnowledge)
            const { data } = yield call(getTechnicalSupportList, {
                page: currentPage - 1,
                size: pageSize,
                checkManId:VtxUtil.getUrlParam('userId')
            })
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
        //获取我的回答列表
        *getAnswerList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            const { currentPage, pageSize } = yield select(({ myKnowledge }) => myKnowledge)
            const { data } = yield call(getMyAnswer, {
                page: currentPage - 1,
                size: pageSize,
            })
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

        // 删除我的上传
        *deleteMyUpload({ payload }, { call, put, select }) {
            let { id } = payload;
            const { myUploadViewItem } = yield select(({ myKnowledge }) => myKnowledge)
            const { auditReason } = myUploadViewItem
            const params = {
                id,
                auditReason,
                auditStatus: 'ysc'
            };
            const { data } = yield call(auditLiterature, params);
            if (!!data && data.result == 0) {
                payload.onSuccess(id);
            }
            else {
                payload.onError(data ? data.msg : '删除失败');
            }
        },
        //采纳回答
        *acceptAnswer({ payload }, { call, put, select }) {
            const { id, commentId } = payload
            const { data } = yield call(acceptAnswer, {
                id, commentId
            })
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data ? data.msg : '操作失败');
            }
        },
        //查询详情
        *getAskItemDetail({ payload }, { call, put, select }) {
            const { id, itemName } = payload
            const { data } = yield call(getTechnicalSupportDetail, {
                id
            })
            if (data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        [itemName]: {
                            problemContent: data.data.problemContent,
                            answers: data.data.answers.rows
                        }
                    }
                })
            }
        },
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },
    }
}