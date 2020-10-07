import React from 'react';
import moment from 'moment';
import {Dropdown, Menu, Input, Icon} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

export default class LeftContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        
        return (
            <div className={styles.leftContent}>
            
            </div>
        );
    };
}
