import React from 'react';
import moment from 'moment';
import {Col, Icon, Row, Table} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import {VtxDatagrid} from 'vtx-ui';

moment.locale('zh-cn');

export default class MettingSummary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
        this.props.getList()
    }
    
    render() {
        const {meetingSummary} = this.props;
        
        const names = [
            {id: 'produceDept', name: '生产技术部'},
            {id: 'ctrlDept', name: '中控班'},
            {id: 'hyDept', name: '化验班'},
            {id: 'wnDept', name: '污泥班'},
            {id: 'repareDept', name: '维修班'},
            {id: 'totalDept', name: '综合办'},
        ];
        
        return (
            <div className={styles.mettingSummary}>
                <div className={styles.monthlyTitle}>早会纪要</div>
                <div className={styles.summaryContent}>
                    {names.map(item => (
                        <div key={item.id} className={styles.summaryItem}>
                            <div style={{float: 'left'}}>
                                <span/>[{item.name}]&nbsp;{!!meetingSummary && meetingSummary[item.id] ? meetingSummary[item.id] : '-'}
                            </div>
                            <div style={{float: 'right'}}>{moment().format('YYYY/MM/DD')}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
}
