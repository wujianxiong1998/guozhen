import { filesBackService, filesTypeService } from '../services/alarmService';
import { exportFiles} from '../services/remoteData'
import {message} from 'antd';
import moment from 'moment';

const attFormat = [
    {id: 'doc', value: 'DOC'},
    {id: 'ppt', value: 'PPT'},
    {id: 'txt', value: 'TXT'},
    {id: 'pdf', value: 'PDF'},
    {id: 'xls', value: 'XLS'},
    {id: 'jpg', value: 'JPG'},
    {id: 'cad', value: 'CAD'},
];

const attFormat1 = [ 'DOC', 'PPT', 'TXT', 'PDF', 'XLS', 'JPG', 'CAD'];

// 查询条件
let initQueryParams = {
    startTime: '',  // 开始时间
    endTime: '',  // 结束时间
    otherTime: '1', 
    fileType: [],  // 文件类型
    annxFormat: attFormat1,  // 附件类型
    fileRecordNo: '',  // 档案号
    title:'',
    annxFormatAll: true,
    fileTypeAll: true,
};

// 档案类型
const filesTypes = [
    {key: '1', name: '全部'},
    {key: '2', name: '一周内'},
    {key: '3', name: '一个月内'},
    {key: '4', name: '三个月内'},
    {key: '5', name: '半年内'},
    {key: '6', name: '一年内'},
]

const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,

    viewItem:{
        visible:false
    },

    typeSel: [],  // 档案类型

    showSel: false,  // 筛选
    filesType: filesTypes,
    attFormat: attFormat,  // 附件格式
};

export default {
    namespace: 'filesSearching',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/filesSearching') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    Promise.all([
                        dispatch({type : 'loadType'}),
                    ]).then(() => {
                        dispatch({type : 'getList'});
                    })
                }
            });
        }
    },

    effects: {

        // 档案类型
        * loadType({payload}, {call, put, select}) {
            const {data} = yield call(filesTypeService.list);
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        typeSel: [
                            ...data.data.map(item => {
                                return {
                                    id: item.id,
                                    value: item.typeName
                                }
                            }),
                            
                        ]
                    }
                })
                yield put({
                    type: 'updateParamsItem',
                    payload: {
                        fileType: [
                            ...data.data.map(item => (item.typeName)),
                            
                        ]
                    }
                })
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams, typeSel,
            } = yield select(({filesSearching}) => filesSearching);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let startDay = '';
            if (queryParams.otherTime) {
                switch (queryParams.otherTime) {
                    case '1':
                        startDay = '';
                        break;
                    case '2':
                        startDay = moment().subtract(7, 'days').format('YYYY-MM-DD');
                        break;
                    case '3':
                        startDay = moment().subtract(30, 'days').format('YYYY-MM-DD');
                        break;
                    case '4':
                        startDay = moment().subtract(90, 'days').format('YYYY-MM-DD');
                        break;
                    case '5':
                        startDay = moment().subtract(6, 'months').format('YYYY-MM-DD');
                        break;
                    case '6':
                        startDay = moment().subtract(12, 'months').format('YYYY-MM-DD');
                        break;
                    default:
                        break;
                }
            }
            let typeSelFilter = typeSel.filter(item => queryParams.fileType.includes(item.value))
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize,
                startTime: queryParams.otherTime?startDay:queryParams.startTime,
                endTime: queryParams.otherTime?queryParams.otherTime === '1'?'':moment().format('YYYY-MM-DD'):queryParams.endTime,
                fileType: queryParams.fileType.length === 0?'':typeSelFilter.map(item => (item.id)).join(','),
                annxFormat: queryParams.annxFormat.length === 0?'':queryParams.annxFormat.map(item => item.toLowerCase()).join(','),
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
        //导出压缩包
        *exportFiles({ payload = {} }, { call, put, select }) {
            const {fileName,ids} = payload;
            const {data} = yield call(exportFiles,{
                parameters:{
                    fileName,
                    ids
                }
            })
        }
    },

    reducers: {
        updateState(state,action){
            return {
                ...state,
                ...action.payload
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
        updateViewItem(state, action){
            return {
                ...state,
                viewItem:{
                    ...state.viewItem,
                    ...action.payload
                }
            }
        },
        updateParamsItem(state, action){
            return {
                ...state,
                queryParams:{
                    ...state.queryParams,
                    ...action.payload
                }
            }
        },
    }
}