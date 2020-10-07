import React from 'react';
import moment from 'moment';
import {Progress, Row, Col} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

export default class TechnicalSupport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0
        };
    };
    
    componentDidMount() {
        this.props.getData();
    }
    
    render() {
        const {technicalSupportData} = this.props;
        const {newQuestion = '-', totalDone = '-'} = technicalSupportData;
        
        return (
            <div className={styles.alarmInformation} style={{backgroundColor: '#3060ff', left: '49.74%'}}>
                <div className={styles.alarmLeft}>
                    <div style={{textAlign: 'left', paddingLeft: '10px'}}>技术支持</div>
                    <img src="./resources/images/technical.png" alt="technical"/>
                </div>
                <div className={styles.rightNum}>
                    <div
                        style={{height: '48%'}}>[新的提问]&nbsp;{newQuestion}</div>
                    <div
                        style={{height: '48%'}}>[已解决]&nbsp;{totalDone}</div>
                </div>
            </div>
        );
    };
}
