import { getTechnicalSupportList, saveTechnicalSupport, getTechnicalSupportDetail, addAnswer, acceptAnswer, getMyKnowledge } from '../services/expertService';
import { loadStaffTreeNew, getUserDetail} from '../services/commonIFS'
import {
    loadCommonParamSelect,
} from '../services/remoteData';
const u = require('updeep');
import { VtxUtil, generateUserTreeData } from '../utils/util';

// 查询条件
let initQueryParams = {
    title : '' // 标题
};

// 新增参数
let defaultNewItem = {
    title : '', // 标题
    businessId : undefined, // 业务范围
    knowledgeTypeId : undefined, // 知识类型
    problemContent : '', // 问题描述
    annx : [], // 上传附件
    inviteIds:[],
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    businessSelect : [], // 业务范围下拉数据
    knowledgeTypeSelect : [], // 知识类型下拉数据
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
    selectedRowKeys : [],
    uploaderInfo: {
        applyManId: '',
        applyManName: '',
        unitId: '',
        unitName: '',
        photo:''
    },
    userInfo:{},
    userList:[],
    newItem : {...defaultNewItem}, // 新增参数
    editItem:{ // 编辑参数
        visible:false,
        loading:false
    },
    viewItem: { // 查看参数
        visible:false
    }
};

export default {

    namespace : 'technicalSupport', // 技术支持

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/technicalSupport') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求业务范围下拉数据
                    dispatch({type : 'loadBusinessSelect'});
                    // 请求知识类型下拉数据
                    dispatch({type : 'loadKnowledgeTypeSelect'});
                    dispatch({ type: 'getMyKnowledge' });
                    dispatch({ type: 'getUserDetail' }).then(()=>{
                        dispatch({ type: 'loadStaffTree' })
                    })
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        //获取我的信息
        *getMyKnowledge({ payload }, { call, put, select }) {
            const { data } = yield call(getMyKnowledge)
            if (data && !data.result) {
                const result = data.data
                yield put({
                    type: 'updateState',
                    payload: {
                        uploaderInfo: {
                            applyManId: result.userId,
                            applyManName: result.userName,
                            unitId: result.waterFactoryId,
                            unitName: result.waterFactoryName,
                            photo:result.photo
                        }
                    }
                })
            }

        },
        //获取当前用户信息
        * getUserDetail({ payload }, { call, put, select }) {
            const { data } = yield call(getUserDetail, {
                userId: VtxUtil.getUrlParam('userId')
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo: data.data
                    }
                })
            }
        },

        //获取人员树
        * loadStaffTree({ payload }, { call, put, select }) {
            const { userInfo } = yield select(state => state.technicalSupport);
            const { data } = yield call(loadStaffTreeNew, {
                parameters: JSON.stringify({
                    tenantId: VtxUtil.getUrlParam('tenantId'),
                    companyId: userInfo.companyId
                })
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userList: generateUserTreeData(JSON.parse(data.data).items, ['staff'])
                    }
                })
            }
        },
        // 业务范围下拉
        *loadBusinessSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
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

        // 知识类型下拉
        *loadKnowledgeTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'knowledgeType',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            knowledgeTypeSelect : data.data
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
            } = yield select(({ technicalSupport}) =>  technicalSupport);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getTechnicalSupportList, VtxUtil.submitTrim(params));
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
        //查询详情
        *getDetail({ payload }, { call, put, select }){
            const {id,itemName} = payload
            const { data } = yield call(getTechnicalSupportDetail,{
                id
            })
            if(data&&!data.result){
                yield put({
                    type:'updateState',
                    payload:{
                        [itemName]:{
                            problemContent: data.data.problemContent,
                            answers:data.data.answers.rows
                        }
                    }
                })
            }
        },
        // 新增or编辑
        *saveOrUpdate({ payload }, { call, put, select }) {
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
            const {technicalStatus} = payload
            const { newItem, editItem,uploaderInfo } = yield select( ({ technicalSupport}) =>  technicalSupport );
            const {
                id, title, businessId, knowledgeTypeId, problemContent, annx, inviteIds,
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id, title, businessId, knowledgeTypeId, problemContent, annx:JSON.stringify(annx),
                inviteIds:inviteIds.join(),
                technicalStatus,
                tenantId : VtxUtil.getUrlParam('tenantId'),
                unitId: uploaderInfo.unitId,
                applyManId:uploaderInfo.applyManId,
                applyManName:uploaderInfo.applyManName,
                unitName:uploaderInfo.unitName,
                photo: uploaderInfo.photo
            };
            const { data } = yield call( saveTechnicalSupport, VtxUtil.submitTrim(params));
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
        //添加回答
        *addAnswer({ payload }, { call, put, select }){
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: { loading: true }
                }
            });
            const { viewItem,uploaderInfo } = yield select(({ technicalSupport }) => technicalSupport);
            const {newAnswer,id} = viewItem
            const { applyManId, applyManName, photo } = uploaderInfo
            const params = {
                technicalSupportId:id,
                userId: applyManId,
                userName:applyManName,
                userPhoto: photo,
                answerContent:newAnswer,
                tenantId: VtxUtil.getUrlParam('tenantId'),
            }
            const { data } = yield call(addAnswer, VtxUtil.submitTrim(params));
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: { loading: false }
                }
            });
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'提交失败');
            }
        },
        //采纳回答
        *acceptAnswer({ payload }, { call, put, select }){
            const { id, commentId } = payload
            const {data} = yield call(acceptAnswer,{
                id,commentId
            })
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data ? data.msg : '操作失败');
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