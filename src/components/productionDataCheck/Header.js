import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';

class Header extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const {location} = this.props
        return (
            <Menu
                selectedKeys={[location.pathname]}
                mode="horizontal"
            >
                <Menu.Item key="/productionTotal">
                    <Link to={"/productionTotal" + location.search}>生产总量（多厂）</Link>
                </Menu.Item>
                <Menu.Item key="/productionConsumeMultiple">
                    <Link to={"/productionConsumeMultiple" + location.search}>生产单耗（多厂）</Link>
                </Menu.Item>
                <Menu.Item key="/assayDataMultiple">
                    <Link to={"/assayDataMultiple" + location.search}>化验数据（多厂）</Link>
                </Menu.Item>
                <Menu.Item key="/assayDataSingle">
                    <Link to={"/assayDataSingle" + location.search}>化验数据（单厂）</Link>
                </Menu.Item>
                <Menu.Item key="/productionConsumeSingle">
                    <Link to={"/productionConsumeSingle" + location.search}>生产单耗（单厂）</Link>
                </Menu.Item>
            </Menu>
        );
    }
  
}

export default Header;