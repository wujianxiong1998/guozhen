const u = require('updeep');
import {message} from 'antd'
import { VtxUtil, } from '../utils/util';
import { getTechnicalSupportDetail, getKnowledgeDetail, addComment, getMyKnowledge,getComment} from '../services/expertService'
import {loadCommonParamSelect} from '../services/remoteData'
const initState = {
    id:'',
    documentType:'',
    searchParams: {
        keyword: '',//关键词
        knowledgeTypeId: '',//知识类型
    },
    knowledgeTypeSelect: [], // 知识类型所有选项
    detailLoading:false,
    commentLoading:false,
    detailInfo: 
    {
        title:'',//标题
        author:'',//作者
        waterFactoryName:'',//水厂名称
        knowledgeTypeName:'',//知识类型
        dateValue:'',//日期
        content:'',//内容
        annx:[],
    },
    supportInfo:{

    },
    userInfo:{

    },
    newComment:'',//待发表的评论
    comments:[],//所有评论
};

export default {
    namespace:'knowledgeDetail',
    state:{...initState},
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/knowledgeDetail') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState,
                            id:VtxUtil.getUrlParam('id'),
                            documentType: VtxUtil.getUrlParam('documentType'),
                        }
                    })
                    dispatch({ type: 'getDetail'});
                    dispatch({ type: 'getKnowledgeType' });
                    dispatch({ type: 'getMyKnowledge' });
                    dispatch({ type: 'getComment' });
                }
            })
        }
    },
    effects:{
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
        //获取详情
        *getDetail({ payload = {} }, { call, put, select }) {
            const { id, documentType } = yield select(({ knowledgeDetail }) => knowledgeDetail)
            yield put({
                type:'updateState',
                payload:{
                    detailLoading:true
                }
            })
            if(documentType==='support'){//技术支持
                const { data } = yield call(getTechnicalSupportDetail,{id,
                page:0,
                size:99
            })
                if(data&&!data.result){
                    yield put({
                        type:'updateState',
                        payload:{
                            supportInfo:{
                                ...data.data
                            }
                        }
                    })
                }
            }else{
                const { data } = yield call(getKnowledgeDetail, { id })
                if (data && !data.result) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            detailInfo: {
                                ...data.data,
                                annx:JSON.parse(data.data.annx||'[]')
                            }
                        }
                    })
                }
            }
            yield put({
                type: 'updateState',
                payload: {
                    detailLoading: false
                }
            })
        },
        //获取评论
        *getComment({ payload = {} }, { call, put, select }) {
            const { id } = yield select(({ knowledgeDetail }) => knowledgeDetail)
            const {data} = yield call(getComment,{
                id
            })
            if (!!data && !data.result&&data.data&&data.data.rows) {
                yield put({
                    type: 'updateState',
                    payload: {
                        comments: data.data.rows
                    }
                })
            }
        },
        //发表评论
        *addComment({ payload = {} }, { call, put, select }) {
            yield put({
                type: 'updateState',
                payload: {
                    commentLoading: true
                }
            })
            const {newComment,id,userInfo} = yield select(({knowledgeDetail}) => knowledgeDetail)
            const {data} = yield call(addComment,{
                documentId:id,
                commentContent:newComment,
                userId:userInfo.userId,
                userName:userInfo.userName,
                userPhoto:userInfo.photo
            })
            if (!!data && !data.result) {
                message.success('评论成功')
                yield put({
                    type:'updateState',
                    payload:{
                        newComment:''
                    }
                })
                yield put({
                    type:'getComment'
                })
            }
            yield put({
                type: 'updateState',
                payload: {
                    commentLoading: false
                }
            })
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
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },
    }
}