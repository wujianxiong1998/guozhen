import { filesBackService, filesTypeService } from '../services/alarmService';
import {loadStaffTreeNew, loadOrgTree, getUserDetail} from "../services/commonIFS";
import {message} from 'antd';
import {loadEnum} from "../services/remoteData";
import { generateTreeOrg, generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";
import moment from 'moment';

// 查询条件
let initQueryParams = {
    startTime: '',  // 开始时间
    endTime: '',  // 结束时间
    fileType: '',  // 档案类型
    title: '',  // 题名包含
    fileRecordNo: '',  // 档案号
    waterFactoryId: '',  // 水厂树
};

const defaultNewItem = {
    id: '',
    fileRecordNo: '',  // 档案号
    title: '',  // 题名
    recordDate: '',  // 归档日期
    recordDepartment: '',  // 归档部门
    recordMan: '',  // 归档人
    recordManName: '',
    fileType: '',  // 档案类型
    textNo: '',  // 文号
    itemNo: '',  // 件号
    boxNo: '',  // 盒号
    pageNum: '',  // 页数
    recordNum: '',  // 份数
    putLocation: '',  // 存放位置
    memo: '',  // 备注
    annx: [],  // 上传文件
};

const initState = {
    ...initQueryParams,
    queryParams : {...initQueryParams},
    expandedKeys : [],

    factoryData : [],
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys : [],
    fileListVersion: 1,

    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据
    
    modelLonding: false,
    newItem : {...defaultNewItem},
    userInfo:{},
    userList: [],  // 人员树
    orgList: [],  // 机构树
    typeSel: [],  // 档案类型
};

export default {

    namespace : 'filesBack',

    state : initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/filesBack') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })

                    dispatch({type : 'loadType'});
                    dispatch({ type: 'getUserDetail' }).then(() => {
                        dispatch({ type: 'loadStaffTree' })
                    })
                    dispatch({type: 'loadOrgTree'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 档案类型
        * loadType({payload}, {call, put, select}) {
            const {data} = yield call(filesTypeService.list);
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        typeSel: data.data
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
        * loadStaffTree({payload}, {call, put, select}) {
            const { userInfo } = yield select(state => state.filesBack);
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
                        userList: generateTreeNameData(JSON.parse(data.data).items, ['staff'])
                    }
                })
            }
        },

        // 获取机构树
        * loadOrgTree({payload}, {call, put, select}) {
            const {data} = yield call(loadOrgTree, {isControlPermission: 1});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        orgList: generateTreeOrg(JSON.parse(data.data).items)
                    }
                })
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({filesBack}) => filesBack);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                type: 'xjxmType',
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(filesBackService.getList, params);
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

        // 保存
        *save(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem, queryParams } = yield select( ({filesBack}) => filesBack );
            let annxFormatArr = newItem.annx.map(item => item.name.split('.')[1]);
            const params = {
                ...newItem,
                annx: JSON.stringify(newItem.annx),
                waterFactoryId: queryParams.waterFactoryId,
                tenantId:VtxUtil.getUrlParam('tenantId'),
                annxFormat: newItem.annx.length === 0?'':JSON.stringify(annxFormatArr),
            };
            let { data } = yield call(filesBackService.save, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('新增成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 修改
        *update(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem } = yield select( ({filesBack}) => filesBack );
            let { id, code, name } = newItem;
            const params = {
                id,
                code,
                name,
                type: 'xjxmType',
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            let { data } = yield call(filesBackService.update, params);
            if(!!data && !data.result){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('修改成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 删除
        *delete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids,
                type: 'xjxmType',
            };
            const { data } = yield call(filesBackService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                // payload.onError( data ? data.msg : '删除失败' );
                deleteMessage(data);
            }
        },
        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id,
                type: 'xjxmType',
            };
            const { data } = yield call(filesBackService.detail, params);
            if(!!data && !data.result){
                yield put({
                    type: 'updateState',
                    payload: {
                        getData: data.data
                    }
                })
            }
        }

    },

    reducers : {
        updateState(state,action){
            return {
                ...state,
                ...action.payload
            }
        },

        updateQueryParams(state,action) {
            let queryParams = _.pick(state, _.keys(initQueryParams));
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
                ...initQueryParams,
                currentPage : 1,
                pageSize : 10,
                queryParams : {
                    // ...state.queryParams,
                    fileType: '',  
                    title: '', 
                    fileRecordNo: '', 
                    startTime: '',  
                    endTime: '',
                }
            }
        },
        initParams(state,action) {
            return {
                ...state,
                newItem:{
                    ...defaultNewItem,
                    annx: [],
                },
            }
        },
        // initQueryParams(state,action) {
        //     return {
        //         ...state,
        //         ...action.payload,
        //         ...initQueryParams,
        //         currentPage : 1,
        //         pageSize : 10,
        //         queryParams : initQueryParams
        //     }
        // },
        updateNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...state.newItem,
                    ...action.payload
                }
            }
        },

    }
}