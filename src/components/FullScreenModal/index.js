import React from 'react';
import {Icon} from 'antd'
import styles from './index.less'
class FullScreenModal extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        const { footer, title, visible, onCancel,children} = this.props;
        return (
            <div style={{ display: visible ? 'normal' : 'none' }} className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <div className={styles.titleName}>
                            {title}
                        </div>
                        <div onClick={()=>{onCancel()}} className={styles.close}>
                            <Icon type='close' className={styles.anticon} />
                        </div>
                    </div>
                </div>
                 <div className={styles.content}>
                    {children}
                </div>
                <div className={styles.footer}>
                    {footer}
                </div>
            </div>
        )
    }
}
export default FullScreenModal