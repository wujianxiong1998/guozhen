// import { rubbishTypeService } from '../../services/basicInformation';
import queryString from 'query-string';
import {message} from 'antd'
import { VtxUtil } from "../utils/util";
import {
    yearService,
} from "../services/maintainService";
import moment from 'moment';

// 查询条件
let initQueryParams = {
    name: '',  // 设备名称
    startDay: moment().format('YYYY-01-01'),  // 开始时间
    endDay: moment().format('YYYY-12-31'),  // 结束时间
};

const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys: [],
};

export default {
    namespace: 'yearMaintainPlay',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/yearMaintainPlay') {
                    const deviceName = VtxUtil.getUrlParam('deviceName')
                    // const deviceName = queryString.parse(deviceName);
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                            queryParams: {
                                ...initQueryParams,
                                name: deviceName === 'undefined'?'':deviceName,
                            }
                        }
                    });
                    dispatch({type : 'getList'});
                }
            });
        }
    },

    effects: {

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({yearMaintainPlay}) => yearMaintainPlay);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(yearService.getList, params);
            let dataSource = [], total = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item, 
                        // stopTime: moment(item.maintainDateStr).add(item.period, 'days').format('YYYY-MM-DD HH:mm:ss'),
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
    }
}