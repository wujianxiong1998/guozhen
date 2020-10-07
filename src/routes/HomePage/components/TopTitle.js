import React from 'react';
import moment from 'moment';
import {Dropdown, Menu, Input, Icon, Popconfirm} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

const MenuItem = Menu.Item;
const Search = Input.Search;

export default class TopTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const {exitSys} = this.props;
        
        //用户名下拉
        const menu = (
            <Menu>
                {/*<Menu.Item>*/}
                {/*<span>修改密码</span>*/}
                {/*</Menu.Item>*/}
                <MenuItem>
                    <Popconfirm placement="bottom" title='确定退出此系统？'
                                onConfirm={() => exitSys()} okText="是"
                                cancelText="否">
                        <span>退出登录</span>
                    </Popconfirm>
                </MenuItem>
            </Menu>
        );
        
        return (
            <div className={styles.topTitle}>
                <img src="./resources/images/logo.png" alt="logo" style={{marginTop: '16px', float: 'left'}}/>
                <div className={styles.userBox}>
                    {/*<Search style={{float: 'left'}}/>*/}
                    {/*<img className={styles.userPic}*/}
                         {/*src="./resources/images/default_user_photo.png"*/}
                         {/*alt="default_user_photo"/>*/}
                    {/*<div style={{float: 'left'}}>*/}
                        {/*<Dropdown overlay={menu} trigger={['click']}>*/}
                            {/*<span style={{padding: '0 4px', cursor: 'pointer'}}>用户名<Icon type="down"/></span>*/}
                        {/*</Dropdown>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    };
}
