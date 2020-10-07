import React from 'react';
import moment from 'moment';
import {Row, Col, message} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import ItemTitle from './ItemTitle';
import {VtxUtil} from "../../../utils/util";

moment.locale('zh-cn');

export default class FastEntryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const {depType, tabKey, clickTab, factoryContent} = this.props;
        
        const titleProps = {
            tabKey,
            names: [{id: 'kjrk', name: '快捷入口'}, {id: 'yjgn', name: '一级功能'}],
            clickTab: (key) => clickTab(key)
        };
        
        const menus = tabKey === 'kjrk' ? fastEntory : primaryFunction;
        
        //点击菜单
        const clickMenu = (menuName, menuTab) => {
            if (!!menuName) {
                if (menuName !== 'jsc') {
                    window.open(`${mainUrl}&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}&menuName=${menuName}&menuTab=${menuTab}`)
                } else {
                    if (depType === 'company' || depType === 'business') {
                        window.open(`${jscUrl}?tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}`)
                    } else {
                        window.open(`${jscDetailUrl}?tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&factoryId=${factoryContent.factoryId}`)
                    }
                }
            } else {
                message.info('功能开发中')
            }
        };
        
        return (
            <div className={styles.fastEntryBox}>
                <ItemTitle {...titleProps}/>
                <div style={{
                    backgroundColor: '#fff',
                    height: '100%',
                    marginTop: '-32px',
                    borderTop: '32px solid #f5f5f5',
                    borderRadius: '8px'
                }}>
                    <Row style={{height: '100%'}}>
                        {menus.map(item => (
                            <Col key={item.src} span={8} style={{height: '32.8%'}}
                                 onClick={() => clickMenu(item.menuName, item.menuTab)}>
                                <div className={styles.fastEntryItem}>
                                    <img src={`./resources/images/${item.src}.png`} alt="item.src"/>
                                    <div style={{fontSize: '14px'}}>{item.name}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        );
    };
}
