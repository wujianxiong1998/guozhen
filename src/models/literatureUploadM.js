import {
    loadCommonParamSelect,
} from '../services/remoteData';

const u = require('updeep');
import { VtxUtil } from '../utils/util';

const defaultNewItem = {
    title:'',//文献标题
    businessId:'',//业务范围
    knowledgeTypeId:'',//知识类型
    author:'',//作者
    phone:'',//联系方式
    attachment:[],
    fileListVersion:new Date().getTime()

}
export default{
    namespace:'literatureUpload',
    state:{
        newItem:{...defaultNewItem},
        businessSelect:[],//业务范围下拉
        knowledgeTypeSelect:[],//知识类型下拉
        uploader:'',//上传人
        occupation:'',//职务
        uploadUnit:'',//上传单位
        loading:false,
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/literatureUpload') {
                    // 请求业务范围下拉数据
                    dispatch({ type: 'loadBusinessSelect' });

                }
            })
        }
    },
    effects:{
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
        *saveData({ payload }, { call, put, select }) {
            const { newItem } = yield select(({ literatureUpload }) => literatureUpload)
            yield put({
                type:'updateState',
                payload:{
                    loading:true
                }
            })
            yield put({
                type: 'updateState',
                payload: {
                    loading: false
                }
            })
        }
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
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