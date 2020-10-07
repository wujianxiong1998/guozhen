import u from 'updeep';
import { VtxUtil } from '../utils/util';
import { getInfoByTenantIdIFS} from '../services/commonIFS';

const STATE = {
    getTenantInfo:false,  //是否获取租户信息
    getGPSCfg:false, //是否已经获取gps配置项
    mapType: 'bmap', //地图类型
    mapName:'百度地图', //地图中文名
    coordType: 'bd09', //地图坐标类型
    tenantPosition:null, //租户配置的中心点
}

export default {

    namespace: 'common',

    state: u(STATE,null),

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/waterFactory') {
                    dispatch({ type: 'getTenantInfo' })
                }
            })
        },
    },

    effects: {
        *fetch({ payload }, { call, put, select }) {
            yield put({ type: 'save' });
        },
        *getTenantInfo({ payload }, { call, put, select }){            
            const state = yield select(({common})=>common);
            // 多次调用只取一次
            if(state.getTenantInfo)return;

            const tenantId = VtxUtil.getUrlParam('tenantId');
            if(!tenantId){
                console.error('未能从URL取得tenantId')
                return;
            }
            const {data} = yield call(getInfoByTenantIdIFS,{
                parameters:JSON.stringify({id:tenantId})
            });
            if(data && data.data){
                let updatedObj = {
                    getTenantInfo:true
                };
                if(data.data.mapDefJson){
                    const mapDef = JSON.parse(data.data.mapDefJson);
                    const defaultCfg = mapDef.filter(item=>item.defaultMap).pop();

                    updatedObj.mapType = defaultCfg.mapType;
                    updatedObj.coordType = defaultCfg.coordinate;
                    updatedObj.mapName = defaultCfg.mapName;
                    // acgis地图额外参数
                    if(defaultCfg.mapType=='gmap'){
                        updatedObj.mapServer = JSON.parse(defaultCfg.basicData);
                        updatedObj.minZoom = parseInt(defaultCfg.minZoom);
                        updatedObj.maxZoom = parseInt(defaultCfg.maxZoom);
                        updatedObj.mapZoomLevel = Math.floor((parseInt(defaultCfg.maxZoom)+parseInt(defaultCfg.minZoom))/2)
                        updatedObj.wkid = defaultCfg.wkid;
                    }
                }
                else{
                    console.warn('当前租户未定义地图类型');
                }

                if(data.data.longitudeDone && data.data.latitudeDone){
                    updatedObj.tenantPosition = [data.data.longitudeDone,data.data.latitudeDone];
                }
                else{
                    console.warn('当前租户未定义中心点');
                }
                yield put({
                    type:'updateState',
                    payload:updatedObj
                })
            }
            else{
                console.error('调用获取租户信息接口失败');
            }
        },
        
    },

    reducers: {
        updateState(state, action) {
            return u({ ...action.payload }, state);
        },
        resetState(state, action){
            return u(STATE,null);
        }
    },

};
