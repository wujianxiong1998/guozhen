import React, { Component } from 'react';
import { connect } from 'dva';
import { VtxDate } from 'vtx-ui';
const { VtxMonthPicker } = VtxDate;
import {Button} from 'antd'
import moment from 'moment'
import _filter from 'lodash/filter'
import styles from './index.less';
import HourCalendar from '../../components/fillDateCalendar/HourCalendar'

class FillDateConfig extends React.Component{
    constructor(){
        super()
    }
    updateState = (obj) => {
        this.props.dispatch({
            type: 'fillDateConfig/updateState',
            payload: {
                ...obj
            }
        })
    }
    render(){
        const t = this;
        const { date, disabledDate, loading } = this.props.fillDateConfig
        return (
            <div className={styles.normal}>
                <div className={styles.topLine}>
                    <VtxMonthPicker
                        value={date}
                        disabledDate={(current)=>{
                            return current && moment(current).isBefore(moment().subtract(1,'month'));
                        }}
                        onChange={(date, dateString) => {
                            t.updateState({
                                date: dateString
                            })
                            t.refs.calendar.changeDate(dateString)
                            t.props.dispatch({
                                type: 'fillDateConfig/getConfigData'
                            })
                        }}
                    />
                </div>
                <div className={styles.calendar}>
                    <HourCalendar
                        isThisMonth={moment(moment().format('YYYY-MM')).isSame(moment(date))}
                        ref='calendar'
                        currentTime={date}
                        disabledDate={disabledDate}
                        changeState={t.updateState}
                        addDate={(date)=>{
                            t.updateState({
                                disabledDate: disabledDate.concat([date])
                            })
                        }}
                        removeDate={(date)=>{
                            t.updateState({
                                disabledDate: _filter(disabledDate, function (item) {
                                    return item!==date
                                })
                            })
                        }}
                    />
                </div>
                <div className={styles.btnContainer}>
                    <Button onClick={()=>{
                        t.props.dispatch({
                            type:'fillDateConfig/saveConfigData'
                        })
                    }} type='primary' loading={loading} size='large'>保存并生效</Button> 
                </div>
            </div>
        )
    }
}

export default connect(
    ({ fillDateConfig }) => ({ fillDateConfig })
)(FillDateConfig);