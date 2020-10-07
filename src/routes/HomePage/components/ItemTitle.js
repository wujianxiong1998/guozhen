import React from 'react';
import moment from 'moment';
import {Dropdown, Menu, Input, Icon} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

const menuItem = Menu.Item;
const Search = Input.Search;

export default class ItemTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const {tabKey, names, clickTab} = this.props;
        
        return (
            <div className={styles.itemTitle}>
                <span className={`${styles.titleText} ${tabKey === names[0].id ? styles.titleText_active : null}`}
                      style={{cursor: 'pointer'}}
                      onClick={() => clickTab(names[0].id)}>{names[0].name}</span>
                {names.length === 2 && <span style={{margin: '0 5px'}}>/</span>}
                {names.length === 2 &&
                <span className={`${tabKey === names[1].id ? styles.titleText_active : null}`}
                      style={{cursor: 'pointer'}}
                      onClick={() => clickTab(names[1].id)}>{names[1].name}</span>}
                <span className={styles.line}/>
            </div>
        );
    };
}
