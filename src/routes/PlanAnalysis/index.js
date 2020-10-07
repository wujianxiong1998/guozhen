/**
 * 计划分析
 * author :xxy
 * createTime : 2019-08-05
 */
import React from 'react';
import { connect } from 'dva';

import { VtxGrid, VtxDate } from 'vtx-ui';
const { VtxRangePicker,VtxMonthPicker } = VtxDate;
import {  Select, Tooltip, Progress, Radio,message ,Icon,Spin } from 'antd';
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import moment from 'moment'
import ReactEcharts from 'echarts-for-react';
import styles from './index.less'
import {VtxTimeUtil} from '../../utils/tools'
class PlanAnalysis extends React.Component{
    constructor(props){
        super(props)
        this.state={
            chartHeight:0
        }
    }
    componentDidMount() {
        
        this.setState({
            chartHeight: $('#smallChart') && $('#smallChart')[0] ?$('#smallChart')[0].clientHeight-40 : 0
        })
        window.addEventListener('resize', this.onWindowResize)
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.setState = () => {
            return;
        };
    }
    onWindowResize = () => {
        this.setState({
            chartHeight: $('#smallChart') && $('#smallChart')[0] ?$('#smallChart')[0].clientHeight-40 : 0
        })
    }
    render(){
        const t = this;
        const {chartHeight} = t.state
        const { searchParams, regionalCompanySelect, waterFactorySelect,
            targetProps, targetSelect, waterFactoryInfo, leftTopChartProps,
            rightTopChartProps, leftBottomChartProps, rightBottomChartProps} =this.props.planAnalysis
        const dispatch = this.props.dispatch
        const chartColors = ['#73abfe','#9fdb95','#ffc573']
        // 更新表格数据
        const getList = () => {
            dispatch({ type: 'planAnalysis/getWaterFactoryInfo' });
            dispatch({ type: 'planAnalysis/getTargetSelect' });
            dispatch({ type: 'planAnalysis/getPlanAnalysisProgress' });
            dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName:'leftTopChartProps'} });
            dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName: 'rightTopChartProps' } });
            dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName: 'leftBottomChartProps' } });
            dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName: 'rightBottomChartProps' } });
        }
        const updateState = (obj) => {
            dispatch({
                type: 'planAnalysis/updateState',
                payload: {
                    ...obj
                }
            })
        }
        const vtxGridParams = {
            query(){
                if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                    message.warn('只能查询同一年的数据')
                } else{ 
                    getList()
                }
            },
            // clear(){
            //     dispatch({ type: 'planAnalysis/initQueryParams' });
            //     getList()
            // },

            // 时间
            startTimeProps: {
                value: searchParams.startTime,
                onChange(date, dateString) {
                    updateState({
                        searchParams: {
                            startTime: dateString,
                        }
                    })
                    if (moment(searchParams.endTime).year() !== moment(dateString).year()){
                        message.warn('只能查询同一年的数据')
                    }else{
                        getList()

                    }

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isAfter(moment(searchParams.endTime)));
                }
            },
            endTimeProps: {
                value: searchParams.endTime,
                onChange(date, dateString) {
                    updateState({
                        searchParams: {
                            endTime: dateString
                        }
                    })
                    if (moment(searchParams.startTime).year() !== moment(dateString).year()) {
                        message.warn('只能查询同一年的数据')
                    } else {
                        getList()

                    }

                },
                style: {
                    width: '45%'
                },
                disabledDate(current) {
                    return current && (VtxTimeUtil.isAfterDate(current) || moment(current).isBefore(moment(searchParams.startTime)));
                }
            },
            waterFactoryIdProps: {
                value: searchParams.waterFactoryId,
                showSearch: true,
                optionFilterProp: 'children',
                placeholder: "请选择水厂名称",
                onChange(value) {
                    updateState({
                        searchParams: {
                            waterFactoryId: value,
                            
                        },
                        targetProps: {
                            targetIds: [],
                            data:[],
                        },
                        leftTopChartProps: {
                            targetIds: [],
                            data: [],
                            loading: false
                        },
                        rightTopChartProps: {
                            targetIds: [],
                            data: [],
                            loading: false
                        },
                        leftBottomChartProps: {
                            targetIds: [],
                            data: [],
                            loading: false
                        },
                        rightBottomChartProps: {
                            targetIds: [],
                            data: [],
                            loading: false
                        },
                    })
                    dispatch({ type: 'planAnalysis/getWaterFactoryInfo' });
                    dispatch({ type: 'planAnalysis/getTargetSelect' });
                },
                style: {
                    width: '100%'
                }
            },
            regionalCompanyIdProps: {
                value: searchParams.regionalCompanyId,
                placeholder: "请选择区域",
                onChange(value) {
                    updateState({
                        searchParams: {
                            regionalCompanyId: value
                        }
                    })
                    getList();
                },
                style: {
                    width: '100%'
                }
            },
        }
        //指标名称数据
        const targetItems = targetProps.data.map(item=>
            <div key={item.targetId} className={styles.progressItem}>
                <div className={styles.topLine}>
                    {item.realData}/{item.planData}
                </div>
                <div className={styles.secondLine}>
                    <div className={styles.name}>{item.targetName}</div>
                    <div className={styles.bar}>
                        <Progress strokeWidth={15} percent={(item.realData / item.planData)*100} showInfo={false} />
                    </div>
                    <div className={styles.change}>
                        {
                            item.comparePer<0?
                                <Icon style={{ color: 'green' }} type="arrow-down" />
                                :
                                <Icon style={{ color: 'red' }} type="arrow-up" />

                        }
                        {
                            Math.abs(item.comparePer)+'%(同比)'
                        }
                    </div>
                </div>
            </div>
        )
        //四个图表
        
        return (
            <div className={styles.normal}>
                <div className={styles.normal_body}>
                    <VtxGrid
                        titles={['故障时间', '区域', '水厂']}
                        gridweight={[2, 1, 1]}
                        confirm={vtxGridParams.query}
                        hiddenclearButtion
                        clear={vtxGridParams.clear}
                    >
                        <span>
                            <VtxMonthPicker {...vtxGridParams.startTimeProps} />
                            ~
                            <VtxMonthPicker {...vtxGridParams.endTimeProps} />
                        </span>
                        <Select {...vtxGridParams.regionalCompanyIdProps}>
                            {regionalCompanySelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                        <Select {...vtxGridParams.waterFactoryIdProps}>
                            {waterFactorySelect.map(item => {
                                return <Option key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                        
                    </VtxGrid>
                    <div className={styles.header}>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.waterFactoryName}>
                                【当天水厂】{waterFactoryInfo.waterFactoryName}

                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.productTypeName}>
                                【项目类型】{waterFactoryInfo.productTypeName}
                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.processSize}>
                                【设计处理水量】{waterFactoryInfo.processSize}
                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.processTypeName}>
                                【处理工艺】{waterFactoryInfo.processTypeName}
                            </Tooltip>
                        </div>
                        <div className={styles.item}>
                            <Tooltip title={waterFactoryInfo.workDayNum}>
                                【运行天数】{waterFactoryInfo.workDayNum}
                            </Tooltip>
                        </div>
                    </div>
                    <div className={styles.tabContainer}>
                        <RadioGroup value={searchParams.timeType} size="large" onChange={(e) => {
                            updateState({
                                searchParams: {
                                    timeType: e.target.value
                                }
                            })
                            if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                                message.warn('只能查询同一年的数据')
                            } else {
                                getList()
                            }
                        }}>
                            <RadioButton value='month'>月度</RadioButton>
                            <RadioButton value='year'>年度</RadioButton>
                        </RadioGroup>
                        
                    </div>
                    <div className={styles.chartContainer}>
                        <div className={styles.chartBox}>
                            <div className={styles.bigChart}>
                                <div className={styles.headerContainer}>
                                    <div className={styles.title}>
                                        指标名称
                                    </div>
                                    <div className={styles.select}>
                                        <Select
                                            value={[].concat(targetProps.targetIds)}
                                            mode='multiple'
                                            style={{width:'100%'}}
                                            placeholder='请选择指标'
                                            onChange={(value,option)=>{
                                                updateState({
                                                    targetProps:{
                                                        targetIds:value
                                                    }
                                                })
                                                if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                                                    message.warn('只能查询同一年的数据')
                                                } else {
                                                    dispatch({ type: 'planAnalysis/getPlanAnalysisProgress' });
                                                }
                                            }}
                                        >
                                        {
                                            targetSelect.map(item=>
                                            <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                        }
                                        </Select>
                                    </div>
                                </div>
                                <Spin spinning={targetProps.loading}>
                                    <div className={styles.progressContainer}>
                                        {targetItems}
                                    </div>
                                </Spin>
                            </div>
                        </div>
                        <div className={styles.chartBox}>
                            <div id='smallChart' className={styles.smallChart}> 
                                <div className={styles.headerContainer}>
                                    <div className={styles.title}>
                                        总量环比
                                    </div>
                                    <div className={styles.select}>
                                        <Select
                                            value={[].concat(leftTopChartProps.targetIds)}
                                            mode='multiple'
                                            style={{ width: '100%' }}
                                            placeholder='请选择指标'
                                            onChange={(value, option) => {
                                                if(value.length>2){
                                                    message.warn('最多选择两个指标')
                                                }else{
                                                    updateState({
                                                        leftTopChartProps: {
                                                            targetIds: value
                                                        }
                                                    })
                                                    if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                                                        message.warn('只能查询同一年的数据')
                                                    } else {
                                                        dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName:'leftTopChartProps'} });
                                                    }
                                                }
                                                
                                            }}
                                        >
                                            {
                                                targetSelect.map(item =>
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <Spin spinning={leftTopChartProps.loading}>
                                {
                                    leftTopChartProps.data.map((item,index)=>
                                        <div className={styles.chart}>
                                            <ReactEcharts
                                                key={item.name}
                                                option={{
                                                   
                                                    title:{
                                                        text:item.name,
                                                        bottom:'5px',
                                                        left:'center'
                                                    },
                                                    grid: {
                                                        left: '20%',
                                                    },
                                                    tooltip: {
                                                        trigger: 'item',
                                                    },
                                                    xAxis: {
                                                        type: 'category',
                                                        data: item.xData||[],
                                                        axisTick:{
                                                            show:false
                                                        }
                                                    },
                                                    yAxis: [
                                                        {
                                                            type: 'value',
                                                            axisLine: {
                                                                show:false
                                                            },
                                                            axisTick: {
                                                                show: false
                                                            },
                                                            splitLine:{
                                                                lineStyle: {
                                                                    type: 'dotted'
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    series: [{
                                                        type: 'bar',
                                                        data:item.yData||[],
                                                        itemStyle:{
                                                            color: chartColors[index],
                                                            barBorderRadius:5,
                                                        },
                                                        barMaxWidth:20,
                                                    }],
                                                    // yAxis: [{
                                                    //     type: 'value',
                                                    //     name: item.yData,
                                                    // }],
                                                }}
                                                notMerge={true}
                                                lazyUpdate={false}
                                                style={{ width: '100%',height:chartHeight }}
                                                />
                                            </div>
                                    )
                                }
                                </Spin>
                            </div>
                            <div className={styles.smallChart}>
                                <div className={styles.headerContainer}>
                                    <div className={styles.title}>
                                        负荷率环比
                                    </div>
                                    <div className={styles.select}>
                                        <Select
                                            value={[].concat(rightTopChartProps.targetIds)}
                                            mode='multiple'
                                            style={{ width: '100%' }}
                                            placeholder='请选择指标'
                                            onChange={(value, option) => {
                                                if (value.length > 2) {
                                                    message.warn('最多选择两个指标')
                                                } else {
                                                    updateState({
                                                        rightTopChartProps: {
                                                            targetIds: value
                                                        }
                                                    })
                                                    if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                                                        message.warn('只能查询同一年的数据')
                                                    } else {
                                                        dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName: 'rightTopChartProps' } });
                                                    }
                                                }

                                            }}
                                        >
                                            {
                                                targetSelect.map(item =>
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <Spin spinning={rightTopChartProps.loading}>
                                    {
                                        rightTopChartProps.data.map((item, index) =>
                                            <div className={styles.chart}>
                                                <ReactEcharts
                                                    key={item.name}
                                                    option={{

                                                        title: {
                                                            text: item.name,
                                                            bottom: '5px',
                                                            left: 'center'
                                                        },
                                                        grid: {
                                                            left: '20%',
                                                        },
                                                        tooltip: {
                                                            trigger: 'item',
                                                        },
                                                        xAxis: {
                                                            type: 'category',
                                                            data: item.xData || [],
                                                            axisTick: {
                                                                show: false
                                                            }
                                                        },
                                                        yAxis: [
                                                            {
                                                                type: 'value',
                                                                axisLine: {
                                                                    show: false
                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                splitLine: {
                                                                    lineStyle: {
                                                                        type: 'dotted'
                                                                    }
                                                                }
                                                            }
                                                        ],
                                                        series: [{
                                                            type: 'bar',
                                                            data: item.yData || [],
                                                            itemStyle: {
                                                                color: chartColors[index],
                                                                barBorderRadius: 5,
                                                            },
                                                            barMaxWidth: 20,
                                                        }],
                                                        // yAxis: [{
                                                        //     type: 'value',
                                                        //     name: item.yData,
                                                        // }],
                                                    }}
                                                    notMerge={true}
                                                    lazyUpdate={false}
                                                    style={{ width: '100%', height: chartHeight }}
                                                />
                                            </div>
                                        )
                                    }
                                </Spin>
                            </div>
                            <div className={styles.smallChart}>
                                <div className={styles.headerContainer}>
                                    <div className={styles.title}>
                                        总量环比
                                    </div>
                                    <div className={styles.select}>
                                        <Select
                                            value={[].concat(leftBottomChartProps.targetIds)}
                                            mode='multiple'
                                            style={{ width: '100%' }}
                                            placeholder='请选择指标'
                                            onChange={(value, option) => {
                                                if (value.length > 2) {
                                                    message.warn('最多选择两个指标')
                                                } else {
                                                    updateState({
                                                        leftBottomChartProps: {
                                                            targetIds: value
                                                        }
                                                    })
                                                    if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                                                        message.warn('只能查询同一年的数据')
                                                    } else {
                                                        dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName: 'leftBottomChartProps' } });
                                                    }
                                                }

                                            }}
                                        >
                                            {
                                                targetSelect.map(item =>
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <Spin spinning={leftBottomChartProps.loading}>
                                    {
                                        leftBottomChartProps.data.map((item, index) =>
                                            <div className={styles.chart}>
                                                <ReactEcharts
                                                    key={item.name}
                                                    option={{

                                                        title: {
                                                            text: item.name,
                                                            bottom: '5px',
                                                            left: 'center'
                                                        },
                                                        grid: {
                                                            left: '20%',
                                                        },
                                                        tooltip: {
                                                            trigger: 'item',
                                                        },
                                                        xAxis: {
                                                            type: 'category',
                                                            data: item.xData || [],
                                                            axisTick: {
                                                                show: false
                                                            }
                                                        },
                                                        yAxis: [
                                                            {
                                                                type: 'value',
                                                                axisLine: {
                                                                    show: false
                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                splitLine: {
                                                                    lineStyle: {
                                                                        type: 'dotted'
                                                                    }
                                                                }
                                                            }
                                                        ],
                                                        series: [{
                                                            type: 'bar',
                                                            data: item.yData || [],
                                                            itemStyle: {
                                                                color: chartColors[index],
                                                                barBorderRadius: 5,
                                                            },
                                                            barMaxWidth: 20,
                                                        }],
                                                        // yAxis: [{
                                                        //     type: 'value',
                                                        //     name: item.yData,
                                                        // }],
                                                    }}
                                                    notMerge={true}
                                                    lazyUpdate={false}
                                                    style={{ width: '100%', height: chartHeight }}
                                                />
                                            </div>
                                        )
                                    }
                                </Spin>
                            </div>
                            <div className={styles.smallChart}>
                                <div className={styles.headerContainer}>
                                    <div className={styles.title}>
                                        单耗环比
                                    </div>
                                    <div className={styles.select}>
                                        <Select
                                            value={[].concat(rightBottomChartProps.targetIds)}
                                            mode='multiple'
                                            style={{ width: '100%' }}
                                            placeholder='请选择指标'
                                            onChange={(value, option) => {
                                                if (value.length > 2) {
                                                    message.warn('最多选择两个指标')
                                                } else {
                                                    updateState({
                                                        rightBottomChartProps: {
                                                            targetIds: value
                                                        }
                                                    })
                                                    if (moment(searchParams.startTime).year() !== moment(searchParams.endTime).year()) {
                                                        message.warn('只能查询同一年的数据')
                                                    } else {
                                                        dispatch({ type: 'planAnalysis/getPlanAnalysisChart', payload: { itemName: 'rightBottomChartProps' } });
                                                    }
                                                }

                                            }}
                                        >
                                            {
                                                targetSelect.map(item =>
                                                    <Option key={item.id} value={item.id}>{item.name}</Option>
                                                )
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <Spin spinning={rightBottomChartProps.loading}>
                                    {
                                        rightBottomChartProps.data.map((item, index) =>
                                            <div className={styles.chart}>
                                                <ReactEcharts
                                                    key={item.name}
                                                    option={{

                                                        title: {
                                                            text: item.name,
                                                            bottom: '5px',
                                                            left: 'center'
                                                        },
                                                        grid: {
                                                            left: '20%',
                                                        },
                                                        tooltip: {
                                                            trigger: 'item',
                                                        },
                                                        xAxis: {
                                                            type: 'category',
                                                            data: item.xData || [],
                                                            axisTick: {
                                                                show: false
                                                            }
                                                        },
                                                        yAxis: [
                                                            {
                                                                type: 'value',
                                                                axisLine: {
                                                                    show: false
                                                                },
                                                                axisTick: {
                                                                    show: false
                                                                },
                                                                splitLine: {
                                                                    lineStyle: {
                                                                        type: 'dotted'
                                                                    }
                                                                }
                                                            }
                                                        ],
                                                        series: [{
                                                            type: 'bar',
                                                            data: item.yData || [],
                                                            itemStyle: {
                                                                color: chartColors[index],
                                                                barBorderRadius: 5,
                                                            },
                                                            barMaxWidth: 20,
                                                        }],
                                                        // yAxis: [{
                                                        //     type: 'value',
                                                        //     name: item.yData,
                                                        // }],
                                                    }}
                                                    notMerge={true}
                                                    lazyUpdate={false}
                                                    style={{ width: '100%', height: chartHeight }}
                                                />
                                            </div>
                                        )
                                    }
                                </Spin>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(
    ({ planAnalysis }) => ({ planAnalysis })
)(PlanAnalysis);