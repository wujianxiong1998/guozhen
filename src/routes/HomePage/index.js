import React from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Spin} from 'antd';
import 'moment/locale/zh-cn';
import styles from './style.less';
import TopTitle from './components/TopTitle';
import TendsComponent from './components/TendsComponent';//动态
import FastEntryComponent from './components/FastEntryComponent';//快捷入口
import WaterworksComponent from './components/WaterworksComponent';//水厂基本信息
import TodoList from './components/TodoList';//待办事项
import AlarmInformation from './components/AlarmInformation';//报警信息
import TechnicalSupport from './components/TechnicalSupport';//技术支持
import MonthlyData from './components/MonthlyData';//月度数据
import MettingSummary from './components/MettingSummary';//早会纪要
import EachUnit from './components/EachUnit';//各个水厂单位
import EffluentVolume from './components/EffluentVolume';//出水量
import CalendarPanel from './components/CalendarPanel';//日历
import PollutionPotency from './components/PollutionPotency';//污染浓度
import BottomHandle from './components/BottomHandle';//其他操作

moment.locale('zh-cn');

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    };
    
    componentDidMount() {
    }
    
    render() {
        const {dispatch, homePageM} = this.props;
        const {
            depType, factoryContent, waterFactoryContent, calendarData,
            newsList, meetingSummary, fastTab, tendsTab,
            alarmData, pollutionTab, pollutionPotencyData, waterFactoryList,
            canAuto, effluentVolume, technicalSupportData, monthlyData,
            todoData, yearDoData, hyNewsList
        } = homePageM;
        
        //顶部用户信息
        const topTitle = {
            exitSys: () => dispatch({type: 'homePageM/exitSys'})
        };
        //动态
        const tendsProps = {
            tendsTab,
            depType,
            hyNewsList,
            newsList,
            clickTab: (key) => {
                dispatch({type: 'homePageM/updateState', payload: {tendsTab: key}});
                dispatch({type: 'homePageM/getNewsList'})
            }
        };
        //快捷入口
        const fastEntryProps = {
            depType,
            factoryContent,
            tabKey: fastTab,
            clickTab: (key) => dispatch({type: 'homePageM/updateState', payload: {fastTab: key}})
        };
        //水厂基本信息
        const waterWorksProps = {
            depType,
            factoryContent,
            waterFactoryContent,
            yearDoData
        };
        //早会纪要
        const meetingSummaryProps = {
            meetingSummary,
            getList: () => dispatch({type: 'homePageM/getMeetingSummary'})
        };
        //月度数据
        const monthlyDataProps = {
            monthlyData
        };
        //生产日历
        const calendarProps = {
            calendarData,
            getList: () => dispatch({type: 'homePageM/getProductionCalendar'})
        };
        //待办事项
        const todoProps = {
            todoData,
            getData: () => dispatch({type: 'homePageM/getUnDoThingByWaterFactoryId'})
        };
        //报警信息
        const alarmprops = {
            alarmData,
            getData: () => dispatch({type: 'homePageM/getAlarmNum'}),
        };
        //技术支持
        const technicalSupportProps = {
            technicalSupportData,
            getData: () => dispatch({type: 'homePageM/getTechByWaterFactoryId'})
        };
        //污水量
        const effluentVolumeProps = {
            effluentVolume,
            mouseMove: (type) => dispatch({type: 'homePageM/updateState', payload: {canAuto: type}})
        };
        //污染物
        const pollutionPotencyProps = {
            pollutionTab,
            pollutionPotencyData,
            clickTab: (key) => dispatch({type: 'homePageM/updateState', payload: {pollutionTab: key}}),
            mouseMove: (type) => dispatch({type: 'homePageM/updateState', payload: {canAuto: type}})
        };
        //各单位
        const eachUnitProps = {
            waterFactoryList,
            canAuto,
            changeTab: (waterFactoryId) => {
                dispatch({type: 'homePageM/getLineReportByWaterFactoryId', payload: {waterFactoryId}});
                dispatch({type: 'homePageM/getBarReportByWaterFactoryId', payload: {waterFactoryId}})
            }
        };
        
        return (
            <div className={`${styles.homePage} HomePage`}
                 style={{backgroundImage: "url('./resources/images/background.png')"}}>
                <TopTitle {...topTitle}/>
                {!!depType ? <div className={styles.contentBox}>
                    <TendsComponent {...tendsProps}/>
                    <FastEntryComponent {...fastEntryProps}/>
                    <WaterworksComponent {...waterWorksProps}/>
                    <TodoList {...todoProps}/>
                    <AlarmInformation {...alarmprops}/>
                    <TechnicalSupport {...technicalSupportProps}/>
                    {(depType === 'company' || depType === 'business') && <MonthlyData {...monthlyDataProps}/>}
                    {depType === 'factory' && <MettingSummary {...meetingSummaryProps}/>}
                    {(depType === 'company' || depType === 'business') && waterFactoryList.length !== 0 &&
                    <EachUnit {...eachUnitProps}/>}
                    {(depType === 'company' || depType === 'business') && <EffluentVolume {...effluentVolumeProps}/>}
                    {depType === 'factory' && <CalendarPanel {...calendarProps}/>}
                    <PollutionPotency {...pollutionPotencyProps}/>
                    <BottomHandle/>
                </div> : <div className={styles.loading}>
                    <Spin/>
                </div>}
                <div className={styles.bottomContent}>
                    Copyright © 2003-2019&nbsp;&nbsp;&nbsp;&nbsp;
                    安徽国祯环保节能科技股份有限公司&nbsp;&nbsp;&nbsp;&nbsp;
                    电话:0551-65329201&nbsp;&nbsp;&nbsp;&nbsp;
                    MAIL:gzep@gzep.com.cn
                </div>
            </div>
        );
    };
}

const homePageProps = (state) => {
    return {
        homePageM: state.homePageM
    };
};

export default connect(homePageProps)(HomePage);
