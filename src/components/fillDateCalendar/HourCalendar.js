import React from 'react';
import styles from './HourCalendar.less';
import { Icon, Card } from 'antd';
import _find from 'lodash/find';
import moment from 'moment';

class HourCalendar extends React.Component {
    constructor(props) {
        super(props);
        const currentTime = this.props.currentTime || moment().format('YYYY-MM-DD')
        this.state = {
            month: moment(currentTime).format('MM'),//展示的月份
            year: moment(currentTime).format('YYYY'),//展示的年份
        }
    }
    changeDate=(dateString)=>{
        this.setState({
            month: moment(dateString).format('MM'),//展示的月份
            year: moment(dateString).format('YYYY'),//展示的年份
        })
    }
    componentDidMount(){

    }

    render() {
        const t = this;
        const {month,year} = t.state;
        const { disabledDate, isThisMonth, addDate, removeDate} = t.props;
        const firstWeekday = ((moment(year + '-' + month + '-01').day()) + 6 )% 7;//这个月1号是周几  0-周一  6-周六
        
        const lastDay = moment(year + '-' + month + '-01').endOf('month');
        const lastWeekDay = (lastDay.day()+6)%7;//这个月最后一天是周几

        let daysBefore = [] //在第一行周一到本月1号之前的几天
        let daysAfter = [] //在最后一行本月最后一天到周日的几天
        let daysThisMonth = [];//本月的所有天
        for(let i = 0;i<firstWeekday;i++){
            const date = moment(year + '-' + month + '-01').subtract(firstWeekday - i, 'days').format('YYYY-MM-DD')
            daysBefore.push(
                <Card.Grid
                    key={date}
                    className={`${styles.not_this_month} ${styles.contentGrid}`}>
                </Card.Grid>
            )
        }
        for (let k = 0; k < moment(year + '-' + month + '-01').daysInMonth();k++){
            const date = moment(year + '-' + month + '-01').add(k,'days').format('YYYY-MM-DD');
            daysThisMonth.push(
                <Card.Grid
                    key={date}
                    className={`${styles.contentGrid} ${isThisMonth && moment(date).isBefore(moment()) ? styles.disable : (disabledDate.includes(date) ? styles.selected : '')}`}
                    onClick={() => {
                        if (isThisMonth && moment(date).isBefore(moment())){

                        } else if (disabledDate.includes(date)){
                            removeDate(date)
                        }else {
                            addDate(date)
                        }
                    }}
                    >
                    <div className={styles.date}>
                        {moment(year + '-' + month + '-01').add(k,'days').format('DD')}
                    </div>
                    <div className={styles.data}>
                    </div>
                </Card.Grid>
            )
        }
        return (
            <div className={styles.normal}>

                <div className={styles.dayTitle}>
                        <Card.Grid className={styles.titleGrid}>周一</Card.Grid>
                        <Card.Grid className={styles.titleGrid}>周二</Card.Grid>
                        <Card.Grid className={styles.titleGrid}>周三</Card.Grid>
                        <Card.Grid className={styles.titleGrid}>周四</Card.Grid>
                        <Card.Grid className={styles.titleGrid}>周五</Card.Grid>
                        <Card.Grid className={styles.titleGrid}>周六</Card.Grid>
                        <Card.Grid className={styles.titleGrid}>周日</Card.Grid>
                </div>
                <div className={styles.content}>
                    {daysBefore}
                    {daysThisMonth}
                </div>
            </div>
        )
    }
}
export default HourCalendar