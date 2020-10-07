import React from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import styles from '../style.less';
import {message} from 'antd';

moment.locale('zh-cn');

export default class BottomHandle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const clickMenu = () => {
            message.info('功能开发中')
        };
        
        return (
            <div className={styles.bottomHandle}>
                <div className={styles.handleItem} style={{backgroundColor: '#44abe6'}}>
                    <div className={styles.handleContent}
                         style={{width: '170px', marginLeft: '-85px'}}
                         onClick={() => clickMenu()}
                    >
                        <img src="./resources/images/kscx.png" alt="kscx"/>
                        <div style={{float: 'right', paddingRight: '20px'}}>快速查询</div>
                    </div>
                </div>
                <div className={styles.handleItem}
                     style={{backgroundColor: '#eea13a', marginLeft: '1%'}}
                     onClick={() => clickMenu()}
                >
                    <div className={styles.handleContent} style={{width: '170px', marginLeft: '-85px'}}>
                        <img src="./resources/images/yssj.png" alt="yssj"/>
                        <div style={{float: 'right', paddingRight: '20px'}}>营收数据</div>
                    </div>
                </div>
                <div className={styles.handleItem}
                     style={{width: '100%', backgroundColor: '#43b3a0', marginTop: '0.5%'}}
                     onClick={() => clickMenu()}
                >
                    <div className={styles.handleContent} style={{width: '210px', marginLeft: '-105px'}}>
                        <img src="./resources/images/hbdbsj.png" alt="hbdbsj"/>
                        <div style={{float: 'right', paddingRight: '20px'}}>环保达标数据</div>
                    </div>
                </div>
            </div>
        );
    };
}
