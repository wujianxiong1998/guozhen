import React from 'react';
import moment from 'moment';
import {Progress, Row, Col} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

export default class AlarmInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        };
    };
    
    componentDidMount() {
        this.props.getData()
    }
    
    render() {
        const {alarmData} = this.props;
        const {totalNum = '-', hasDeal = '-', noDeal = '-'} = alarmData;
        
        return (
            <div className={styles.alarmInformation}>
                <div className={styles.alarmLeft}>
                    <div style={{textAlign: 'left', paddingLeft: '10px'}}>报警信息</div>
                    <img src="./resources/images/alarm.png" alt="alarm"/>
                </div>
                <div className={styles.rightNum}>
                    <div
                        style={{height: '32%'}}>[今日报警]&nbsp;{totalNum}</div>
                    <div
                        style={{height: '32%'}}>[已解除]&nbsp;{hasDeal}</div>
                    <div
                        style={{height: '32%'}}>[未解除]&nbsp;{noDeal}</div>
                </div>
            </div>
        );
    };
}
