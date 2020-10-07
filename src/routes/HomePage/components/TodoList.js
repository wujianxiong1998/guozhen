import React from 'react';
import moment from 'moment';
import {Progress, Row, Col} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import {VtxUtil} from "../../../utils/util";

moment.locale('zh-cn');

export default class TodoList extends React.Component {
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
        const {todoData} = this.props;
        const {unDo = '-', todayNew = '-', totalDone = '-'} = todoData;
        
        const clickToDo = (type) => {
            window.open(`./#/personalAgent?&tenantId=${VtxUtil.getUrlParam('tenantId')}&userId=${VtxUtil.getUrlParam('userId')}&token=${VtxUtil.getUrlParam('token')}&tabKey=${type}`)
        };
        
        return (
            <Row className={styles.toList} style={{margin: 0, padding: 0}}>
                <Col span={5}>
                    <div style={{textAlign: 'left', paddingLeft: '10px'}}>代办事项</div>
                    <img src="./resources/images/wait.png" alt="wait"/>
                </Col>
                <Col span={19} className={styles.rightDetail}>
                    <Col span={8}>[未办]&nbsp;<span onClick={() => clickToDo('undone')}>{unDo}</span></Col>
                    <Col span={8}>[新增]&nbsp;<span onClick={() => clickToDo('undone')}>{todayNew}</span></Col>
                    <Col span={8}>[累计解决]&nbsp;<span onClick={() => clickToDo('done')}>{totalDone}</span></Col>
                </Col>
            </Row>
        );
    };
}
