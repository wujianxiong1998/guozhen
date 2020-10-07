import React from 'react';
import moment from 'moment';
import {Calendar, Popover} from 'antd';
import 'moment/locale/zh-cn';
import styles from '../style.less';

moment.locale('zh-cn');

export default class CalendarPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
        const targets = $('.ant-fullcalendar-date');
        for (let i = 0; i < targets.length; i++) {
            if (targets.eq(i).children('.ant-fullcalendar-content').eq(0).children('.events').length !== 0) {
                targets.eq(i).children('.ant-fullcalendar-value').css('color', '#000')
            }
        }
        this.props.getList();
    }
    
    componentWillReceiveProps() {
        const targets = $('.ant-fullcalendar-date');
        for (let i = 0; i < targets.length; i++) {
            if (targets.eq(i).children('.ant-fullcalendar-content').eq(0).children('.events').length !== 0) {
                targets.eq(i).children('.ant-fullcalendar-value').css('color', '#000')
            }
        }
    }
    
    render() {
        const {calendarData} = this.props;
        
        const disabledDate = (endValue) => {
            if (!endValue) {
                return;
            }
            return endValue.valueOf() < moment().startOf('month') || endValue.valueOf() > moment().endOf('month');
        };
        const getListData = (value) => {
            return calendarData.map(item => {
                if (item.day === moment(value.valueOf()).format('YYYY-MM-DD')) {
                    return [true, item.title]
                }
            }).filter(item => !!item)[0];
        };
        const dateCellRender = (value) => {
            const hasEvent = getListData(value);
            return !!hasEvent ? (
                <Popover content={hasEvent[1]}>
                    <div className="events">
                        <div>{hasEvent[1].substring(0, 4)}</div>
                        {hasEvent[1].length > 4 && <div>...</div>}
                    </div>
                </Popover>
            ) : null;
        };
        //日历配置
        const calendarProps = {
            disabledDate,
            defaultValue: moment(),
            dateCellRender
        };
        
        return (
            <div className={styles.calendarPanel}>
                <div className={styles.calendarTitle}>工作日历</div>
                <div className={styles.calendarBox}>
                    <Calendar {...calendarProps}/>
                </div>
            </div>
        );
    };
}
