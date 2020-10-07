import React from 'react';
import moment from 'moment';
import {Table} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import {VtxDatagrid} from 'vtx-ui';

moment.locale('zh-cn');

export default class WaterworksComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    
    }
    
    render() {
        const {monthlyData} = this.props;
        
        const tableProps = {
            columns: [{
                title: '区域',
                dataIndex: 'area',
                key: 'area',
                nowrap: true
            }, {
                title: '负荷率(%)',
                dataIndex: 'load',
                key: 'load',
                nowrap: true,
                render: (text, record) => (<span>{Number(text).toFixed(2)}</span>)
            }, {
                title: '处理量(m³)',
                dataIndex: 'dealWater',
                key: 'dealWater',
                nowrap: true
            }, {
                title: '上月环比(%)',
                dataIndex: 'lastMonth',
                key: 'lastMonth',
                nowrap: true,
                render: (text, record) => (
                    <span>
                        {text > 0 &&
                        <img style={{width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '2px'}}
                             src="./resources/images/up.png" alt="up"/>}
                        {text < 0 &&
                        <img style={{width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '2px'}}
                             src="./resources/images/down.png" alt="down"/>}
                        {Math.abs(text).toFixed(2)}
                    </span>
                )
            }, {
                title: '去年同比(%)',
                dataIndex: 'lastYear',
                key: 'lastYear',
                nowrap: true,
                render: (text, record) => (
                    <span>
                        {text > 0 &&
                        <img style={{width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '2px'}}
                             src="./resources/images/up.png" alt="up"/>}
                        {text < 0 &&
                        <img style={{width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '2px'}}
                             src="./resources/images/down.png" alt="down"/>}
                        {Math.abs(text).toFixed(2)}
                    </span>
                )
            }],
            dataSource: monthlyData,
            autoFit: true,
            indexColumn: true,
            indexTitle: '排名',
            rowKey: record => record.area,
            scroll: {
                x: '100%',
            },
            pagination: false
        };
        
        return (
            <div className={styles.monthlyData}>
                <div className={styles.monthlyTitle}>月度污水处理量统计(TOP5)</div>
                <div className={styles.monthlyTable}>
                    <div style={{minHeight: '200px', height: '140%'}}>
                        <VtxDatagrid {...tableProps}/>
                    </div>
                </div>
            </div>
        );
    };
}
