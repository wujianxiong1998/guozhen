import {
    getStructureList,
    pageList,
} from '../services/accountInformation';
import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {
    overHaulTaskService, deleteService
} from "../services/overHaulService";
import {pageList as getSparePartsList} from '../services/spareParts';
import {loadEnum} from "../services/remoteData";
import {message} from 'antd'
import {generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

const partDataSource = [
    {key: '1', name: '11', type: '12', use: '13', price: '14', num: '15', total: '16'},
    {key: '2', name: '21', type: '22', use: '23', price: '24', num: '25', total: '26'},
];

// 查询条件
let initQueryParams = {
    code: '',  // 设备编号
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
};

const defaultNewItem = {
    id: '',
    actMoney: '',  // 实际费用（万元）
    actStartDay: '', // 开始时间
    actEndDay: '', // 结束时间
    actManId: '',  // 执行人id
    actManName: '',  // 执行人name
    details: '',  // 大修改进明细
    picIds: [],  // 上传文件
    sparePart: '',  //  配件信息
};


const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys : [],
    fileListVersion: 1,
    
    modelLonding: false,
    newItem : {...defaultNewItem},
    updataItem:{
        visible:false
    },
    viewItem:{
        visible:false
    },
    checkItem: {
        id: '',
        visible:false,
        auditMemo: '',  // 审核意见
    },
    getData: {}, // get 中的数据
    userInfo:{},
    userList: [],  // 人员树

    equipmentSelectList: [],
    equipmentSelectTotal: 0,
    equipmentSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },

    // 配件
    partDataSource: partDataSource,  // 配件数据
    partDataSourceCopy: [],
    partParams: {
        searchParams: {
            devName: '',
            page: 0,
            size: 10
        },
        partList: [],
        partloading : false,
        partTotal: 0,
        partRows: [],
        partIds: [],
        sureRows: [],
        modalVisible: false,
        countTotal: null
    },


};

export default {
    namespace: 'overHaulMisson',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/overHaulMisson') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                            partDataSourceCopy: JSON.parse(JSON.stringify(partDataSource))
                        }
                    });
                    dispatch({ type: 'getUserDetail' }).then(() => {
                        dispatch({ type: 'loadStaffTree' })
                    });
                    // Promise.all([
                    //     dispatch({ type: 'getUserDetail' }),
                    // ]).then(() => {
                    //     dispatch({ type: 'loadStaffTree' })
                    // }).then(() => {
                        dispatch({type: 'getList'});
                    // });
                    if (!!VtxUtil.getUrlParam('id')) {
                        dispatch({
                            type : 'getD',
                            payload : {
                                id: VtxUtil.getUrlParam('id')
                            }
                        })
                    }
                }
            });
        }
    },

    effects: {
        //获取当前用户信息
        * getUserDetail({payload}, {call, put, select}) {
            const {data} = yield call(getUserDetail, {
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
            const { userInfo } = yield select(state => state.overHaulMisson);
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

        //获取备品备件列表
        * getSparePartsList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.overHaulMisson.partParams);
            const {data} = yield call(getSparePartsList, {...searchParams, name: searchParams.devName});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updatePartParams',
                    payload: {
                        partRows: [],
                        partIds: [],
                        partList: data.data.rows,
                        partTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({overHaulMisson}) => overHaulMisson);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(overHaulTaskService.getList, params);
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

        // 回单
        *update({ payload = {} },{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem, partParams } = yield select( ({overHaulMisson}) => overHaulMisson );
            const params = {
                ...newItem,
                status: payload.status,
                // picIds: newItem.picIds.map(item => item.id).join(','),
                picIds: partParams.sureRows.length === 0?'':JSON.stringify(newItem.picIds),
                sparePart: partParams.sureRows.length === 0?'':JSON.stringify(partParams.sureRows.map(item => {
                    return {
                        ...item,
                        num: String(item.num),
                        price: String(item.price),
                        total: String(item.total)
                    }

                })),
                countTotal: partParams.countTotal,
                userId: VtxUtil.getUrlParam('userId'),
            };
            console.log(params)
            let { data } = yield call(overHaulTaskService.publish, params);
            if(!!data && data.result == 0){
                yield put({type:'getList'});
                message.success('编辑成功');
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
                type: 'bigRepareTask'
            };
            const { data } = yield call(deleteService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                // payload.onError( data ? data.msg : '删除失败' );
                deleteMessage(data);
            }
        },

        // 审核
        *audit({ payload = {} },{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { checkItem } = yield select( ({overHaulMisson}) => overHaulMisson );
            let { id, auditMemo } = checkItem;
            console.log(checkItem);
            const params = {
                id,
                auditMemo,
                auditStatus: payload.auditStatus
            };
            let { data } = yield call(overHaulTaskService.audit, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('审核成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id
            };
            const { data } = yield call(overHaulTaskService.detail, params);
            if(!!data && !data.result){
                yield put({
                    type: 'updateState',
                    payload: {
                        getData: {
                            ...data.data,
                            sparePart: data.data.sparePart?JSON.parse(data.data.sparePart):[],
                            picIds: data.data.picIds?JSON.parse(data.data.picIds):[],
                            countTotal: data.data.countTotal
                        }
                        // getData: data.data
                    }
                })
                yield put({
                    type: 'updatePartParams',
                    payload: {
                        sureRows: !!data.data.sparePart ? JSON.parse(data.data.sparePart).map(item => {
                            return {
                                ...item,
                                num: Number(item.num),
                                price: Number(item.price),
                                total: Number(item.total)
                            }
                        }) : [],
                        countTotal: data.data.countTotal
                    }
                })
            }
        }

    },

    reducers: {
        updateState(state,action){
            return {
                ...state,
                ...action.payload
            }
        },
        initParams(state,action) {
            return {
                ...state,
                newItem:{
                    ...defaultNewItem,
                    files: [],
                },
                partParams: {
                    searchParams: {
                        devName: '',
                        page: 0,
                        size: 10
                    },
                    partList: [],
                    partloading : false,
                    partTotal: 0,
                    partRows: [],
                    partIds: [],
                    sureRows: [],
                    modalVisible: false,
                    countTotal: null
                },
                checkItem: {
                    id: '',
                    visible:false,
                    auditMemo: '',  // 审核意见
                },
            }
        },
        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                ...initQueryParams,
                currentPage : 1,
                pageSize : 10,
                queryParams : initQueryParams
            }
        },
        updateNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...state.newItem,
                    ...action.payload
                }
            }
        },
        updateMissionItem(state, action){
            return {
                ...state,
                missionItem:{
                    ...state.missionItem,
                    ...action.payload
                }
            }
        },
        updateViewItem(state, action){
            return {
                ...state,
                viewItem:{
                    ...state.viewItem,
                    ...action.payload
                }
            }
        },

        clearEquipmentSearchParams(state, {payload}) {
            return {
                ...state,
                equipmentSelect: {
                    ...state.equipmentSelect,
                    searchParams: {
                        name: '',
                        page: 0,
                        size: 10
                    }
                },
            }
        },
        updateEquipmentSearchParams(state, {payload}) {
            return {
                ...state,
                equipmentSelect: {
                    ...state.equipmentSelect,
                    searchParams: {
                        ...state.equipmentSelect.searchParams,
                        ...payload
                    }
                },
            }
        },

        searchParams(state, {payload}) {
            return {
                ...state,
                partParams: {
                    ...state.partParams,
                    searchParams: {
                        ...state.partParams.searchParams,
                        ...payload
                    },
                }
                
            }
        },

        partParams(state, {payload}) {
            return {
                ...state,
                partParams: {
                    ...state.partParams,
                    ...payload
                },
            }
        },

        updatePartParams(state, {payload}) {
            return {
                ...state,
                partParams: {
                    ...state.partParams,
                    ...payload
                }
            }
        },

        checkItemParams(state, action){
            return {
                ...state,
                checkItem:{
                    ...state.checkItem,
                    ...action.payload
                }
            }
        },
    }
}
