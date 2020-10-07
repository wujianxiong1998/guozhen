import React, { Component } from 'react'
import styles from './index.less'
export default class index extends Component {
    
    render() {
        const {title} = this.props
        return (
            <div>
                {title && <div className={styles.title}>{title}</div>}
            </div>
        )
    }
}
