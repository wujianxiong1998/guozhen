import React from 'react';
import moment from 'moment';
import {Carousel, Row, Col, Icon, message} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import ItemTitle from './ItemTitle';
import {VtxUtil} from "../../../utils/util";

moment.locale('zh-cn');

export default class TendsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const {tendsTab, depType, hyNewsList, newsList, clickTab} = this.props;
        
        const menus = depType === 'factory' ? {
            names: [
                {id: 'hydt', name: '行业动态'}
            ]
        } : {
            names: [
                {id: 'yydt', name: '运营动态'},
                {id: 'hydt', name: '行业动态'}
            ]
        };
        
        const list = tendsTab === 'hydt' ? hyNewsList : newsList;
        
        const titleProps = {
            tabKey: tendsTab,
            ...menus,
            clickTab: (key) => clickTab(key)
        };
        
        const openWindow = (item) => {
            if (!!item.src) {
                window.open(item.src);
            } else if (!!item.thingType) {
                const menuName = yydtList.map(each => {
                    if (each.key === item.thingType) {
                        return each.menuName
                    }
                }).filter(item => !!item)[0];
                window.open(`${mainUrl}&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}&menuName=${menuName}&id=${item.thingId}`)
                // window.open(`http://10.10.11.10:1002/#/${menuName}?&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&id=${item.thingId}`)
            }
        };
        
        return (
            <div className={styles.tendsBox}>
                <ItemTitle {...titleProps}/>
                <div style={{
                    backgroundColor: '#fff',
                    height: '100%',
                    marginTop: '-32px',
                    borderTop: '32px solid #f5f5f5',
                    borderRadius: '8px',
                    padding: '4px'
                }}>
                    <div style={{width: '100%', height: '45%'}}>
                        <Carousel autoplay={true}>
                            <img style={{width: '100%', height: '100%'}} src="./resources/images/example.png"
                                 alt="example"/>
                            <img style={{width: '100%', height: '100%'}} src="./resources/images/example.png"
                                 alt="example"/>
                            <img style={{width: '100%', height: '100%'}} src="./resources/images/example.png"
                                 alt="example"/>
                        </Carousel>
                    </div>
                    <div className={styles.newsList}>
                        {tendsTab === 'hydt' ? list.slice(0, 5).map(item => (
                            <div key={item.id} className={styles.newsItem} onClick={() => openWindow(item)}>
                                <div style={{float: 'left'}}>
                                    <span/>{item.title}</div>
                                <div
                                    style={{float: 'right'}}>{moment(item.newsPublishDateStr).format('YYYY/MM/DD')}</div>
                            </div>
                        )) : list.slice(0, 6).map(item => (
                            <div key={item.id} className={styles.newsItem} onClick={() => openWindow(item)}>
                                <div style={{float: 'left'}}>
                                    <span/>{item.title}</div>
                                <div
                                    style={{float: 'right'}}>{moment(item.newsPublishDateStr).format('YYYY/MM/DD')}</div>
                            </div>
                        ))}
                        {tendsTab === 'hydt' && list.length > 5 && <Row className={styles.newsItem}>
                            <Col span={15}/>
                            <Col span={6} style={{float: 'right', color: '#4183e4', textAlign: 'right'}}
                                 onClick={() => {
                                     window.open(`${mainUrl}&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}&menuName=newsManage`);
                                     // window.open(`./#/newsManage?tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}`)
                                 }}>
                                更多&nbsp;&nbsp;<Icon type="forward"/>
                            </Col>
                        </Row>}
                    </div>
                </div>
            </div>
        );
    };
}
